import type { BUDGET_SELECT } from '@/db/budgets';
import { colors } from '@/theme';
import { ArrowsOutSimpleIcon, PlusCircleIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppCard } from '../ui';
import BudgetCardHeader from './BudgetCardHeader';
import BudgetCompactSummary from './BudgetCompactSummary';
import BudgetLimitSummary from './BudgetLimitSummary';

export type BudgetCardProps = {
  budget: BUDGET_SELECT;
  expense: number;
  onAddTransaction: (budgetId: BUDGET_SELECT['id']) => void;
  onPress?: (budgetId: BUDGET_SELECT['id']) => void;
};

const BudgetCard = ({ budget, expense, onAddTransaction, onPress }: BudgetCardProps) => {
  return (
    <AppCard backgroundColor={colors.accentBlue}>
      <View style={styles.header}>
        <View style={styles.budgetInfo}>
          <BudgetCardHeader name={budget.name} description={budget.description} />
        </View>
        <View style={styles.iconWrapper}>
          <ArrowsOutSimpleIcon size={18} color={colors.textSecondary} weight="regular" />
        </View>
      </View>

      {/* Budget with a spending limit */}
      {budget.limitAmount != null && (
        <BudgetLimitSummary
          limitAmount={Number(budget.limitAmount)}
          expense={expense}
          currency={budget.currency}
        />
      )}

      {/* Budget without a spending limit */}
      {!budget.limitAmount && <BudgetCompactSummary expense={expense} currency={budget.currency} />}

      {/* Add transaction action */}
      <AppButton
        label="Add Transaction"
        icon={<PlusCircleIcon />}
        onPress={() => onAddTransaction(budget.id)}
      />
    </AppCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  budgetInfo: {
    flex: 1,
  },
  iconWrapper: {
    marginTop: -10,
    marginRight: -10,
  },
});
export default BudgetCard;
