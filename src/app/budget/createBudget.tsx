import { ScreenContainer, ScreenHeader } from '@/components';
import { AppInput, AppText } from '@/components/ui';
import { CreateBudgetInput } from '@/db/budgets';
import { useAppSelector } from '@/store/hooks';
import { getUser } from '@/store/slice/userSlice';
import { objectLogger } from '@/utils/utils';
import { BUDGET_DESCRIPTION_MAX_LENGTH, BUDGET_NAME_MAX_LENGTH } from '@/utils/validators/budget';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const CreateBudget = () => {
  const { userId } = useLocalSearchParams();
  const currentUser = useAppSelector(getUser);
  const [budget, setBudget] = useState<CreateBudgetInput | null>(null);
  const [initialBudget, setInitialBudget] = useState<CreateBudgetInput | null>(null);

  useEffect(() => {
    objectLogger(`user details`, userId);
    objectLogger(`current user`, currentUser);

    if (!currentUser || currentUser.id !== userId) return;

    const initialValues: CreateBudgetInput = {
      description: '',
      name: '',
      ownerId: userId,
      startDate: '',
      currency: 'INR',
      endDate: '',
      isShareable: false,
      limitAmount: 0,
    };

    setInitialBudget(initialValues);
    setBudget(initialValues);
  }, [userId, currentUser]);

  objectLogger('initial budget', initialBudget);
  objectLogger('budget', budget);

  /*  
    to do inputs
    name: string;
    description: string;
    ownerId: string; // userId from the route
    startDate: string;
    endDate?: string | null | undefined;
    currency?: "AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" | "AZN" | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BOV" | "BRL" | "BSD" | "BTN" | "BWP" | "BYN" | "BZD" | "CAD" | "CDF" | "CHF" | "CLF" | "CLP" | "CNY" | "COP" | "CRC" | "CUP" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EGP" | "ETB" | "ERN" | "EUR" | "FJD" | "FKP" | "GBP" | "GEL" | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | ... 105 more ... | undefined;
    limitAmount?: number | ... 1 more ... | undefined;
    isShareable?: boolean | undefined; */

  return (
    <ScreenContainer padding={0}>
      <ScreenHeader title="New Budget" />
      <View style={styles.form}>
        <AppText>{userId}</AppText>
        {/* text inputs */}
        <View>
          <AppInput
            label="Name"
            placeholder="What would it be called ?"
            keyboardType="default"
            maxLength={BUDGET_NAME_MAX_LENGTH}
            autoGrow
            maxAutoGrowHeight={60}
          />
          <AppInput
            label="Description"
            placeholder="Description of the budget if any."
            keyboardType="default"
            maxLength={BUDGET_DESCRIPTION_MAX_LENGTH}
            autoGrow
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    gap: 10,
    margin: 10,
  },
});

export default CreateBudget;
