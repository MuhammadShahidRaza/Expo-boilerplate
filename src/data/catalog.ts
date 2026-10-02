export type Country = {
  code: string;
  name: string;
  featured?: boolean;
  subtitle: 'live' | 'growing' | 'provinces';
};

export const countries: Country[] = [
  { code: 'US', name: 'United States', featured: true, subtitle: 'live' },
  { code: 'AF', name: 'Afghanistan', subtitle: 'growing' },
  { code: 'AL', name: 'Albania', subtitle: 'growing' },
  { code: 'DZ', name: 'Algeria', subtitle: 'growing' },
  { code: 'CA', name: 'Canada', subtitle: 'provinces' },
  { code: 'HT', name: 'Haiti', subtitle: 'growing' },
  { code: 'MX', name: 'Mexico', subtitle: 'growing' },
  { code: 'NG', name: 'Nigeria', subtitle: 'growing' },
  { code: 'FR', name: 'France', subtitle: 'growing' },
  { code: 'ES', name: 'Spain', subtitle: 'growing' },
  { code: 'BR', name: 'Brazil', subtitle: 'growing' },
  { code: 'JM', name: 'Jamaica', subtitle: 'growing' },
  { code: 'DO', name: 'Dominican Republic', subtitle: 'growing' },
  { code: 'GB', name: 'United Kingdom', subtitle: 'growing' },
  { code: 'IN', name: 'India', subtitle: 'growing' },
  { code: 'CU', name: 'Cuba', subtitle: 'growing' },
  { code: 'GH', name: 'Ghana', subtitle: 'growing' },
  { code: 'KE', name: 'Kenya', subtitle: 'growing' },
  { code: 'PH', name: 'Philippines', subtitle: 'growing' },
  { code: 'CN', name: 'China', subtitle: 'growing' },
];

export const regions: Record<string, string[]> = {
  US: [
    'Alabama',
    'Arizona',
    'California',
    'Connecticut',
    'Florida',
    'Georgia',
    'Illinois',
    'Massachusetts',
    'New Jersey',
    'New York',
    'Pennsylvania',
    'Texas',
  ],
  CA: ['Alberta', 'British Columbia', 'Ontario', 'Quebec'],
};

export const originCommunities = [
  { id: 'haitian', key: 'origins.haitian' },
  { id: 'mexican', key: 'origins.mexican' },
  { id: 'nigerian', key: 'origins.nigerian' },
  { id: 'christian', key: 'origins.christian' },
  { id: 'soccer', key: 'origins.soccer' },
  { id: 'dominican', key: 'origins.dominican' },
  { id: 'jamaican', key: 'origins.jamaican' },
] as const;

export const serviceCategories = [
  { id: 'professional', icon: 'wrench' as const, tint: 'blue' as const, chips: [] as string[] },
  {
    id: 'local',
    icon: 'store' as const,
    tint: 'gold' as const,
    chips: ['restaurants', 'barber', 'tax', 'dealer'],
  },
  { id: 'training', icon: 'graduation' as const, tint: 'red' as const, chips: [] as string[] },
  { id: 'jobs', icon: 'briefcase' as const, tint: 'brown' as const, chips: [] as string[] },
  { id: 'investment', icon: 'handshake' as const, tint: 'green' as const, chips: [] as string[] },
  { id: 'community', icon: 'heart' as const, tint: 'purple' as const, chips: [] as string[] },
  { id: 'marketplace', icon: 'bag' as const, tint: 'blue' as const, chips: [] as string[] },
];

export const jobs = [
  { id: 'sous', title: 'Sous Chef — Chez Marie', place: 'Little Haiti, FL', type: 'full' as const },
  { id: 'tax', title: 'Tax Assistant (Bilingual)', place: 'Miami, FL', type: 'part' as const },
  { id: 'property', title: 'Property Manager', place: 'Miami Beach, FL', type: 'contract' as const },
];

export const chapters = ['Little Haiti Miami', 'Wynwood Arts', 'Liberty City'] as const;

export function countryByCode(code: string | null) {
  return countries.find((country) => country.code === code) ?? null;
}
