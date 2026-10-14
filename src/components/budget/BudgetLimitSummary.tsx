import { colors } from '@/theme';
import type { Currency } from '@/types/dataTypes';
import { moneyFormatter } from '@/utils/utils';
import { StyleSheet, View } from 'react-native';
import { AppCurrencyIcon, AppText, ProgressBar } from '../ui';

type BudgetLimitSummaryProps = {
  limitAmount: number;
  expense: number;
  currency: Currency;
};

const BudgetLimitSummary = ({ limitAmount, expense, currency }: BudgetLimitSummaryProps) => {
  const remaining = limitAmount - expense;
  const percentage = limitAmount > 0 ? Math.round((expense / limitAmount) * 100) : 0;

  const formatMoney = (amount: number) => moneyFormatter(currency, amount.toString());

  const isOverspent = remaining < 0;

  return (
    <View style={styles.container}>
      <View style={styles.moneyRow}>
        <AppText variant="metadata">Total expenses</AppText>

        <View style={styles.moneyDisplay}>
          <View style={styles.currencyIconWrapper}>
            <AppCurrencyIcon currency={currency} variant="screenHeading" />
          </View>
          <AppText variant="screenHeading" style={styles.amount}>
            {formatMoney(expense)}
          </AppText>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.row}>
          <AppText variant="metadata">{isOverspent ? 'Limit exceeded' : 'Budget used'}</AppText>
          <AppText variant="metadata">{percentage}% used</AppText>
        </View>

        <ProgressBar
          current={expense}
          total={limitAmount}
          filledColor={isOverspent ? 'statusError' : 'accentTeal'}
          emptyColor="borderSubtle"
        />
      </View>

      <View style={styles.moneyRow}>
        <AppText
          variant="metadata"
          style={{
            color: isOverspent ? colors.statusError : colors.textSecondary,
          }}
        >
          {isOverspent ? 'Overspent' : 'Remaining'}
        </AppText>

        <View style={styles.moneyDisplay}>
          <View style={styles.currencyIconWrapper}>
            <AppCurrencyIcon currency={currency} variant="metadata" />
          </View>
          <AppText
            variant="metadata"
            style={[styles.amount, isOverspent && styles.overspentAmount]}
          >
            {formatMoney(Math.abs(remaining))}
          </AppText>
        </View>
      </View>

      <View style={styles.moneyRow}>
        <AppText variant="metadata">Spending limit</AppText>

        <View style={styles.moneyDisplay}>
          <View style={styles.currencyIconWrapper}>
            <AppCurrencyIcon currency={currency} variant="metadata" />
          </View>
          <AppText variant="metadata" style={styles.amount}>
            {formatMoney(limitAmount)}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  moneyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  moneyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  currencyIconWrapper: {
    marginRight: 6,
  },
  amount: {
    flexShrink: 1,
  },
  progressSection: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  overspentAmount: {
    color: colors.statusError,
  },
});

export default BudgetLimitSummary;
