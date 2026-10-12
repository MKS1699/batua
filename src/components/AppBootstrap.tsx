// AppBootstrap.tsx
import { db } from '@/db/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserState, loadOrCreateUser } from '@/store/slice/userSlice';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { ReactNode, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import migrations from '../../drizzle/migrations'; // path to your migrations.js

type AppBootstrapProps = {
  children: ReactNode;
};

const AppBootstrap = ({ children }: AppBootstrapProps) => {
  const { success: migrationsReady, error: migrationError } = useMigrations(db, migrations as any);

  const dispatch = useAppDispatch();
  const { status: userStatus, currentUser } = useAppSelector(getUserState);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (!migrationsReady) return; // wait for migrations before touching the DB

    async function initialize() {
      const result = await dispatch(loadOrCreateUser());

      if (loadOrCreateUser.fulfilled.match(result)) {
        setIsReady(true);
      }
    }
    initialize();
  }, [dispatch, migrationsReady]);

  if (migrationError) {
    return (
      <View>
        <Text>Migration error: {migrationError.message}</Text>
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
