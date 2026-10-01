import { chapters, regions } from '@/data/catalog';
import { businesses, seedEvents } from '@/data/content';

const extras = [
  'Miami, FL',
  'Miami Beach, FL',
  'North Miami, FL',
  'Little Haiti, Miami, FL',
  'Wynwood, Miami, FL',
  'Liberty City, Miami, FL',
  'Little Haiti Park, Miami, FL',
];

export const places = [
  ...new Set([
    ...chapters,
    ...Object.values(regions).flat(),
    ...businesses.map((item) => item.address),
    ...seedEvents.map((item) => item.place),
    ...seedEvents.map((item) => item.address),
    ...extras,
  ]),
].sort((left, right) => left.localeCompare(right));

export function matchPlaces(query: string, limit = 6) {
  const needle = query.trim().toLowerCase();
  if (needle.length < 1) return [];
  return places.filter((place) => place.toLowerCase().includes(needle) && place.toLowerCase() !== needle).slice(0, limit);
}
