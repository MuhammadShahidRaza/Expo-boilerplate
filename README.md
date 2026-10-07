# CC World

Community app for feed, chat, directory, marketplace, events, jobs, and an AI assistant. Built with **Expo SDK 57**, **Expo Router**, and **React Native**. Runs on iOS, Android, and web.

## Stack

- Expo Router (file-based routes in `src/app/`)
- Redux Toolkit + redux-persist
- i18next (Haitian Creole, English, French, Spanish)
- Light / dark / system theme (navy + gold)
- Poppins via `@expo-google-fonts/poppins`
- Path alias: `@/` → `src/`, `@/assets/` → `assets/`

## Get started

```bash
npm install
npx expo start
```

Use a **development build** (not Expo Go) for camera, mic, maps, notifications, and speech:

```bash
npm run start:dev-client
```

Local native runs:

```bash
npm run android
npm run ios
```

## Project structure

Routes live in `src/app/`. Screens, UI, state, and data live outside that folder.

```
cc-world/
├── app.json / app.config.ts   # Expo config + plugins
├── eas.json                   # EAS Build / Submit profiles
├── assets/                    # Icons, splash, photos
└── src/
    ├── app/                   # Expo Router only
    │   ├── _layout.tsx        # Providers, fonts, splash
    │   ├── index.tsx          # Onboarding / auth redirects
    │   ├── (setup)/           # Community, state, language, intro
    │   ├── (auth)/            # Login, sign-up, OTP, origin
    │   ├── (tabs)/            # Home, Chat, Assistant, Profile
    │   ├── (main)/            # Stack screens (settings, create, details)
    │   └── legal/[slug].tsx
    ├── screens/               # Screen implementations (imported by routes)
    ├── components/            # Shared UI (`components/ui/` for primitives)
    ├── theme/                 # Colors, type, spacing, radius, motion
    ├── store/                 # Redux slices (world, user, app, ui, …)
    ├── i18n/                  # Translations
    ├── context/               # Session, create-sheet
    ├── hooks/
    ├── data/                  # Seed content, catalog, images
    ├── services/              # API, Firebase, notifications
    ├── validation/
    ├── constants/
    └── utils/
```

**Rule:** add a new screen as a file in `src/app/` plus the real UI in `src/screens/`. Do not put business logic inside route files.

### Route groups

| Group | Purpose |
| --- | --- |
| `(setup)` | First-run: community → state → language → intro |
| `(auth)` | Login, sign-up, verification, forgot password, origin |
| `(tabs)` | Bottom tabs: Home, Chat, AI Assistant, Profile |
| `(main)` | Pushed screens: directory, marketplace, events, jobs, create flows, settings, comments, calls |

Entry flow is in `src/app/index.tsx`: logged-in users go to `/home`; others go through setup then login.

### Tabs and create sheet

Home, Chat, Assistant, Profile. The center tab button opens a sheet for **post**, **event**, **poll**, and **listing**.

## Theme

Tokens live in `src/theme/`. Use `useTheme()` for colors and `ThemedText` / `ThemedView` instead of hardcoded styles.

| Token | File | Notes |
| --- | --- | --- |
| Colors | `src/theme/colors.ts` | `lightColors` / `darkColors` |
| Type | `src/theme/typography.ts` | `largeTitle`, `title`, `headline`, `body`, `caption`, … |
| Fonts | `src/theme/fonts.ts` | Poppins 400–700 |
| Spacing | `src/theme/spacing.ts` | `xs` 4 → `xxl` 48 |
| Radius | `src/theme/radius.ts` | `sm` 8 → `full` |
| Shadows / motion | `shadows.ts`, `motion.ts` | |

Brand colors:

- Navy primary `#101C3D`
- Gold secondary `#C6A15B`
- Tab bar navy, active gold

Appearance modes (Settings → Theme): **light**, **dark**, **system**. Stored in Redux `app.themeMode`.

```tsx
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { spacing, radius } from '@/theme';

const { colors } = useTheme();
<ThemedText variant="headline" themeColor="text">{label}</ThemedText>
```

## Languages

Codes in `src/constants/languages.ts`: `ht`, `en`, `fr`, `es`. Copy lives in `src/i18n/languages/`. Use `useTranslation()` (`t('home.title')`). English is the fallback.

## State

Redux store in `src/store/`. Persisted keys: `app`, `user`, `world`.

| Slice | Role |
| --- | --- |
| `world` | Feed, polls, chat, listings, events, assistant, blocks/reports |
| `user` | Profile / session extras |
| `app` | Language, theme mode |
| `ui`, `location`, `notifications` | Transient UI |

Session (login) is in `src/context/session-context.tsx`. Seed data is in `src/data/content.ts`.

## Shared UI

Prefer `src/components/ui/` before adding new primitives:

`avatar`, `badge`, `button` / `icon-button`, `card`, `chip`, `icon`, `logo`, `otp-input`, `screen-header`, `search-field`, `sheet`, `switch-row`, `video-preview`, …

Forms: `src/components/text-field.tsx`, `src/validation/index.ts`. Feed cards: `src/components/feed/`.

## Scripts

```bash
npx expo start              # Dev server
npm run start:dev-client    # Dev client
npm run lint
npx tsc --noEmit
npm test

# EAS (requires `npx eas-cli@latest login` then `eas init`)
npm run build:dev:android
npm run build:dev:ios
npm run build:apk
npm run build:production:android   # Play Store AAB
npm run build:production:ios       # App Store IPA
npm run submit:android
npm run submit:ios
```

`eas.json` profiles: `development`, `development-simulator`, `preview`, `production` (AAB), `production-apk`.

Native `ios/` and `android/` are generated (CNG). Do not edit them by hand; change `app.json` / `app.config.ts` and plugins instead.

## Config

- App name: **CC World**
- Scheme: `ccworld`
- iOS bundle: `com.cmolds.cc-world-dev`
- Android package: `com.cmolds.ccworlddev`
- Env: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_IS_ALPHA_PHASE`, `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (see `src/constants/env.ts`)

Install extra native packages with `npx expo install <package>`, not raw npm add.
