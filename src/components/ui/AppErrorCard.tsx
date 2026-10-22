import { colors } from '@/theme';
import { StyleSheet, View } from 'react-native';
import AppCard from './AppCard';
import AppDivider from './AppDivider';
import AppText from './AppText';

interface AppErrorCardProps {
  label: string;
  messages: string[];
}

const AppErrorCard = ({ label, messages }: AppErrorCardProps) => {
  return (
    <AppCard style={styles.errorCard}>
      <AppText variant="metadataMediumItalic">{label} : </AppText>
      <AppDivider
        orientation="horizontal"
        height={2}
        width={'100%'}
        bgColor={colors.borderSubtle}
        rounded
      />
      {messages.map((message, index) => (
        <View key={`Error-${label}-message-${index}`}>
          <AppText variant="metadata" style={{ paddingHorizontal: 5, textAlign: 'justify' }}>
            {message}
          </AppText>
          {index < messages.length - 1 && (
            <AppDivider
              orientation="horizontal"
              height={2}
              width={'100%'}
              bgColor={colors.borderSubtle}
              rounded
            />
          )}
        </View>
      ))}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  errorCard: {
    borderColor: colors.statusError,
    marginVertical: 10,
    flexDirection: 'column',
    gap: 5,
    paddingHorizontal: 10,
  },
});

export default AppErrorCard;
