import { EnhancedPersistenceManager, UploadState, UploadChunk } from './enhanced-persistence';
import { StrengthProfile } from '@/types/strength';

export interface UploadOptions {
  chunkSize?: number;
  maxRetries?: number;
  retryDelay?: number;
  onProgress?: (progress: number) => void;
  onChunkComplete?: (chunkIndex: number) => void;
  onError?: (error: Error) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export interface UploadResult {
  success: boolean;
  profile?: StrengthProfile;
  error?: string;
  uploadId: string;
}

export class UploadManager {
  private static readonly DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  private abortController: AbortController | null = null;
  private isPaused = false;

  // Generate file hash for integrity checking
  private static async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Create upload chunks
  private static createChunks(file: File, chunkSize: number): UploadChunk[] {
    const chunks: UploadChunk[] = [];
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      chunks.push({
        index: i,
        size: end - start,
        uploaded: false,
        checksum: '' // Will be calculated during upload
      });
    }

    return chunks;
  }

  // Initialize or resume upload
  static async initializeUpload(
    file: File,
    options: UploadOptions = {}
  ): Promise<{ uploadState: UploadState; isResume: boolean }> {
    const fileHash = await this.generateFileHash(file);
    const uploadId = `upload_${fileHash}_${Date.now()}`;

    // Check if there's an existing upload for this file
    const existingUploads = await EnhancedPersistenceManager.getActiveUploads();
    const existingUpload = existingUploads.find(upload => 
      upload.fileName === file.name && 
      upload.fileSize === file.size &&
      upload.status !== 'completed'
    );

    if (existingUpload) {
      return { uploadState: existingUpload, isResume: true };
    }

    // Create new upload state
    const chunkSize = options.chunkSize || this.DEFAULT_CHUNK_SIZE;
    const chunks = this.createChunks(file, chunkSize);

    const uploadState: UploadState = {
      id: uploadId,
      fileName: file.name,
      fileSize: file.size,
      progress: 0,
      chunks,
      status: 'uploading',
      resumeToken: fileHash,
      createdAt: Date.now()
    };

    await EnhancedPersistenceManager.saveUploadState(uploadState);
    return { uploadState, isResume: false };
  }

  // Upload a single chunk
  private static async uploadChunk(
    file: File,
    chunk: UploadChunk,
    uploadState: UploadState,
    signal?: AbortSignal
  ): Promise<void> {
    const start = chunk.index * (uploadState.chunks[0]?.size || this.DEFAULT_CHUNK_SIZE);
    const end = start + chunk.size;
    const chunkBlob = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunkBlob);
    formData.append('chunkIndex', chunk.index.toString());
    formData.append('uploadId', uploadState.id);
    formData.append('fileName', uploadState.fileName);
    formData.append('totalChunks', uploadState.chunks.length.toString());

    const response = await fetch('/api/upload/chunk', {
      method: 'POST',
      body: formData,
      signal
    });

    if (!response.ok) {
      throw new Error(`Chunk upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    chunk.checksum = result.checksum;
    chunk.uploaded = true;
  }

  // Complete multipart upload
  private static async completeUpload(uploadState: UploadState): Promise<StrengthProfile> {
    const response = await fetch('/api/upload/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uploadId: uploadState.id,
        fileName: uploadState.fileName,
        chunks: uploadState.chunks
      })
    });

    if (!response.ok) {
      throw new Error(`Upload completion failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.profile;
  }

  // Main upload method
  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    try {
      const opts = {
        chunkSize: UploadManager.DEFAULT_CHUNK_SIZE,
        maxRetries: UploadManager.MAX_RETRIES,
        retryDelay: UploadManager.RETRY_DELAY,
        ...options
      };

      // Initialize upload
      const { uploadState, isResume } = await UploadManager.initializeUpload(file, opts);
      
      if (isResume && opts.onResume) {
        opts.onResume();
      }

      this.abortController = new AbortController();
      let currentUploadState = uploadState;

      // Calculate initial progress for resumed uploads
      const completedChunks = currentUploadState.chunks.filter(c => c.uploaded).length;
      let progress = (completedChunks / currentUploadState.chunks.length) * 100;
      
      if (opts.onProgress) {
        opts.onProgress(progress);
      }

      // Upload chunks
      for (let i = 0; i < currentUploadState.chunks.length; i++) {
        // Check if paused
        while (this.isPaused) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Check if aborted
        if (this.abortController.signal.aborted) {
          throw new Error('Upload aborted');
        }

        const chunk = currentUploadState.chunks[i];
        
        // Skip already uploaded chunks
        if (chunk.uploaded) {
          continue;
        }

        let retryCount = 0;
        let chunkUploaded = false;

        // Retry logic for each chunk
        while (!chunkUploaded && retryCount < opts.maxRetries) {
          try {
            await UploadManager.uploadChunk(
              file, 
              chunk, 
              currentUploadState, 
              this.abortController.signal
            );
            chunkUploaded = true;

            // Update progress
            const completedChunks = currentUploadState.chunks.filter(c => c.uploaded).length;
            progress = (completedChunks / currentUploadState.chunks.length) * 100;
            currentUploadState.progress = progress;

            // Persist state
            await EnhancedPersistenceManager.saveUploadState(currentUploadState);

            // Callbacks
            if (opts.onChunkComplete) {
              opts.onChunkComplete(chunk.index);
            }
            if (opts.onProgress) {
              opts.onProgress(progress);
            }

          } catch (error) {
            retryCount++;
            if (retryCount >= opts.maxRetries) {
              currentUploadState.status = 'failed';
              currentUploadState.error = `Chunk ${chunk.index} failed after ${opts.maxRetries} retries: ${error.message}`;
              await EnhancedPersistenceManager.saveUploadState(currentUploadState);
              
              if (opts.onError) {
                opts.onError(error as Error);
              }
              
              return {
                success: false,
                error: currentUploadState.error,
                uploadId: currentUploadState.id
              };
            }

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, opts.retryDelay * retryCount));
          }
        }
      }

      // Mark as processing
      currentUploadState.status = 'processing';
      currentUploadState.progress = 100;
      await EnhancedPersistenceManager.saveUploadState(currentUploadState);

      // Complete upload
      const profile = await UploadManager.completeUpload(currentUploadState);

      // Mark as completed
      currentUploadState.status = 'completed';
      await EnhancedPersistenceManager.saveUploadState(currentUploadState);

      // Clean up after successful completion
      setTimeout(async () => {
        await EnhancedPersistenceManager.remove(`upload_${currentUploadState.id}`, { storage: 'session' });
      }, 5000); // Keep for 5 seconds for UI feedback

      return {
        success: true,
        profile,
        uploadId: currentUploadState.id
      };

    } catch (error) {
      if (opts.onError) {
        opts.onError(error as Error);
      }

      return {
        success: false,
        error: error.message,
        uploadId: 'unknown'
      };
    }
  }

  // Pause upload
  pause(): void {
    this.isPaused = true;
  }

  // Resume upload
  resume(): void {
    this.isPaused = false;
  }

  // Cancel upload
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isPaused = false;
  }

  // Resume existing upload
  static async resumeUpload(uploadId: string, file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const uploadState = await EnhancedPersistenceManager.loadUploadState(uploadId);
    
    if (!uploadState) {
      throw new Error('Upload state not found');
    }

    if (uploadState.status === 'completed') {
      throw new Error('Upload already completed');
    }

    // Validate file matches
    if (uploadState.fileName !== file.name || uploadState.fileSize !== file.size) {
      throw new Error('File does not match upload state');
    }

    uploadState.status = 'uploading';
    await EnhancedPersistenceManager.saveUploadState(uploadState);

    const manager = new UploadManager();
    return manager.uploadFile(file, options);
  }

  // Get upload progress
  static async getUploadProgress(uploadId: string): Promise<number> {
    const uploadState = await EnhancedPersistenceManager.loadUploadState(uploadId);
    return uploadState?.progress || 0;
  }

  // Clean up failed uploads
  static async cleanupFailedUploads(olderThanHours: number = 24): Promise<void> {
    const activeUploads = await EnhancedPersistenceManager.getActiveUploads();
    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);

    for (const upload of activeUploads) {
      if ((upload.status === 'failed' || upload.status === 'paused') && 
          upload.createdAt < cutoffTime) {
        await EnhancedPersistenceManager.remove(`upload_${upload.id}`, { storage: 'session' });
      }
    }
  }
}