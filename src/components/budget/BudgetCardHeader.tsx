import { colors } from '@/theme';
import { StyleSheet, View } from 'react-native';
import { AppDivider, AppText } from '../ui';

type BudgetCardHeaderProps = {
  name: string;
  description: string;
};

const BudgetCardHeader = ({ name, description }: BudgetCardHeaderProps) => {
  return (
    <View style={styles.container}>
      <AppText variant="screenHeading">{name}</AppText>
      <AppDivider orientation="horizontal" height={1} rounded bgColor={colors.surfaceMint} />
      {description !== '' && (
        <AppText variant="metadataItalic" style={styles.description}>
          {description}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
    paddingBottom: 4,
  },
  description: {
    color: colors.textSecondary,
  },
});

export default BudgetCardHeader;
