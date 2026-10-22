import { TRANSACTION_SELECT } from '@/db/transactions';
import { View, ViewProps } from 'react-native';
import { TransactionRow } from '../transaction';

interface BudgetExpenseDisplayProps extends ViewProps {
  transactions: TRANSACTION_SELECT[];
}

const BudgetExpenseDisplay = ({ style, transactions }: BudgetExpenseDisplayProps) => {
  return (
    <View style={[style, { gap: 10 }]}>
      {transactions.map((transaction) => (
        <TransactionRow
          transaction={transaction}
          key={`Transaction-${transaction.id}-budget-${transaction.budgetId}`}
        />
      ))}
    </View>
  );
};

export default BudgetExpenseDisplay;
