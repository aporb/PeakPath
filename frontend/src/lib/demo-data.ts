import { StrengthProfile, StrengthDomain } from '@/types/strength';

// Demo strength profile for showcase purposes
export const DEMO_STRENGTH_PROFILE: StrengthProfile = {
  id: 'demo-profile-001',
  userId: 'Demo User',
  assessmentDate: '2024-12-01',
  strengths: [
    {
      name: 'Strategic',
      rank: 1,
      domain: StrengthDomain.STRATEGIC_THINKING,
      isTopFive: true,
      description: 'You create alternative ways to proceed. Faced with any given scenario, you can quickly spot the relevant patterns and issues.'
    },
    {
      name: 'Achiever',
      rank: 2,
      domain: StrengthDomain.EXECUTING,
      isTopFive: true,
      description: 'You work hard and possess a great deal of stamina. You take immense satisfaction in being busy and productive.'
    },
    {
      name: 'Learner',
      rank: 3,
      domain: StrengthDomain.STRATEGIC_THINKING,
      isTopFive: true,
      description: 'You have a great desire to learn and want to continuously improve. The process of learning, rather than the outcome, excites you.'
    },
    {
      name: 'Focus',
      rank: 4,
      domain: StrengthDomain.EXECUTING,
      isTopFive: true,
      description: 'You can take a direction, follow through and make the corrections necessary to stay on track. You prioritize, then act.'
    },
    {
      name: 'Responsibility',
      rank: 5,
      domain: StrengthDomain.EXECUTING,
      isTopFive: true,
      description: 'You take psychological ownership of what you say they will do. You are committed to stable values such as honesty and loyalty.'
    },
    {
      name: 'Analytical',
      rank: 6,
      domain: StrengthDomain.STRATEGIC_THINKING,
      isTopFive: false,
      description: 'You search for reasons and causes. You have the ability to think about all of the factors that might affect a situation.'
    },
    {
      name: 'Discipline',
      rank: 7,
      domain: StrengthDomain.EXECUTING,
      isTopFive: false,
      description: 'You enjoy routine and structure. Your world is best described by the order you create.'
    },
    {
      name: 'Competition',
      rank: 8,
      domain: StrengthDomain.INFLUENCING,
      isTopFive: false,
      description: 'You measure your progress against the performance of others. You strive to win first place and revel in contests.'
    },
    {
      name: 'Self-Assurance',
      rank: 9,
      domain: StrengthDomain.INFLUENCING,
      isTopFive: false,
      description: 'You feel confident in your ability to take risks and manage your own lives. You have an inner compass that gives them certainty in their decisions.'
    },
    {
      name: 'Individualization',
      rank: 10,
      domain: StrengthDomain.RELATIONSHIP_BUILDING,
      isTopFive: false,
      description: 'You are intrigued with the unique qualities of each person. You have a gift for figuring out how different people can work together productively.'
    }
  ],
  fullPDFContent: `CliftonStrengths Assessment Results

Name: Demo User
Assessment Date: December 1, 2024
Report Type: Top 10 CliftonStrengths

YOUR TOP 5 CLIFTONSTRENGTHS:

1. Strategic - You create alternative ways to proceed. Faced with any given scenario, you can quickly spot the relevant patterns and issues.

2. Achiever - You work hard and possess a great deal of stamina. You take immense satisfaction in being busy and productive.

3. Learner - You have a great desire to learn and want to continuously improve. The process of learning, rather than the outcome, excites you.

4. Focus - You can take a direction, follow through and make the corrections necessary to stay on track. You prioritize, then act.

5. Responsibility - You take psychological ownership of what you say they will do. You are committed to stable values such as honesty and loyalty.

YOUR COMPLETE STRENGTH SEQUENCE:

6. Analytical - You search for reasons and causes. You have the ability to think about all of the factors that might affect a situation.
7. Discipline - You enjoy routine and structure. Your world is best described by the order you create.
8. Competition - You measure your progress against the performance of others. You strive to win first place and revel in contests.
9. Self-Assurance - You feel confident in your ability to take risks and manage your own lives. You have an inner compass that gives them certainty in their decisions.
10. Individualization - You are intrigued with the unique qualities of each person. You have a gift for figuring out how different people can work together productively.

DOMAIN DISTRIBUTION:
- Strategic Thinking: 3 strengths (Strategic, Learner, Analytical)
- Executing: 4 strengths (Achiever, Focus, Responsibility, Discipline)  
- Influencing: 2 strengths (Competition, Self-Assurance)
- Relationship Building: 1 strength (Individualization)

This is a demo profile created for showcase purposes.`,
  domainCounts: {
    [StrengthDomain.STRATEGIC_THINKING]: 3,
    [StrengthDomain.EXECUTING]: 4,
    [StrengthDomain.INFLUENCING]: 2,
    [StrengthDomain.RELATIONSHIP_BUILDING]: 1
  }
};