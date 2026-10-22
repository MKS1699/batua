import AppText from '@/components/ui/AppText';
import type { TRANSACTION_SELECT } from '@/db/transactions';
import { colors } from '@/theme';
import { PaymentMethodDefined } from '@/types/dataTypes';
import { iconSize, isoToLocale, moneyFormatter } from '@/utils/utils';
import { CalendarCheckIcon } from 'phosphor-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppCard, AppCurrencyIcon, AppPaymentMethodIcon } from '../ui';

type TransactionRowProps = {
  transaction: TRANSACTION_SELECT;
  onPress?: (transaction: TRANSACTION_SELECT) => void;
};

const TransactionRow = ({ transaction, onPress }: TransactionRowProps) => {
  const isIncome = transaction.transactionType === 'income';
  const amount = Number(transaction.amount);

  const definedMethod = PaymentMethodDefined[transaction.paymentMethod];

  return (
    <Pressable disabled={!onPress} onPress={() => onPress?.(transaction)}>
      <AppCard style={styles.container}>
        <View style={styles.details}>
          <AppText style={styles.title} numberOfLines={1} variant="bodyImportant">
            {transaction.title}
          </AppText>

          <View style={styles.transactionDate}>
            <CalendarCheckIcon size={iconSize('metadata')} />
            <AppText style={styles.metadata} numberOfLines={1} variant="metadataItalic">
              {isoToLocale(transaction.transactionDate)}
            </AppText>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <View style={[styles.currency, styles.amount]}>
            <AppText style={[isIncome ? styles.income : styles.expense]}>
              {isIncome ? '+' : '−'}
            </AppText>
            <AppCurrencyIcon
              currency={transaction.originalCurrency}
              color={isIncome ? 'statusSuccess' : 'statusError'}
            />
            <AppText style={[isIncome ? styles.income : styles.expense]} numberOfLines={1}>
              {moneyFormatter(transaction.originalCurrency, amount.toString())}
            </AppText>
          </View>

          <View style={styles.paymentMethod}>
            <AppPaymentMethodIcon
              paymentMethod={transaction.paymentMethod}
              variant="metadataItalic"
            />
            <AppText style={styles.metadata} numberOfLines={1} variant="metadataItalic">
              {definedMethod}
            </AppText>
          </View>
        </View>
      </AppCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    backgroundColor: colors.surfaceMint,
  },
  details: {
    flex: 1,
    flexShrink: 1,
    gap: 4,
  },
  rightColumn: {
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: 4,
  },
  title: {
    fontWeight: '500',
  },
  metadata: {
    color: colors.textSecondary,
  },
  amount: {
    fontWeight: '600',
    flexShrink: 0,
    alignItems: 'center',
  },
  income: {
    color: colors.statusSuccess,
  },
  expense: {
    color: colors.statusError,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  transactionDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

export default TransactionRow;
