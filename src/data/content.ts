import type { PhotoKey } from '@/data/images';

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export type Comment = {
  id: string;
  author: string;
  avatar: PhotoKey;
  body: string;
  createdAt: string;
};

export type Post = {
  id: string;
  authorName: string;
  avatar: PhotoKey;
  chapter: string;
  createdAt: string;
  body: string;
  image?: PhotoKey | string;
  likes: number;
  shares: number;
  liked: boolean;
  saved: boolean;
  official?: boolean;
  officialTitle?: string;
  mine?: boolean;
  comments: Comment[];
};

export type PollOption = { id: string; label: string; votes: number };

export type Poll = {
  id: string;
  authorName: string;
  avatar: PhotoKey;
  createdAt: string;
  question: string;
  options: PollOption[];
  votedId: string | null;
  image?: string;
};

export type ChatMessage = {
  id: string;
  mine: boolean;
  text: string;
  createdAt: string;
  audioUri?: string;
  durationMs?: number;
};

export type Thread = {
  id: string;
  name: string;
  avatar: PhotoKey;
  kind: 'user' | 'business' | 'organization';
  online: boolean;
  unread: number;
  messages: ChatMessage[];
};

export type CommunityRef = {
  id: string;
  code: string;
  name: string;
  state?: string;
  active: boolean;
};

export type Listing = {
  id: string;
  title: string;
  price: number;
  category: 'electronics' | 'clothing' | 'furniture' | 'food';
  condition: 'new' | 'used';
  image: PhotoKey | string;
  sellerName: string;
  sellerAvatar: PhotoKey;
  description: string;
  quantity: number;
};

export type EventItem = {
  id: string;
  title: string;
  day: string;
  month: string;
  place: string;
  dateLabel: string;
  time: string;
  address: string;
  about: string;
  host: string;
  image: PhotoKey | string;
  going: boolean | null;
  attendees: number;
};

export type Notice = {
  id: string;
  kind: 'like' | 'comment' | 'alert' | 'message' | 'follow' | 'event';
  body: string;
  createdAt: string;
  unread: boolean;
  section: 'today' | 'earlier';
};

export type Business = {
  id: string;
  name: string;
  category: string;
  filter: string;
  rating: number | null;
  ratings: number;
  distance: string;
  tier: 'platinum' | 'gold' | 'basic' | 'silver';
  verified: boolean;
  sponsored?: boolean;
  image: PhotoKey;
  initials: string;
  blurb: string;
  address: string;
  hours: string;
  open: boolean;
  phone: string;
  followers: string;
  views: string;
  menu: { id: string; name: string; price: string; image: PhotoKey }[];
  review?: { name: string; initials: string; text: string };
};

export type AssistantMessage = {
  id: string;
  mine: boolean;
  text: string;
  cards?: { id: string; name: string; meta: string; initials: string }[];
};

const sampleComments: Comment[] = [
  {
    id: 'c1',
    author: 'Sophie Blanc',
    avatar: 'portrait',
    body: 'I will be there with gloves. Thank you for organizing this.',
    createdAt: ago(80),
  },
  {
    id: 'c2',
    author: 'Jean-Baptiste D.',
    avatar: 'portraitM',
    body: 'Great initiative. I can bring extra bags.',
    createdAt: ago(50),
  },
];

export const seedPosts: Post[] = [
  {
    id: 'post-cleanup',
    authorName: 'Marie Celestin',
    avatar: 'portrait',
    chapter: 'Little Haiti Miami',
    createdAt: ago(120),
    body: "Community clean-up this Saturday at 9am! Meet at Joseph Caleb Center. Gloves and bags provided. Let's keep our streets beautiful.",
    image: 'cleanup',
    likes: 34,
    shares: 12,
    liked: false,
    saved: false,
    comments: sampleComments,
  },
  {
    id: 'post-road',
    authorName: 'Miami-Dade Emergency Mgmt',
    avatar: 'portrait',
    chapter: 'Little Haiti Miami',
    createdAt: ago(240),
    body: 'NW 2nd Ave between 62nd and 79th Street will be closed Friday 8pm–6am for water main repairs. Use alternate routes including N Miami Ave or NW 7th Ave. Emergency vehicles will have guarded access.',
    likes: 34,
    shares: 12,
    liked: false,
    saved: false,
    official: true,
    officialTitle: 'ROAD CLOSURE',
    comments: sampleComments,
  },
];

export const seedPolls: Poll[] = [
  {
    id: 'poll-trail',
    authorName: 'Marcus Chen',
    avatar: 'portrait',
    createdAt: ago(300),
    question: 'Which trail should our Saturday morning group tackle for the late spring wildflower bloom?',
    votedId: null,
    options: [
      { id: 'opt-1', label: 'Silver Falls Canyon Loop', votes: 134 },
      { id: 'opt-2', label: 'Dog Mountain Summit', votes: 99 },
      { id: 'opt-3', label: 'Eagle Creek to Punchbowl', votes: 85 },
    ],
  },
];

export const seedThreads: Thread[] = [
  {
    id: 'marie',
    name: 'Marie Celestin',
    avatar: 'portrait',
    kind: 'user',
    online: true,
    unread: 2,
    messages: [
      { id: 'm1', mine: false, text: 'Hey! Are you going to the community clean-up on Saturday?', createdAt: ago(40) },
      { id: 'm2', mine: true, text: 'Yes for sure! What time are you heading over?', createdAt: ago(37) },
      { id: 'm3', mine: false, text: "I'm planning to be there at 9am when it starts. Want to carpool?", createdAt: ago(34) },
      { id: 'm4', mine: true, text: "That would be great! I can pick you up at 8:45. I'll bring extra gloves too", createdAt: ago(32) },
      { id: 'm5', mine: false, text: 'Perfect! See you then. Will you be at the festival next weekend too?', createdAt: ago(29) },
      { id: 'm6', mine: true, text: "Definitely, wouldn't miss it. I heard they have live kompa this year!", createdAt: ago(27) },
    ],
  },
  {
    id: 'chez',
    name: 'Chez Marie Restaurant',
    avatar: 'cafe',
    kind: 'business',
    online: false,
    unread: 1,
    messages: [{ id: 'b1', mine: false, text: 'Your order is ready for pickup!', createdAt: ago(18) }],
  },
  {
    id: 'jean',
    name: 'Jean-Baptiste D.',
    avatar: 'portraitM',
    kind: 'user',
    online: true,
    unread: 0,
    messages: [{ id: 'j1', mine: false, text: 'Thanks for the info bro', createdAt: ago(60) }],
  },
  {
    id: 'county',
    name: 'Miami-Dade County',
    avatar: 'portrait',
    kind: 'organization',
    online: false,
    unread: 0,
    messages: [{ id: 'o1', mine: false, text: 'Your report has been received.', createdAt: ago(180) }],
  },
  {
    id: 'sophie',
    name: 'Sophie Blanc',
    avatar: 'portrait',
    kind: 'user',
    online: false,
    unread: 0,
    messages: [{ id: 's1', mine: false, text: 'See you at the festival!', createdAt: ago(300) }],
  },
  {
    id: 'cultural',
    name: 'Little Haiti Cultural Ctr.',
    avatar: 'festival',
    kind: 'organization',
    online: false,
    unread: 0,
    messages: [{ id: 'k1', mine: false, text: 'Tickets for the Heritage Festival are now on sale.', createdAt: ago(60 * 24) }],
  },
  {
    id: 'pierre',
    name: 'Pierre Laurent',
    avatar: 'portraitM',
    kind: 'user',
    online: true,
    unread: 0,
    messages: [{ id: 'p1', mine: false, text: "OK let me know when you're ready", createdAt: ago(60 * 48) }],
  },
];

export const seedListings: Listing[] = [
  {
    id: 'iphone',
    title: 'iPhone 13 Pro - 256GB',
    price: 620,
    category: 'electronics',
    condition: 'used',
    image: 'phone',
    sellerName: 'Jean P.',
    sellerAvatar: 'portrait',
    description: 'Lightly used phone with a clear case and original cable. Battery health is strong and it is unlocked for any carrier.',
    quantity: 1,
  },
  {
    id: 'dress',
    title: 'Hand-Embroidered Haitian Dress',
    price: 85,
    category: 'clothing',
    condition: 'new',
    image: 'clothes',
    sellerName: 'Marie C.',
    sellerAvatar: 'portrait',
    description: 'Handmade dress with traditional embroidery. One size, soft cotton, never worn.',
    quantity: 1,
  },
  {
    id: 'chair',
    title: 'Vintage Rocking Chair',
    price: 620,
    category: 'furniture',
    condition: 'used',
    image: 'chair',
    sellerName: 'Jean P.',
    sellerAvatar: 'portrait',
    description: 'Cream tufted rocking chair in excellent condition. Pickup in Little Haiti.',
    quantity: 1,
  },
  {
    id: 'pikliz',
    title: 'Homemade Pikliz Sauce (3-pack)',
    price: 85,
    category: 'food',
    condition: 'new',
    image: 'food',
    sellerName: 'Marie C.',
    sellerAvatar: 'portrait',
    description: 'Small-batch pikliz made this week. Three jars, best within two weeks.',
    quantity: 3,
  },
];

export const seedEvents: EventItem[] = [
  {
    id: 'heritage',
    title: 'Haitian Heritage Festival 2026',
    day: '14',
    month: 'Sep',
    place: 'Little Haiti Park',
    dateLabel: 'Saturday, September 14, 2026',
    time: '10:00 AM – 6:00 PM',
    address: '212 NE 59th Terrace, Miami, FL',
    about:
      'Join us for the annual Haitian Heritage Festival celebrating the rich culture, music, art, and food of Haiti. Live performances by local musicians, food vendors, art exhibitions, and cultural showcases for all ages. Free admission for children under 12.',
    host: 'Little Haiti Cultural Center',
    image: 'festival',
    going: true,
    attendees: 142,
  },
  {
    id: 'business-night',
    title: 'Business Night',
    day: '21',
    month: 'Sep',
    place: 'Miami',
    dateLabel: 'Monday, September 21, 2026',
    time: '6:00 PM – 9:00 PM',
    address: 'Wynwood, Miami, FL',
    about: 'An evening for community business owners to meet partners, mentors, and neighbors.',
    host: 'CC World Miami',
    image: 'interior',
    going: null,
    attendees: 38,
  },
];

export const seedNotices: Notice[] = [
  { id: 'n1', kind: 'like', body: 'Marie Celestin and 14 others liked your post about the clean-up.', createdAt: ago(2), unread: true, section: 'today' },
  { id: 'n2', kind: 'comment', body: 'Jean-Baptiste commented: “Great initiative! I’ll definitely be there.”', createdAt: ago(15), unread: true, section: 'today' },
  { id: 'n3', kind: 'alert', body: 'EMERGENCY: Water service disruption reported in your area. Check updates.', createdAt: ago(60), unread: true, section: 'today' },
  { id: 'n4', kind: 'message', body: 'Chez Marie Restaurant sent you a message about your inquiry.', createdAt: ago(120), unread: true, section: 'today' },
  { id: 'n5', kind: 'follow', body: 'Sophie Blanc started following you.', createdAt: ago(240), unread: false, section: 'earlier' },
  { id: 'n6', kind: 'event', body: 'Reminder: Haitian Heritage Festival is in 3 days. Don’t forget!', createdAt: ago(360), unread: false, section: 'earlier' },
  { id: 'n7', kind: 'like', body: 'Pierre Laurent and 6 others liked your comment.', createdAt: ago(400), unread: false, section: 'earlier' },
];

export const businesses: Business[] = [
  {
    id: 'chez-marie',
    name: 'Chez Marie Restaurant',
    category: 'Creole restaurant',
    filter: 'restaurants',
    rating: 4.8,
    ratings: 126,
    distance: '0.8 mi',
    tier: 'platinum',
    verified: true,
    image: 'cafe',
    initials: 'CM',
    blurb: 'Authentic Haitian cuisine in the heart of Little Haiti. Family-owned since 1998.',
    address: '5921 NW 2nd Ave, Miami, FL 33127',
    hours: 'Mon–Sat 11AM–10PM',
    open: true,
    phone: '+13055550198',
    followers: '1.2K',
    views: '1.2K',
    menu: [
      { id: 'griot', name: 'Griot Plate', price: '$18', image: 'cafe' },
      { id: 'soup', name: 'Soup Joumou', price: '$12', image: 'food' },
    ],
    review: { name: 'Sophie Blanc', initials: 'SB', text: 'Verified transaction · Best griot in Miami, friendly service.' },
  },
  {
    id: 'pierre-tax',
    name: 'Pierre Tax & Accounting',
    category: 'Tax Preparer',
    filter: 'tax',
    rating: 4.6,
    ratings: 58,
    distance: '1.4 mi',
    tier: 'gold',
    verified: true,
    image: 'cafe',
    initials: 'PT',
    blurb: 'Bilingual tax preparation for families and small businesses.',
    address: '100 NE 79th St, Miami, FL',
    hours: 'Mon–Fri 9AM–6PM',
    open: true,
    phone: '+13055550144',
    followers: '640',
    views: '800',
    menu: [],
  },
  {
    id: 'jean-barber',
    name: 'Jean-Baptiste Barber Shop',
    category: 'Barber Shop',
    filter: 'barber',
    rating: null,
    ratings: 0,
    distance: '2.1 mi',
    tier: 'basic',
    verified: false,
    image: 'interior',
    initials: 'JB',
    blurb: 'Neighborhood cuts, fades, and beard trims.',
    address: 'Little Haiti, Miami, FL',
    hours: 'Tue–Sat 10AM–7PM',
    open: false,
    phone: '+13055550110',
    followers: '210',
    views: '300',
    menu: [],
  },
  {
    id: 'ahs',
    name: 'AHS Property Builders',
    category: 'Real estate',
    filter: 'dealer',
    rating: 4.6,
    ratings: 40,
    distance: '3.2 mi',
    tier: 'platinum',
    verified: true,
    sponsored: true,
    image: 'build',
    initials: 'AH',
    blurb: 'Local builders for homes and small commercial spaces.',
    address: 'Miami, FL',
    hours: 'Mon–Fri 8AM–5PM',
    open: true,
    phone: '+13055550177',
    followers: '900',
    views: '2.1K',
    menu: [],
  },
];

export const seedAssistant: AssistantMessage[] = [
  { id: 'a1', mine: false, text: 'Hello! How can I help you today?' },
];

export const demoProfile = {
  fullName: 'Marcus Williams',
  email: 'marcus@ccworld.app',
  password: 'Password1!',
  bio: 'Community advocate & local food lover.\nLittle Haiti proud',
};
