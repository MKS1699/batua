import { colors } from '@/theme';
import { TransactionType } from '@/types/dataTypes';
import { HandDepositIcon, HandWithdrawIcon } from 'phosphor-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../ui';

interface TransactionTypeSelectionProps {
  onPressHandler: (value: TransactionType) => void;
  transactionType: TransactionType;
}

const TransactionTypeSelection = ({
  onPressHandler,
  transactionType,
}: TransactionTypeSelectionProps) => {
  return (
    <View style={styles.transactionTypeSelection}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{
          checked: transactionType === TransactionType.expense,
        }}
        onPress={() => onPressHandler(TransactionType.expense)}
        style={[
          styles.transactionTypes,
          styles.transactionExpense,
          transactionType === TransactionType.expense
            ? styles.selectedExpense
            : styles.unSelectedExpense,
        ]}
      >
        <HandWithdrawIcon size={32} color={colors.statusError} weight="duotone" />

        <AppText style={[styles.transactionText]}>Expense</AppText>
      </Pressable>

      <Pressable
        accessibilityRole="radio"
        accessibilityState={{
          checked: transactionType === TransactionType.income,
        }}
        onPress={() => onPressHandler(TransactionType.income)}
        style={[
          styles.transactionTypes,
          styles.transactionIncome,
          transactionType === TransactionType.income
            ? styles.selectedIncome
            : styles.unSelectedIncome,
        ]}
      >
        <HandDepositIcon size={32} color={colors.statusSuccess} weight="duotone" />
        <AppText style={styles.transactionText}>Income</AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionTypeSelection: {
    width: '100%',
    flexDirection: 'row',
    gap: 0,
    overflow: 'hidden',
  },
  transactionTypes: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    backgroundColor: colors.surfaceMint,
    borderWidth: 2,
  },
  transactionExpense: {
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  selectedExpense: {
    borderRightWidth: 2,
    backgroundColor: colors.statusErrorSoft,
    borderColor: colors.statusErrorDark,
  },
  selectedIncome: {
    borderLeftWidth: 2,
    backgroundColor: colors.statusSuccessSoft,
    borderColor: colors.statusSuccessDark,
  },
  unSelectedExpense: {
    borderRightWidth: 0,
    borderColor: colors.borderSubtle,
  },
  unSelectedIncome: {
    borderLeftWidth: 0,
    borderColor: colors.borderSubtle,
  },
  transactionIncome: {
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },

  transactionText: {
    fontSize: 28,
    textAlign: 'center',
  },
});

export default TransactionTypeSelection;
