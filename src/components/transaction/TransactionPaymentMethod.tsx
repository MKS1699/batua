import { TRANSACTION_SELECT } from '@/db/transactions';
import { PaymentMethod, PaymentMethodDefined } from '@/types/dataTypes';
import { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
import { useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppBottomSheet, AppCard, AppPaymentMethodIcon, AppText } from '../ui';

interface TransactionPaymentMethodProps {
  paymentMethod: TRANSACTION_SELECT['paymentMethod'];
  paymentHandler: (method: TransactionPaymentMethodProps['paymentMethod']) => void;
}

const TransactionPaymentMethod = ({
  paymentHandler,
  paymentMethod,
}: TransactionPaymentMethodProps) => {
  const definedMethod = PaymentMethodDefined[paymentMethod];
  const paymentMethodSheetRef = useRef<BottomSheetMethods | null>(null);
  return (
    <>
      <Pressable
        style={{ flex: 1 }}
        hitSlop={10}
        onPress={() => paymentMethodSheetRef?.current?.snapToIndex(1)}
      >
        <AppCard style={styles.container}>
          <AppText
            variant="body"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.paymentLabel}
          >
            {definedMethod}
          </AppText>

          <AppPaymentMethodIcon paymentMethod={paymentMethod} variant="body" />
        </AppCard>
      </Pressable>

      <AppBottomSheet
        sheetRef={paymentMethodSheetRef}
        onClose={() => paymentMethodSheetRef?.current?.close()}
        snapPoints={['half', 'full']}
      >
        <AppCard style={styles.bottomSheetCard}>
          {Object.entries(PaymentMethodDefined).map(([key, value]) => (
            <Pressable
              onPress={() => {
                paymentHandler(key as PaymentMethod);
                paymentMethodSheetRef?.current?.close();
              }}
              key={`Payment-Method-${value}`}
            >
              <AppCard style={styles.selectionCard}>
                <AppText variant="body">{value}</AppText>
                <AppPaymentMethodIcon variant="body" paymentMethod={key as PaymentMethod} />
              </AppCard>
            </Pressable>
          ))}
        </AppCard>
      </AppBottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    padding: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },

  paymentLabel: {
    flex: 1,
    minWidth: 0,
  },

  bottomSheetCard: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },

  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
});
export default TransactionPaymentMethod;
