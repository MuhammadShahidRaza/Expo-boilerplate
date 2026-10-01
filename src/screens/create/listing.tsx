import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import type { Listing } from '@/data/content';
import { useSession } from '@/context/session-context';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch } from '@/store/hooks';
import { addListing } from '@/store/slices/world';
import { validateListing } from '@/validation';
import { radius, spacing } from '@/theme';

const categories: Listing['category'][] = ['electronics', 'clothing', 'furniture', 'food'];
const categoryKeys = {
  electronics: 'market.electronics',
  clothing: 'market.clothing',
  furniture: 'market.furniture',
  food: 'market.food',
} as const;

export function CreateListingScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const { pickImage } = useImagePicker();
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Listing['category'] | null>(null);
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<Listing['condition']>('new');
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<'title' | 'description' | 'category' | 'price' | 'photos', string>>>({});

  const addPhoto = async () => {
    if (photos.length >= 6) return;
    const result = await pickImage();
    if (result.status === 'ok') setPhotos((current) => [...current, result.uri]);
  };

  const cycleCategory = () => {
    if (!category) {
      setCategory('electronics');
      return;
    }
    const index = categories.indexOf(category);
    setCategory(categories[(index + 1) % categories.length]);
  };

  const onPublish = () => {
    const nextErrors = validateListing(
      { title, description, category: category ?? '', price, photos: photos.length },
      t,
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !category) return;
    dispatch(
      addListing({
        title,
        description,
        category,
        price: Number(price),
        condition,
        quantity,
        sellerName: user?.fullName ?? '',
        image: photos[0] ?? 'phone',
      }),
    );
    router.replace('/marketplace');
  };

  return (
    <Screen keyboard>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <IconButton icon="close" variant="ghost" accessibilityLabel={t('common.close')} onPress={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ThemedText variant="headline">{t('create.listingTitle')}</ThemedText>
        </View>
        <Button
          title={t('common.publish')}
          variant="gold"
          onPress={onPublish}
          style={{ minHeight: 40, alignSelf: 'auto', paddingHorizontal: spacing.md }}
        />
      </View>

      <View style={{ gap: spacing.sm }}>
        <ThemedText variant="headline">{t('create.photos')}</ThemedText>
        {errors.photos ? (
          <ThemedText variant="caption" themeColor="error">
            {errors.photos}
          </ThemedText>
        ) : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: spacing.sm, alignItems: 'center' }}>
          <Pressable
            accessibilityRole="button"
            onPress={addPhoto}
            style={{
              width: 96,
              height: 96,
              borderRadius: radius.lg,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: colors.inputBorder,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              backgroundColor: colors.card,
            }}>
            <Icon name="camera" size={20} color={colors.placeholder} />
            <ThemedText variant="caption">{t('create.addPhoto')}</ThemedText>
          </Pressable>
          {photos.map((uri) => (
            <Image key={uri} source={{ uri }} style={{ width: 96, height: 96, borderRadius: radius.lg }} contentFit="cover" />
          ))}
          {photos.length < 6
            ? Array.from({ length: Math.min(2, 6 - photos.length) }).map((_, index) => (
                <Pressable
                  key={`slot-${index}`}
                  accessibilityRole="button"
                  onPress={addPhoto}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: radius.lg,
                    backgroundColor: colors.backgroundElement,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="plus" size={22} color={colors.placeholder} />
                </Pressable>
              ))
            : null}
        </ScrollView>
      </View>

      <TextField label={t('create.productTitle')} value={title} onChangeText={setTitle} placeholder={t('create.selling')} error={errors.title} />
      <TextField
        label={t('create.description')}
        value={description}
        onChangeText={setDescription}
        placeholder={t('create.describe')}
        multiline
        error={errors.description}
      />

      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="label">{t('create.category')}</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={cycleCategory}
          style={{
            minHeight: 52,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: errors.category ? colors.error : colors.inputBorder,
            backgroundColor: colors.inputBackground,
            paddingHorizontal: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <ThemedText variant="body" themeColor={category ? 'text' : 'textDisabled'}>
            {category ? t(categoryKeys[category]) : t('create.selectCategory')}
          </ThemedText>
          <Icon name="chevronDown" size={16} color={colors.icon} />
        </Pressable>
        {errors.category ? (
          <ThemedText variant="caption" themeColor="error">
            {errors.category}
          </ThemedText>
        ) : null}
      </View>

      <TextField
        label={t('create.price')}
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
        keyboardType="decimal-pad"
        error={errors.price}
      />

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <ThemedText variant="label">{t('create.condition')}</ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => setCondition((value) => (value === 'new' ? 'used' : 'new'))}
            style={{
              minHeight: 52,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              backgroundColor: colors.inputBackground,
              paddingHorizontal: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <ThemedText variant="body">{condition === 'new' ? t('create.new') : t('create.used')}</ThemedText>
            <Icon name="chevronDown" size={16} color={colors.icon} />
          </Pressable>
        </View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <ThemedText variant="label">{t('create.quantity')}</ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => setQuantity((value) => (value >= 5 ? 1 : value + 1))}
            style={{
              minHeight: 52,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              backgroundColor: colors.inputBackground,
              paddingHorizontal: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <ThemedText variant="body">{String(quantity)}</ThemedText>
            <Icon name="chevronDown" size={16} color={colors.icon} />
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
