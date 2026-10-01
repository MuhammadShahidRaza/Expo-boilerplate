import { Image } from 'expo-image';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { marks, type MarkName } from '@/data/images';

export type IconName =
  | 'back'
  | 'search'
  | 'pin'
  | 'mail'
  | 'lock'
  | 'person'
  | 'eye'
  | 'eyeOff'
  | 'camera'
  | 'chevronRight'
  | 'chevronDown'
  | 'check'
  | 'close'
  | 'plus'
  | 'home'
  | 'chat'
  | 'sparkles'
  | 'bell'
  | 'globe'
  | 'wrench'
  | 'store'
  | 'briefcase'
  | 'grid'
  | 'image'
  | 'poll'
  | 'send'
  | 'heart'
  | 'heartFill'
  | 'comment'
  | 'share'
  | 'bookmark'
  | 'bookmarkFill'
  | 'star'
  | 'phone'
  | 'video'
  | 'mic'
  | 'calendar'
  | 'clock'
  | 'directions'
  | 'verified'
  | 'settings'
  | 'edit'
  | 'info'
  | 'shield'
  | 'doc'
  | 'logout'
  | 'users'
  | 'warning'
  | 'translate'
  | 'callEnd'
  | 'trash'
  | 'attach'
  | 'smile'
  | 'graduation'
  | 'handshake'
  | 'bag'
  | 'arrowRight'
  | 'more'
  | 'flag'
  | 'megaphone'
  | 'filter'
  | 'sun'
  | 'moon'
  | 'device'
  | 'play'
  | 'pause';

const names: Record<IconName, SymbolViewProps['name']> = {
  back: { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  pin: { ios: 'mappin', android: 'location_on', web: 'location_on' },
  mail: { ios: 'envelope', android: 'mail', web: 'mail' },
  lock: { ios: 'lock', android: 'lock', web: 'lock' },
  person: { ios: 'person', android: 'person', web: 'person' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  eyeOff: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  camera: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  chevronDown: { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  chat: { ios: 'bubble.left.and.bubble.right.fill', android: 'chat', web: 'chat' },
  sparkles: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
  bell: { ios: 'bell', android: 'notifications', web: 'notifications' },
  globe: { ios: 'globe', android: 'public', web: 'public' },
  wrench: { ios: 'wrench.and.screwdriver', android: 'construction', web: 'construction' },
  store: { ios: 'storefront', android: 'storefront', web: 'storefront' },
  briefcase: { ios: 'briefcase', android: 'work', web: 'work' },
  grid: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' },
  image: { ios: 'photo', android: 'image', web: 'image' },
  poll: { ios: 'chart.bar', android: 'poll', web: 'poll' },
  send: { ios: 'paperplane.fill', android: 'send', web: 'send' },
  heart: { ios: 'heart', android: 'favorite_border', web: 'favorite_border' },
  heartFill: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  comment: { ios: 'bubble.right', android: 'chat_bubble_outline', web: 'chat_bubble_outline' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  bookmark: { ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' },
  bookmarkFill: { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' },
  star: { ios: 'star.fill', android: 'star', web: 'star' },
  phone: { ios: 'phone.fill', android: 'call', web: 'call' },
  video: { ios: 'video.fill', android: 'videocam', web: 'videocam' },
  mic: { ios: 'mic.fill', android: 'mic', web: 'mic' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  directions: { ios: 'location.fill', android: 'near_me', web: 'near_me' },
  verified: { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' },
  settings: { ios: 'gearshape', android: 'settings', web: 'settings' },
  edit: { ios: 'square.and.pencil', android: 'edit', web: 'edit' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  shield: { ios: 'checkmark.shield', android: 'shield', web: 'shield' },
  doc: { ios: 'doc.text', android: 'description', web: 'description' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
  users: { ios: 'person.2', android: 'group', web: 'group' },
  warning: { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
  translate: { ios: 'character.bubble', android: 'translate', web: 'translate' },
  callEnd: { ios: 'phone.down.fill', android: 'call_end', web: 'call_end' },
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
  attach: { ios: 'paperclip', android: 'attach_file', web: 'attach_file' },
  smile: { ios: 'face.smiling', android: 'mood', web: 'mood' },
  graduation: { ios: 'graduationcap', android: 'school', web: 'school' },
  handshake: { ios: 'person.2.fill', android: 'group', web: 'group' },
  bag: { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' },
  arrowRight: { ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' },
  more: { ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' },
  flag: { ios: 'flag', android: 'flag', web: 'flag' },
  megaphone: { ios: 'megaphone', android: 'campaign', web: 'campaign' },
  filter: { ios: 'line.3.horizontal.decrease', android: 'tune', web: 'tune' },
  sun: { ios: 'sun.max.fill', android: 'light_mode', web: 'light_mode' },
  moon: { ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' },
  device: { ios: 'iphone', android: 'smartphone', web: 'smartphone' },
  play: { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  pause: { ios: 'pause.fill', android: 'pause', web: 'pause' },
};

const brandIcons: Partial<Record<IconName, MarkName>> = {
  edit: 'edit',
  calendar: 'calendar',
  poll: 'list',
  bag: 'bag',
  pin: 'pin',
  person: 'person',
  sparkles: 'sparkles',
};

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 22, color }: IconProps) {
  const mark = brandIcons[name];
  if (mark) {
    return (
      <Image
        source={marks[mark]}
        style={{ width: size, height: size }}
        tintColor={name === 'person' ? color : undefined}
        contentFit="contain"
        accessibilityIgnoresInvertColors
      />
    );
  }
  return <SymbolView name={names[name]} size={size} tintColor={color} />;
}
