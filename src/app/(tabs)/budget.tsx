import { ScreenHeader } from '@/components';
import { BudgetCard } from '@/components/budget';
import ScreenContainer from '@/components/ScreenContainer';
import { AppButton } from '@/components/ui';
import { BUDGET_SELECT } from '@/db/budgets';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getBudgetState, getBudgetSummaries, loadBudget } from '@/store/slice/budgetSlice';
import { getUserPreference } from '@/store/slice/userPreferenceSlice';
import { getUser } from '@/store/slice/userSlice';
import { colors } from '@/theme';
import { useRouter } from 'expo-router';
import { WalletIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

// TODO: Verify the full transaction list screen loads saved
// transactions from SQLite and displays them correctly.

// TODO: Implement the Create Budget screen and connect the
// Create Budget button to its route.

// TODO: Verify budget card navigation and implement the
// budget-specific overview route if it is not already complete.

// TODO: Complete the budget overview screen, including budget
// details, spending summary, optional spending limit, and
// transaction list.

// TODO: Add an Add Transaction action to the budget overview,
// passing the selected budget ID to the creation screen.

// TODO: Implement budget editing and deletion actions on the
// overview screen, including delete confirmation.

// TODO: Verify nested button presses do not trigger the
// budget card's navigation handler.

// TODO: Verify budget summaries and recent transactions refresh
// after a transaction is saved and the user returns to budgets.

const Budget = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(getUser);
  const { budgets } = useAppSelector(getBudgetState);
  const budgetSummaries = useAppSelector(getBudgetSummaries);
  const currentUserPreference = useAppSelector(getUserPreference);
  const defaultBudgetId = currentUserPreference?.defaultBudgetId;

  const router = useRouter();

  const sortedBudget = [...budgets].sort((a, b) => {
    if (a.id === defaultBudgetId) return -1;
    if (b.id === defaultBudgetId) return 1;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // create budget btn fn
  function createBudget() {
    // console.log('Create Budget Pressed.');
    router.push({
      pathname: '/budget/createBudget',
      params: {
        userId: currentUser?.id,
      },
    });
  }

  // add transaction btn fn
  async function goToCreateTransaction(budgetId: BUDGET_SELECT['id']) {
    try {
      await dispatch(loadBudget(budgetId)).unwrap();
      router.push({
        pathname: '/transaction/createTransaction',
        params: { budgetId },
      });
    } catch (error) {
      console.error('Failed to load budget:', error);
    }
  }

  return (
    <ScreenContainer noSafeArea padding={0}>
      {/* user name */}
      <ScreenHeader
        showBack={false}
        title={currentUser?.name ? `${currentUser.name}'s Budgets` : 'Your Budgets'}
      />
      <ScreenContainer scroll="none" padding={0} style={styles.screen}>
        <View style={styles.screenContent}>
          {/* Scrollable budget list */}
          <ScreenContainer
            noSafeArea
            scroll="vertical"
            padding={0}
            contentContainerStyle={styles.budgetListContent}
          >
            {sortedBudget.map((budget) => {
              const budgetSummary = budgetSummaries.find(
                (summary) => summary.budgetId === budget.id
              );
              const expense =
                budgetSummary?.totals.find((item) => item.currency === budget.currency)?.expense ??
                0;

              return (
                <BudgetCard
                  key={`Budget-${budget.id}`}
                  budgetId={budget.id}
                  budget={budget}
                  expense={expense}
                  onAddTransaction={() => goToCreateTransaction(budget.id)}
                />
              );
            })}
          </ScreenContainer>

          {/* Fixed button outside the scrollable area */}
          <View style={styles.footer}>
            <AppButton
              label="Create Budget"
              style={styles.newBudgetBtn}
              icon={<WalletIcon />}
              onPress={createBudget}
            />
          </View>
        </View>
      </ScreenContainer>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  screenContent: {
    flex: 1,
    gap: 10,
  },
  budgetListContent: {
    gap: 16,
    paddingBottom: 12,
  },
  footer: {
    paddingTop: 12,
  },
  newBudgetBtn: {
    width: '100%',
    backgroundColor: colors.accentLime,
  },
});

export default Budget;
