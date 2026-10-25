// AppBootstrap.tsx
import { ensureUserBootstrapData } from '@/db/bootstrap';
import { db } from '@/db/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadBudgetMembershipsByUserId } from '@/store/slice/budgetMembershipSlice';
import { fetchBudgetSummary, loadBudgetsByOwnerId } from '@/store/slice/budgetSlice';
import { loadTransactionsByBudgetId } from '@/store/slice/transactionSlice';
import { loadUserPreference } from '@/store/slice/userPreferenceSlice';
import { getUserState, loadOrCreateUser } from '@/store/slice/userSlice';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import migrations from '../../drizzle/migrations';

type AppBootstrapProps = {
  children: ReactNode;
};

const AppBootstrap = ({ children }: AppBootstrapProps) => {
  const { success: migrationsReady, error: migrationError } = useMigrations(db, migrations as any);

  const dispatch = useAppDispatch();
  const { status: userStatus, currentUser } = useAppSelector(getUserState);

  const [isReady, setIsReady] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const initializationStarted = useRef(false);

  useEffect(() => {
    if (!migrationsReady || initializationStarted.current) {
      return;
    }

    initializationStarted.current = true;

    async function initialize() {
      try {
        // 1. Load or create the local user.
        const user = await dispatch(loadOrCreateUser()).unwrap();

        // 2. Ensure the initial budget, membership, and preference.
        const { defaultBudgetId } = await ensureUserBootstrapData(user.id);

        // 3. Hydrate the existing Redux slices.
        const budgets = await dispatch(loadBudgetsByOwnerId(user.id)).unwrap();

        await Promise.all([
          ...budgets.map((budget) => dispatch(fetchBudgetSummary(budget.id)).unwrap()),
          dispatch(loadBudgetMembershipsByUserId(user.id)).unwrap(),
          dispatch(loadUserPreference(user.id)).unwrap(),
          dispatch(loadTransactionsByBudgetId(defaultBudgetId)).unwrap(),
        ]);

        setIsReady(true);
      } catch (error: unknown) {
        console.error('[Batua Bootstrap] Initialization failed:', error);

        if (error instanceof Error) {
          console.error('[Batua Bootstrap] Message:', error.message);
          console.error('[Batua Bootstrap] Stack:', error.stack);
        } else {
          console.error('[Batua Bootstrap] Rejected value:', JSON.stringify(error, null, 2));
        }

        const errorMessage =
          error instanceof Error
            ? `${error.message}\n\n${error.stack ?? ''}`
            : typeof error === 'string'
              ? error
              : (JSON.stringify(error, null, 2) ?? String(error));

        setBootstrapError(errorMessage);
      }
    }

    void initialize();
  }, [dispatch, migrationsReady]);

  if (bootstrapError) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Unable to initialize Batua</Text>

        <Text selectable style={{ fontSize: 12 }}>
          {bootstrapError}
        </Text>
      </View>
    );
  }

  if (!migrationsReady || !isReady || userStatus === 'failed') {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default AppBootstrap;
