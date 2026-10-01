import { Pressable, View } from "react-native";

import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { ScreenHeader } from "@/components/ui/screen-header";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import {
  darkColors,
  lightColors,
  radius,
  spacing,
  type ThemeColors,
  type ThemeMode,
} from "@/theme";

const modes: {
  id: ThemeMode;
  icon: IconName;
  label: "common.light" | "common.dark" | "common.system";
  body:
    | "settings.appearanceLightBody"
    | "settings.appearanceDarkBody"
    | "settings.appearanceSystemBody";
}[] = [
  {
    id: "light",
    icon: "sun",
    label: "common.light",
    body: "settings.appearanceLightBody",
  },
  {
    id: "dark",
    icon: "moon",
    label: "common.dark",
    body: "settings.appearanceDarkBody",
  },
  {
    id: "system",
    icon: "device",
    label: "common.system",
    body: "settings.appearanceSystemBody",
  },
];

function MiniHome({ palette }: { palette: ThemeColors }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: palette.background,
        padding: spacing.sm,
        gap: spacing.sm,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: radius.full,
            backgroundColor: palette.gold,
          }}
        />
        <View style={{ flex: 1, gap: 4 }}>
          <View
            style={{
              height: 6,
              width: "42%",
              borderRadius: radius.full,
              backgroundColor: palette.text,
            }}
          />
          <View
            style={{
              height: 5,
              width: "68%",
              borderRadius: radius.full,
              backgroundColor: palette.textSecondary,
            }}
          />
        </View>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: radius.full,
            backgroundColor: palette.gold,
          }}
        />
      </View>
      <View
        style={{
          height: 22,
          borderRadius: radius.full,
          backgroundColor: palette.search,
        }}
      />
      <View
        style={{
          backgroundColor: palette.tabBar,
          borderRadius: radius.md,
          padding: spacing.sm,
          gap: 6,
        }}
      >
        <View
          style={{
            height: 5,
            width: "36%",
            borderRadius: radius.full,
            backgroundColor: palette.gold,
          }}
        />
        <View
          style={{
            height: 7,
            width: "90%",
            borderRadius: radius.full,
            backgroundColor: palette.textInverse,
          }}
        />
        <View
          style={{
            height: 7,
            width: "64%",
            borderRadius: radius.full,
            backgroundColor: palette.textInverse,
            opacity: 0.72,
          }}
        />
        <View
          style={{
            height: 18,
            borderRadius: radius.full,
            backgroundColor: palette.gold,
            marginTop: 2,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        {[palette.tintBlueSoft, palette.tintGoldSoft, palette.tintRedSoft].map(
          (color) => (
            <View
              key={color}
              style={{
                flex: 1,
                height: 28,
                borderRadius: radius.sm,
                backgroundColor: color,
              }}
            />
          ),
        )}
      </View>
    </View>
  );
}

function AppearancePreview({ mode }: { mode: ThemeMode }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        borderRadius: radius.xxl,
        backgroundColor: colors.backgroundElement,
        padding: spacing.sm,
      }}
    >
      <View
        style={{
          height: 232,
          flexDirection: "row",
          borderRadius: radius.xl,
          overflow: "hidden",
        }}
      >
        {mode === "dark" ? <MiniHome palette={darkColors} /> : null}
        {mode === "light" ? <MiniHome palette={lightColors} /> : null}
        {mode === "system" ? (
          <>
            <MiniHome palette={lightColors} />
            <View style={{ width: 2, backgroundColor: colors.gold }} />
            <MiniHome palette={darkColors} />
          </>
        ) : null}
      </View>
    </View>
  );
}

export function ThemeScreen() {
  const { t } = useTranslation();
  const { colors, themeMode, setThemeMode } = useTheme();
  const selected = modes.find((mode) => mode.id === themeMode) ?? modes[2];

  return (
    <Screen>
      <ScreenHeader title={t("settings.theme")} />
      <AppearancePreview mode={themeMode} />
      <ThemedText variant="body" style={{ textAlign: "center" }}>
        {t(selected.body)}
      </ThemedText>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        {modes.map((mode) => {
          const active = themeMode === mode.id;
          return (
            <Pressable
              key={mode.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setThemeMode(mode.id)}
              style={{
                flex: 1,
                alignItems: "center",
                gap: spacing.sm,
                paddingVertical: spacing.md,
                borderRadius: radius.lg,
                backgroundColor: active
                  ? colors.goldSoft
                  : colors.backgroundElement,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.full,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? colors.gold : colors.chip,
                }}
              >
                <Icon
                  name={mode.icon}
                  size={18}
                  color={active ? colors.onGold : colors.textSecondary}
                />
              </View>
              <ThemedText
                variant="label"
                themeColor={active ? "text" : "textSecondary"}
              >
                {t(mode.label)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
