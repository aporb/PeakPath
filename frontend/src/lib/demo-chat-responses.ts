import { StrengthProfile, ChatMessage } from '@/types/strength';

export interface DemoResponse {
  content: string;
  category: 'general' | 'strength-specific' | 'development' | 'career' | 'team';
  triggers: string[]; // Keywords that might trigger this response
  strengthContext?: string; // Specific strength this response relates to
  followUpSuggestions?: string[];
}

// Comprehensive demo response database
export const DEMO_RESPONSES: DemoResponse[] = [
  // General coaching responses
  {
    content: `Welcome to your personalized CliftonStrengths coaching experience! I can see from your profile that you have a unique combination of **Strategic**, **Achiever**, **Learner**, **Focus**, and **Responsibility** as your top 5 strengths.

This powerful combination suggests you're someone who:
- **Thinks ahead strategically** while **executing with dedication**
- **Continuously learns** while **maintaining laser focus**
- **Takes ownership** of outcomes and commitments

What would you like to explore about your strengths today? I can help with career development, team dynamics, or specific challenges you're facing.`,
    category: 'general',
    triggers: ['hello', 'hi', 'start', 'help', 'introduction'],
    followUpSuggestions: [
      'How can I use my Strategic strength in my current role?',
      'What development activities suit my Achiever nature?',
      'How do my top strengths work together?'
    ]
  },

  // Strategic strength responses
  {
    content: `Your **Strategic** strength is fascinating - it's your #1 talent! This means you naturally see patterns and alternative pathways that others might miss.

Here's how to leverage your Strategic thinking:

**In your current role:**
- Volunteer for planning initiatives and future-focused projects
- Share your "what if" scenarios in meetings - your team needs this perspective
- Use your pattern recognition to identify potential risks or opportunities

**Daily practices:**
- Set aside 15-30 minutes for "thinking time" each day
- Create multiple scenarios for important decisions
- Document your strategic insights - they're valuable to your organization

Your Strategic thinking paired with your **Achiever** drive creates a powerful combination for turning vision into reality. You don't just think strategically - you execute on it!

What specific situation would you like to apply strategic thinking to?`,
    category: 'strength-specific',
    triggers: ['strategic', 'strategy', 'planning', 'thinking', 'future', 'patterns'],
    strengthContext: 'Strategic',
    followUpSuggestions: [
      'How can I share my strategic ideas more effectively?',
      'What if my team doesn\'t value strategic thinking?',
      'How do I balance strategic thinking with immediate execution?'
    ]
  },

  // Achiever strength responses  
  {
    content: `Your **Achiever** strength is such a driving force in your profile - ranked #2! You have this incredible internal motor that keeps you productive and satisfied through accomplishment.

**Maximizing your Achiever strength:**

**Energy management:**
- Schedule your most challenging work during your peak energy hours
- Build in small wins throughout your day to maintain momentum
- Create visible progress indicators for long-term projects

**Goal setting:**
- Break large objectives into daily actionable items
- Celebrate completion of tasks - this feeds your Achiever satisfaction
- Set stretch goals that challenge you without overwhelming

**Team contribution:**
- You're likely the one who gets things done when others are still talking
- Share your productivity systems with colleagues
- Volunteer for high-impact projects that need reliable execution

Combined with your **Focus** and **Responsibility** strengths, you're someone who not only works hard but works on the right things with integrity.

What goals are you working toward where your Achiever drive could be better utilized?`,
    category: 'strength-specific',
    triggers: ['achiever', 'productive', 'goals', 'completion', 'busy', 'accomplish'],
    strengthContext: 'Achiever',
    followUpSuggestions: [
      'How do I avoid burnout with my high achievement drive?',
      'What if I get frustrated when others don\'t match my pace?',
      'How can I help my team become more achievement-oriented?'
    ]
  },

  // Learner strength responses
  {
    content: `Your **Learner** strength (#3) is such a gift! You're energized by the process of learning itself, not just the outcome. This creates incredible opportunities for continuous growth.

**Leveraging your Learner talent:**

**Professional development:**
- Seek roles with learning curves and new challenges
- Document your learning journey - it helps others and reinforces your growth
- Become the go-to person for new skills or industry trends

**Learning strategies that fit you:**
- Mix formal learning (courses, certifications) with experiential learning
- Find mentors in areas you want to develop
- Teach others - it accelerates your own learning

**Career positioning:**
- Highlight your adaptability and growth mindset in career conversations
- Volunteer for projects requiring new skills
- Stay current with industry evolution - your natural curiosity is an asset

Your **Learner** strength combined with **Strategic** thinking means you don't just learn randomly - you learn with purpose and can see how new knowledge connects to bigger patterns.

What new area of learning are you most excited about right now?`,
    category: 'strength-specific',
    triggers: ['learner', 'learning', 'growth', 'development', 'curiosity', 'skills'],
    strengthContext: 'Learner',
    followUpSuggestions: [
      'How do I balance learning with getting work done?',
      'What if my organization doesn\'t support learning?',
      'How can I learn most effectively given my other strengths?'
    ]
  },

  // Focus strength responses
  {
    content: `**Focus** is your #4 strength, and it's incredibly valuable in today's distracted world! You have the ability to take direction, filter out distractions, and follow through to completion.

**Maximizing your Focus strength:**

**Daily productivity:**
- Start each day by identifying your 2-3 most important priorities
- Create distraction-free work environments when possible
- Use your natural ability to say "no" to protect your priorities

**Project management:**
- Volunteer to lead initiatives that need sustained attention
- Help teams stay on track when meetings get off-topic
- Create systems that help others maintain focus too

**Decision making:**
- Trust your instinct to prioritize - you naturally know what matters most
- Use timeboxing to give focused attention to different areas
- Regular course corrections are part of your process - embrace them

Your **Focus** works beautifully with your **Achiever** drive and **Responsibility** - you don't just focus on anything, you focus on what you've committed to accomplish.

What important goal needs your focused attention right now?`,
    category: 'strength-specific',
    triggers: ['focus', 'priorities', 'distraction', 'concentration', 'direction'],
    strengthContext: 'Focus',
    followUpSuggestions: [
      'How do I maintain focus in a chaotic work environment?',
      'What if my priorities keep changing from external demands?',
      'How can I help my team become more focused?'
    ]
  },

  // Responsibility strength responses
  {
    content: `Your **Responsibility** strength (#5) is the foundation that makes your other talents so trustworthy! You take psychological ownership of what you commit to, which builds incredible credibility.

**Leveraging your Responsibility strength:**

**Professional reputation:**
- Your word is your bond - this builds long-term trust
- Take on commitments that align with your values and capacity
- Help establish reliable processes and standards in your work

**Leadership development:**
- People naturally trust those with strong Responsibility
- Mentor others on the importance of follow-through
- Take calculated risks knowing you'll own the outcomes

**Work-life integration:**
- Be intentional about what you say "yes" to - your commitment runs deep
- Build systems that help you track and fulfill commitments
- Practice healthy boundaries while maintaining your integrity

Your **Responsibility** combined with **Focus** and **Achiever** creates a powerful execution engine - you commit to the right things and see them through.

What commitment are you most proud of following through on recently?`,
    category: 'strength-specific',
    triggers: ['responsibility', 'commitment', 'ownership', 'reliable', 'trustworthy'],
    strengthContext: 'Responsibility',
    followUpSuggestions: [
      'How do I avoid over-committing due to my sense of responsibility?',
      'What if others take advantage of my reliable nature?',
      'How can I help others develop more responsibility?'
    ]
  },

  // Career development responses
  {
    content: `Looking at your unique strengths profile, you have incredible career potential! Your combination suggests roles where you can **think strategically**, **execute consistently**, and **grow continuously**.

**Career paths that fit your strengths:**

**Strategic roles:** Planning, consulting, business development, product strategy
- Your **Strategic** + **Learner** combination thrives here

**Execution-focused leadership:** Operations, project management, team leadership
- Your **Achiever** + **Focus** + **Responsibility** excel in these areas

**Development-oriented positions:** Training, organizational development, continuous improvement
- Your **Learner** strength with **Strategic** thinking drives innovation

**Key career strategies:**
1. **Seek variety:** Your Learner needs new challenges to stay engaged
2. **Build on reliability:** Your Responsibility creates trust - leverage this
3. **Think long-term:** Your Strategic strength should inform career planning
4. **Focus your efforts:** Don't chase every opportunity - use your Focus strength

What type of role or responsibility are you most interested in developing toward?`,
    category: 'career',
    triggers: ['career', 'job', 'role', 'promotion', 'development', 'future', 'growth'],
    followUpSuggestions: [
      'What industries best suit my strengths combination?',
      'How do I communicate my strengths in interviews?',
      'What skills should I develop to complement my strengths?'
    ]
  },

  // Team dynamics responses
  {
    content: `Your strengths profile makes you a valuable team contributor! Let me help you understand how to maximize your impact while working with others.

**Your natural team contributions:**

**As a Strategic thinker:**
- You see the bigger picture and alternative paths
- Help teams avoid pitfalls by thinking ahead
- Bring valuable "what if" perspectives to planning

**As an Achiever:**
- You're the engine that helps teams deliver results
- Model productivity and work ethic for others
- Keep momentum going when energy lags

**As a Learner:**
- You bring new ideas and continuous improvement mindset
- Help teams adapt to change more effectively
- Share knowledge and encourage development

**Working with different team types:**

**High-energy teams:** Your Achiever fits naturally, but use Focus to keep direction
**Creative teams:** Your Strategic strength adds practical planning to innovation
**Detailed teams:** Your Responsibility ensures follow-through on decisions

**Potential team challenges:**
- Others may not match your Achiever pace - practice patience
- Your Focus might seem rigid to flexible teammates - explain your "why"
- Your high standards (Responsibility) might intimidate others - encourage, don't judge

What team dynamics are you currently navigating?`,
    category: 'team',
    triggers: ['team', 'colleagues', 'collaboration', 'working', 'others', 'group'],
    followUpSuggestions: [
      'How do I work with teammates who have different strengths?',
      'What if my team doesn\'t value strategic thinking?',
      'How can I motivate others without overwhelming them?'
    ]
  },

  // Development and growth responses
  {
    content: `Your development opportunities are exciting given your strengths profile! You have a natural growth engine with **Learner** and the execution power to implement what you learn.

**Development priorities based on your strengths:**

**Strategic Development:**
- Study successful strategic planning processes
- Practice scenario planning and systems thinking
- Learn to communicate strategic insights more effectively

**Execution Excellence:**
- Develop project management and operational skills
- Study productivity systems and time management
- Learn to balance multiple priorities without losing focus

**Leadership Growth:**
- Your Responsibility creates natural leadership credibility
- Develop coaching and mentoring skills (your Learner loves helping others grow)
- Practice influence skills to share your Strategic insights

**Specific development activities:**
1. **Read strategically:** Choose books that develop your thinking frameworks
2. **Seek stretch assignments:** Your Achiever + Focus can handle challenges
3. **Find mentors:** Your Learner thrives with guidance from experts
4. **Teach others:** Sharing knowledge accelerates your own development

**Watch out for:**
- Learning for learning's sake without practical application
- Taking on too much because of your Achiever + Responsibility combination
- Getting frustrated with others who don't share your drive

What specific area would you like to develop first?`,
    category: 'development',
    triggers: ['development', 'improve', 'grow', 'skills', 'better', 'learn'],
    followUpSuggestions: [
      'What leadership development fits my strengths?',
      'How do I develop skills outside my natural strengths?',
      'What development experiences would challenge me appropriately?'
    ]
  }
];

// Function to find relevant responses based on user message
export function findRelevantResponses(
  message: string, 
  strengthContext?: string,
  conversationHistory: ChatMessage[] = []
): DemoResponse[] {
  const messageLower = message.toLowerCase();
  const relevantResponses: DemoResponse[] = [];

  // First, look for strength-specific responses if context is provided
  if (strengthContext) {
    const strengthResponses = DEMO_RESPONSES.filter(response => 
      response.strengthContext === strengthContext &&
      response.triggers.some(trigger => messageLower.includes(trigger.toLowerCase()))
    );
    relevantResponses.push(...strengthResponses);
  }

  // Then look for general responses based on triggers
  const generalResponses = DEMO_RESPONSES.filter(response => 
    response.triggers.some(trigger => messageLower.includes(trigger.toLowerCase())) &&
    !relevantResponses.includes(response)
  );
  relevantResponses.push(...generalResponses);

  // If no specific matches, look for category-based responses
  if (relevantResponses.length === 0) {
    const categoryMap = {
      'career': ['job', 'work', 'career', 'role', 'position'],
      'team': ['team', 'colleagues', 'collaboration', 'others'],
      'development': ['grow', 'improve', 'develop', 'learn', 'skill'],
      'general': []
    };

    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        const categoryResponses = DEMO_RESPONSES.filter(r => r.category === category);
        relevantResponses.push(...categoryResponses);
        break;
      }
    }
  }

  // Fallback to general responses if still nothing found
  if (relevantResponses.length === 0) {
    relevantResponses.push(...DEMO_RESPONSES.filter(r => r.category === 'general'));
  }

  return relevantResponses.slice(0, 3); // Limit to top 3 responses
}

// Default fallback responses for when no specific match is found
export const FALLBACK_RESPONSES: DemoResponse[] = [
  {
    content: `That's a great question! Based on your strengths profile with **Strategic**, **Achiever**, **Learner**, **Focus**, and **Responsibility**, I can see several ways to approach this.

Your **Strategic** thinking combined with your **Learner** nature suggests you'd benefit from exploring different angles on this topic. Your **Achiever** and **Focus** strengths mean you'll want practical, actionable insights.

Could you tell me more about the specific context or challenge you're facing? I can provide more targeted guidance based on your unique strengths combination.`,
    category: 'general',
    triggers: [],
    followUpSuggestions: [
      'Can you be more specific about the situation?',
      'What outcome are you hoping to achieve?',
      'Which of your strengths do you think applies most here?'
    ]
  }
];

// Get a random response from available options
export function selectBestResponse(responses: DemoResponse[]): DemoResponse {
  if (responses.length === 0) {
    return FALLBACK_RESPONSES[0];
  }
  
  // Prefer strength-specific responses over general ones
  const strengthSpecific = responses.filter(r => r.strengthContext);
  if (strengthSpecific.length > 0) {
    return strengthSpecific[Math.floor(Math.random() * strengthSpecific.length)];
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
}