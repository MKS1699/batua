import ScreenContainer from '@/components/ScreenContainer';
import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import AppInput from '@/components/ui/AppInput';
import AppText from '@/components/ui/AppText';
import { colors } from '@/theme';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Expense = {
  id: number;
  title: string;
  category: string;
  amount: number;
  symbol: string;
  tileColor: string;
};

const initialExpenses: Expense[] = [
  {
    id: 1,
    title: 'Groceries',
    category: 'Food & household',
    amount: 1250,
    symbol: '🛒',
    tileColor: colors.accentYellow,
  },
  {
    id: 2,
    title: 'Metro recharge',
    category: 'Transport',
    amount: 500,
    symbol: '🚆',
    tileColor: colors.accentTeal,
  },
  {
    id: 3,
    title: 'Coffee',
    category: 'Food & drink',
    amount: 180,
    symbol: '☕',
    tileColor: colors.background,
  },
];

const formatAmount = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export default function Index() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const spent = expenses.reduce((total, expense) => total + expense.amount, 0);
  const budget = 12000;
  const remaining = budget - spent;
  const progress = Math.min(spent / budget, 1);

  function handleSaveExpense() {
    const parsedAmount = Number(amount);

    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }

    if (!amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    setExpenses((current) => [
      {
        id: Date.now(),
        title: description.trim(),
        category: 'Other',
        amount: parsedAmount,
        symbol: '🧾',
        tileColor: colors.background,
      },
      ...current,
    ]);

    setDescription('');
    setAmount('');
    setError('');
    setShowForm(false);
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AppText variant="metadata" style={styles.eyebrow}>
              EXPENSE TRACKING
            </AppText>
            <AppText variant="screenHeading">Overview</AppText>
          </View>

          <AppText variant="bodyImportant">Oct 2026</AppText>
        </View>

        {/* Budget summary */}
        <AppCard backgroundColor={colors.accentPink} style={styles.budgetCard}>
          <AppText variant="bodyImportant">Monthly budget</AppText>

          <AppText variant="metadata" style={styles.remainingLabel}>
            Remaining
          </AppText>

          <AppText variant="remainingAmount" adjustsFontSizeToFit numberOfLines={1}>
            {formatAmount(remaining)}
          </AppText>

          <View style={styles.budgetDetails}>
            <View>
              <AppText variant="metadata">SPENT</AppText>
              <AppText variant="bodyImportant">{formatAmount(spent)}</AppText>
            </View>

            <View style={styles.totalBlock}>
              <AppText variant="metadata">TOTAL BUDGET</AppText>
              <AppText variant="bodyImportant">{formatAmount(budget)}</AppText>
            </View>
          </View>

          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityLabel="Monthly budget used"
            accessibilityValue={{
              min: 0,
              max: 100,
              now: Math.round(progress * 100),
            }}
          >
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <AppText variant="metadata" style={styles.progressCaption}>
            {Math.round(progress * 100)}% of your budget used
          </AppText>
        </AppCard>

        {/* Primary action */}
        <AppButton
          label={showForm ? 'Close form' : '+  Add expense'}
          onPress={() => {
            setShowForm((current) => !current);
            setError('');
          }}
          style={styles.addButton}
        />

        {/* Demo input form */}
        {showForm && (
          <AppCard style={styles.formCard}>
            <AppText variant="sectionHeading">Add expense</AppText>

            <AppInput
              label="Description"
              placeholder="e.g. Groceries"
              value={description}
              onChangeText={setDescription}
              containerStyle={styles.formField}
            />

            <AppInput
              label="Amount (₹)"
              placeholder="e.g. 250"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              containerStyle={styles.formField}
            />

            {error ? (
              <AppText variant="metadata" accessibilityRole="alert" style={styles.error}>
                {error}
              </AppText>
            ) : null}

            <AppButton label="Save expense" onPress={handleSaveExpense} style={styles.saveButton} />

            <AppButton
              label="Cancel"
              variant="secondary"
              onPress={() => {
                setShowForm(false);
                setError('');
              }}
            />
          </AppCard>
        )}

        {/* Recent transactions */}
        <View style={styles.sectionHeader}>
          <AppText variant="sectionHeading">Recent expenses</AppText>
          <AppText variant="metadata">{expenses.length} items</AppText>
        </View>

        <AppCard style={styles.expenseList}>
          {expenses.map((expense, index) => (
            <View
              key={expense.id}
              style={[styles.expenseRow, index !== expenses.length - 1 && styles.expenseDivider]}
            >
              <View style={[styles.categoryTile, { backgroundColor: expense.tileColor }]}>
                <AppText style={styles.categorySymbol}>{expense.symbol}</AppText>
              </View>

              <View style={styles.expenseInfo}>
                <AppText variant="bodyImportant" numberOfLines={1}>
                  {expense.title}
                </AppText>
                <AppText variant="metadata" numberOfLines={1}>
                  {expense.category}
                </AppText>
              </View>

              <AppText variant="bodyImportant" style={styles.expenseAmount}>
                −{formatAmount(expense.amount)}
              </AppText>
            </View>
          ))}
        </AppCard>

        <AppText variant="metadata" style={styles.footer}>
          Demo data only · Changes are not saved to the database
        </AppText>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  eyebrow: {
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  budgetCard: {
    padding: 20,
    marginBottom: 20,
  },
  remainingLabel: {
    marginTop: 20,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 16,
  },
  totalBlock: {
    alignItems: 'flex-end',
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    backgroundColor: '#24242326',
    borderRadius: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.textPrimary,
  },
  progressCaption: {
    marginTop: 8,
  },
  addButton: {
    marginBottom: 24,
  },
  formCard: {
    marginBottom: 24,
    gap: 12,
  },
  formField: {
    marginBottom: 4,
  },
  error: {
    color: colors.statusError,
  },
  saveButton: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  expenseList: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  expenseDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  categoryTile: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 4,
  },
  categorySymbol: {
    fontSize: 18,
  },
  expenseInfo: {
    flex: 1,
    gap: 4,
  },
  expenseAmount: {
    flexShrink: 0,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
  },
});
