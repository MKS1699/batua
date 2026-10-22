import type { BUDGET_SELECT } from '@/db/budgets';
import { getTransactionsByBudgetId, TRANSACTION_SELECT } from '@/db/transactions';
import { colors } from '@/theme';
import { ArrowsOutSimpleIcon, PlusCircleIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppCard } from '../ui';
import BudgetCardHeader from './BudgetCardHeader';
import BudgetCompactSummary from './BudgetCompactSummary';
import BudgetExpenseDisplay from './BudgetExpenseDisplay';
import BudgetLimitSummary from './BudgetLimitSummary';

export type BudgetCardProps = {
  budgetId: string;
  budget: BUDGET_SELECT;
  expense: number;
  onAddTransaction: (budgetId: BUDGET_SELECT['id']) => void;
  onPress?: (budgetId: BUDGET_SELECT['id']) => void;
};

const BudgetCard = ({ budgetId, budget, expense, onAddTransaction, onPress }: BudgetCardProps) => {
  const [latestTransactions, setLatestTransactions] = useState<TRANSACTION_SELECT[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadTransactions() {
      try {
        const transactions = await getTransactionsByBudgetId(budgetId, 2);

        if (!cancelled) {
          setLatestTransactions(transactions);
        }
      } catch (error) {
        console.log('Failed to load budget transactions: ', error);
      }
    }
    void loadTransactions();

    return () => {
      cancelled = true;
    };
  }, [budgetId]);

  return (
    <AppCard style={styles.container}>
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

      {/* latest 2 budget transactions if any  */}
      <BudgetExpenseDisplay style={{ marginBottom: 10 }} transactions={latestTransactions} />

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
  container: {
    backgroundColor: colors.accentLavender,
    gap: 10,
  },
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
