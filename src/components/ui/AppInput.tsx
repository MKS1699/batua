import { colors, fonts } from '@/theme';
import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import AppText from './AppText';

type InputIconPosition = 'start' | 'end' | 'beforeLabel' | 'afterLabel';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: ReactNode;
  iconPosition?: InputIconPosition;

  autoGrow?: boolean;
  minAutoGrowHeight?: number;
  maxAutoGrowHeight?: number;
}

// TODO: Verify multiline newline preservation across the transaction flow.
// 1. Confirm line breaks (e.g. "A\nB") are preserved when saving to SQLite.
// 2. Ensure newline characters remain intact when loading transaction data.
// 3. Verify descriptions display on separate lines in transaction details
//    and any other relevant UI.
// 4. Add or adjust storage and display handling if line breaks are lost.

export default function AppInput({
  label,
  error,
  containerStyle,
  style,
  icon,
  iconPosition = 'start',
  maxLength,
  autoGrow = false,
  minAutoGrowHeight = 48,
  maxAutoGrowHeight = 120,
  onContentSizeChange,
  multiline,
  scrollEnabled,
  ...props
}: AppInputProps) {
  const isLabelIcon = iconPosition === 'beforeLabel' || iconPosition === 'afterLabel';
  const characterCount = String(props.value ?? '').length;
  const [contentHeight, setContentHeight] = useState(minAutoGrowHeight);
  const inputHeight = Math.min(Math.max(contentHeight, minAutoGrowHeight), maxAutoGrowHeight);
  const isAtMaxHeight = contentHeight >= maxAutoGrowHeight;

  return (
    <View style={containerStyle}>
      <View style={styles.labelRow}>
        {isLabelIcon ? (
          <View style={styles.labelIconRow}>
            {iconPosition === 'beforeLabel' && icon}

            <AppText variant="bodyImportant" style={styles.label}>
              {label}
            </AppText>

            {iconPosition === 'afterLabel' && icon}
          </View>
        ) : (
          <AppText variant="bodyImportant" style={styles.label}>
            {label}
          </AppText>
        )}

        {maxLength !== undefined && (
          <AppText variant="metadataItalic">
            {characterCount}/{maxLength}
          </AppText>
        )}
      </View>

      <View style={[styles.inputContainer, error ? styles.inputError : undefined]}>
        {iconPosition === 'start' && icon}

        <TextInput
          {...props}
          maxLength={maxLength}
          multiline={autoGrow ? true : multiline}
          scrollEnabled={autoGrow ? isAtMaxHeight : scrollEnabled}
          onContentSizeChange={(event) => {
            onContentSizeChange?.(event);

            if (!autoGrow) return;

            setContentHeight(event.nativeEvent.contentSize.height);
          }}
          accessibilityLabel={label || props.placeholder}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.textPrimary}
          style={[
            styles.input,
            iconPosition === 'start' && styles.inputWithStartIcon,
            iconPosition === 'end' && styles.inputWithEndIcon,
            autoGrow && {
              height: inputHeight,
              textAlignVertical: 'top',
            },
            style,
          ]}
        />

        {iconPosition === 'end' && icon}
      </View>

      {error ? (
        <AppText variant="metadataItalic" accessibilityRole="alert" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {},
  labelRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'space-between',
  },
  labelIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 6,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  inputWithStartIcon: {
    marginLeft: 8,
  },
  inputWithEndIcon: {
    marginRight: 8,
  },
  inputError: {
    borderColor: colors.statusError,
  },
  error: {
    marginTop: 6,
    color: colors.statusError,
  },
});
