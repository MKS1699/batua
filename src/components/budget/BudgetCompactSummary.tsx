import type { Currency } from '@/types/dataTypes';
import { moneyFormatter } from '@/utils/utils';
import { StyleSheet, View } from 'react-native';
import { AppCurrencyIcon, AppText } from '../ui';

type BudgetCompactSummaryProps = {
  expense: number;
  currency: Currency;
};

const BudgetCompactSummary = ({ expense, currency }: BudgetCompactSummaryProps) => {
  const formattedExpense = moneyFormatter(currency, expense.toString());

  return (
    <View style={styles.container}>
      <AppText variant="metadata">Total expenses</AppText>
      <View style={styles.moneyDisplay}>
        <View style={styles.currencyIconWrapper}>
          <AppCurrencyIcon currency={currency} variant="screenHeading" />
        </View>
        <AppText style={styles.amount} variant="screenHeading">
          {formattedExpense}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  moneyDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexShrink: 1,
  },
  currencyIconWrapper: {
    paddingTop: 5,
    marginRight: 6,
  },
  amount: {
    flexShrink: 1,
  },
});

export default BudgetCompactSummary;
