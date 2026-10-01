export const marks = {
  logo: require('@/assets/images/brand/cc-logo.png'),
  globe: require('@/assets/images/brand/cc-globe.png'),
  google: require('@/assets/images/brand/google.png'),
  apple: require('@/assets/images/brand/apple.png'),
  person: require('@/assets/images/brand/person.png'),
  sparkles: require('@/assets/images/brand/sparkles.png'),
  pin: require('@/assets/images/brand/pin.png'),
  calendar: require('@/assets/images/brand/calendar.png'),
  edit: require('@/assets/images/brand/edit.png'),
  list: require('@/assets/images/brand/list.png'),
  bag: require('@/assets/images/brand/bag.png'),
  gold: require('@/assets/images/brand/gold-disc.png'),
} as const;

export type MarkName = keyof typeof marks;

export const photos = {
  logo: marks.logo,
  globe: marks.globe,
  cafe: require('@/assets/images/cc/cc-cafe.jpg'),
  build: require('@/assets/images/cc/cc-build.jpg'),
  cleanup: require('@/assets/images/cc/cc-cleanup.jpg'),
  festival: require('@/assets/images/cc/cc-festival.jpg'),
  interior: require('@/assets/images/cc/cc-interior.jpg'),
  phone: require('@/assets/images/cc/cc-phone.jpg'),
  clothes: require('@/assets/images/cc/cc-clothes.jpg'),
  chair: require('@/assets/images/cc/cc-chair.jpg'),
  food: require('@/assets/images/cc/cc-food.jpg'),
  portrait: require('@/assets/images/cc/cc-portrait.jpg'),
  portraitM: require('@/assets/images/cc/cc-portrait-m.jpg'),
} as const;

export type PhotoKey = keyof typeof photos;

export function resolvePhoto(source: PhotoKey | string) {
  if (source in photos) return photos[source as PhotoKey];
  return { uri: source };
}
