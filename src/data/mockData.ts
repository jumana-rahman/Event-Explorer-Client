import type { EventCategory } from '../types';

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Mariana Costa',
    role: 'UX Designer, São Paulo',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&auto=format',
    quote: "Event Explorer completely changed how I discover professional events. I found three workshops that directly accelerated my career — and the booking experience was seamless from start to finish.",
  },
  {
    id: '2',
    name: 'Derek Osei',
    role: 'Software Engineer, London',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=80&h=80&fit=crop&auto=format',
    quote: "I've organized two tech meetups through the platform and the approval process was fast and transparent. The admin team responded within 24 hours and gave helpful feedback on my event listing.",
  },
  {
    id: '3',
    name: 'Yuki Tanaka',
    role: 'Startup Founder, Tokyo',
    avatar: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?w=80&h=80&fit=crop&auto=format',
    quote: "The quality curation is what sets this platform apart. Every event I've attended through Event Explorer has been exactly as described. No surprises, no disappointments — just great experiences.",
  },
  {
    id: '4',
    name: 'Fatima Al-Rashid',
    role: 'Marketing Director, Dubai',
    avatar: 'https://images.unsplash.com/photo-1489914099268-1dad649f76bf?w=80&h=80&fit=crop&auto=format',
    quote: "We used Event Explorer to promote our annual marketing summit and saw 40% higher registration than the previous year. The platform's reach and the quality of attendees were exceptional.",
  },
];

export const FAQ_ITEMS = [
  {
    q: 'How do I create an event?',
    a: 'Sign up for a free account, then click "Add Event" in the navigation. Fill in your event details — title, date, venue, description, and ticket price. Once submitted, our admin team reviews and approves events typically within 24–48 hours.',
  },
  {
    q: 'When will my event go live after submission?',
    a: 'All events go through a moderation review to ensure quality and authenticity. Most events are reviewed within 24 hours on weekdays. You\'ll receive an email notification when your event is approved or if we have any feedback.',
  },
  {
    q: 'Can I edit my event after it\'s been approved?',
    a: 'Yes — you can update event details at any time from your My Events dashboard. Minor changes (typos, time adjustments) are applied immediately. Significant changes (venue, date) may require a brief re-review.',
  },
  {
    q: 'How does ticketing work?',
    a: 'Event Explorer is a discovery and listing platform. Ticketing is handled through your own preferred system (Eventbrite, Luma, direct payment, etc.). You provide the registration link when creating your event.',
  },
  {
    q: 'Is there a fee to list events?',
    a: 'Listing events is completely free for all users. We do not charge a platform fee or take a percentage of ticket sales. Our goal is to make event discovery accessible to organizers of all sizes.',
  },
  {
    q: 'What types of events are not allowed?',
    a: 'We prohibit events that promote illegal activity, make misleading claims (including guaranteed financial returns), or violate our community guidelines. All submissions are reviewed before going live.',
  },
];

export const CATEGORY_ICONS: Record<string, string> = {
  Technology: '💻',
  Business: '💼',
  Workshop: '🛠️',
  Conference: '🎤',
  Education: '📚',
  Music: '🎵',
  Gaming: '🎮',
  Sports: '🏆',
};

export const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string }> = {
  Technology: { bg: 'rgba(59, 130, 246, 0.12)', text: '#93C5FD', border: 'rgba(59, 130, 246, 0.2)' },
  Business: { bg: 'rgba(16, 185, 129, 0.12)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.2)' },
  Workshop: { bg: 'rgba(245, 158, 11, 0.12)', text: '#FCD34D', border: 'rgba(245, 158, 11, 0.2)' },
  Conference: { bg: 'rgba(99, 102, 241, 0.12)', text: '#A5B4FC', border: 'rgba(99, 102, 241, 0.2)' },
  Education: { bg: 'rgba(236, 72, 153, 0.12)', text: '#F9A8D4', border: 'rgba(236, 72, 153, 0.2)' },
  Music: { bg: 'rgba(244, 63, 94, 0.12)', text: '#FDA4AF', border: 'rgba(244, 63, 94, 0.2)' },
  Gaming: { bg: 'rgba(139, 92, 246, 0.12)', text: '#C4B5FD', border: 'rgba(139, 92, 246, 0.2)' },
  Sports: { bg: 'rgba(251, 146, 60, 0.12)', text: '#FDBA74', border: 'rgba(251, 146, 60, 0.2)' },
};
