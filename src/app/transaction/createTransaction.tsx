import { ScreenContainer, ScreenHeader } from '@/components';
import { TransactionPaymentMethod, TransactionTypeSelection } from '@/components/transaction';
import {
  AppButton,
  AppCurrencySelection,
  AppDateTimePicker,
  AppErrorCard,
  AppInput,
} from '@/components/ui';
import { CreateTransactionInput } from '@/db/transactions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getBudget } from '@/store/slice/budgetSlice';
import { addNewTransaction } from '@/store/slice/transactionSlice';
import { getUser } from '@/store/slice/userSlice';
import { colors } from '@/theme';
import { PaymentMethod, TransactionType } from '@/types/dataTypes';
import { validateInput } from '@/utils/validators/common';
import {
  originalCurrencyValidators,
  paymentMethodValidators,
  TRANSACTION_DESCRIPTION_MAX_LENGTH,
  TRANSACTION_TITLE_MAX_LENGTH,
  transactionTextValidators,
  transactionTypeValidators,
} from '@/utils/validators/transaction';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretLeftIcon, ReceiptIcon, ReceiptXIcon } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

enum InputTypesEnum {
  title = 'title',
  description = 'description',
  amount = 'amount',
}

export type ErrorCardDetailProps = { title: string; messages: string[] }[];

const CreateTransaction = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(getUser);
  const currentBudget = useAppSelector(getBudget);
  const { budgetId } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<CreateTransactionInput | null>(null);

  const [initialTransaction, setInitialTransaction] = useState<CreateTransactionInput | null>(null);

  const [touchedFields, setTouchedFields] = useState<Partial<Record<InputTypesEnum, boolean>>>({});
  const [amountInput, setAmountInput] = useState<string>('');

  const initializedBudgetId = useRef<string | null>(null);

  const [errorCards, setErrorCards] = useState<ErrorCardDetailProps>([]);

  function handleErrorCards(title: string, messages: string[]) {
    setErrorCards((prevCards) => {
      // Remove the previous card for this field.
      const remainingCards = prevCards.filter((card) => card.title !== title);

      // No errors remain for this field.
      if (messages.length === 0) {
        return remainingCards;
      }

      // Add the updated card.
      return [...remainingCards, { title, messages }];
    });
  }

  useEffect(() => {
    if (
      !currentUser ||
      typeof budgetId !== 'string' ||
      !currentBudget ||
      currentBudget.id !== budgetId ||
      initializedBudgetId.current === budgetId
    ) {
      return;
    }

    const initialValues: CreateTransactionInput = {
      amount: 0,
      budgetId,
      createdBy: currentUser.id,
      description: '',
      title: '',
      transactionDate: new Date().toISOString(),
      originalCurrency: currentBudget.currency,
      paymentMethod: PaymentMethod.cash,
      transactionType: TransactionType.expense,
    };

    setTransaction(initialValues);
    setInitialTransaction(initialValues);
    initializedBudgetId.current = budgetId;
  }, [currentUser, currentBudget, budgetId]);

  function handleInput(inputType: InputTypesEnum, value: string) {
    if (inputType === InputTypesEnum.amount) {
      setAmountInput(value);

      setTransaction((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          amount: Number(value) || 0,
        };
      });

      return;
    }

    setTransaction((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [inputType]: value,
      };
    });
  }

  function handleInputBlur(inputType: InputTypesEnum) {
    setTouchedFields((prev) => ({
      ...prev,
      [inputType]: true,
    }));
  }

  const hasTransactionChanged =
    transaction !== null &&
    initialTransaction !== null &&
    (transaction.title !== initialTransaction.title ||
      transaction.description !== initialTransaction.description ||
      transaction.amount !== initialTransaction.amount ||
      transaction.transactionDate !== initialTransaction.transactionDate ||
      transaction.originalCurrency !== initialTransaction.originalCurrency ||
      transaction.paymentMethod !== initialTransaction.paymentMethod ||
      transaction.transactionType !== initialTransaction.transactionType);

  const isTransactionValid =
    transaction !== null &&
    transaction.title.trim().length > 0 &&
    Number.isFinite(Number(amountInput)) &&
    Number(amountInput) > 0;

  const isCreateDisabled = !hasTransactionChanged || !isTransactionValid;

  function handleTransactionTypes(value: CreateTransactionInput['transactionType']) {
    setTransaction((prev) => (prev ? { ...prev, transactionType: value } : prev));

    const error = validateInput(value ?? TransactionType.expense, transactionTypeValidators);

    handleErrorCards('Transaction Type', error ? [error] : []);
  }

  function handleTransactionDate(date: Date) {
    setTransaction((prev) => (prev ? { ...prev, transactionDate: date.toISOString() } : prev));

    const error = validateInput(
      date.toISOString() ?? '',
      transactionTextValidators.transactionDate ?? []
    );

    handleErrorCards('Transaction Date', error ? [error] : []);
  }

  function clearTransactionDate() {
    setTransaction((prev) =>
      prev ? { ...prev, transactionDate: new Date().toISOString() } : prev
    );
  }

  function handleCurrency(currency: CreateTransactionInput['originalCurrency']) {
    setTransaction((prev) => (prev ? { ...prev, originalCurrency: currency } : prev));

    const error = validateInput(currency ?? 'INR', originalCurrencyValidators);

    handleErrorCards('Original Currency', error ? [error] : []);
  }

  function handlePayment(method: CreateTransactionInput['paymentMethod']) {
    setTransaction((prev) => (prev ? { ...prev, paymentMethod: method } : prev));

    const error = validateInput(method ?? PaymentMethod.cash, paymentMethodValidators);

    handleErrorCards('Payment Method', error ? [error] : []);
  }

  async function handleCreateTransaction() {
    if (!transaction) return;

    // Show text input errors when the user attempts submission.
    setTouchedFields({
      title: true,
      description: true,
      amount: true,
    });

    // Validate text inputs using their current form values.
    const titleError = validateInput(transaction.title, transactionTextValidators.title ?? []);

    const descriptionError = validateInput(
      transaction.description,
      transactionTextValidators.description ?? []
    );

    const amountError = validateInput(amountInput, transactionTextValidators.amount ?? []);

    // Validate the remaining fields using their respective types.
    const dateError = validateInput(
      transaction.transactionDate,
      transactionTextValidators.transactionDate ?? []
    );

    const typeError = transaction.transactionType
      ? validateInput(transaction.transactionType, transactionTypeValidators)
      : 'Please select a transaction type.';

    const currencyError = transaction.originalCurrency
      ? validateInput(transaction.originalCurrency, originalCurrencyValidators)
      : 'Please select original currency.';

    const paymentError = transaction.paymentMethod
      ? validateInput(transaction.paymentMethod, paymentMethodValidators)
      : 'Please select payment method.';

    // Collect errors for the non-text fields.
    const nextErrorCards: ErrorCardDetailProps = [
      ...(dateError ? [{ title: 'Transaction Date', messages: [dateError] }] : []),
      ...(typeError ? [{ title: 'Transaction Type', messages: [typeError] }] : []),
      ...(currencyError ? [{ title: 'Original Currency', messages: [currencyError] }] : []),
      ...(paymentError ? [{ title: 'Payment Method', messages: [paymentError] }] : []),
    ];

    setErrorCards(nextErrorCards);

    // Stop submission if any field is invalid.
    const hasErrors = [
      titleError,
      descriptionError,
      amountError,
      dateError,
      typeError,
      currencyError,
      paymentError,
    ].some((error) => error !== null);

    if (hasErrors) return;

    // Prepare clean values for persistence.
    const transactionPayload: CreateTransactionInput = {
      ...transaction,
      title: transaction.title.trim(),
      description: transaction.description.trim(),
      amount: Number(amountInput),
    };

    try {
      await dispatch(addNewTransaction(transactionPayload)).unwrap();

      // resetting state
      setTransaction(null);
      setInitialTransaction(null);
      setTouchedFields({});
      setAmountInput('');
      setErrorCards([]);
      initializedBudgetId.current = null;

      // returning back to previous screen
      router.back();
    } catch (error) {
      console.error('Failed to create transaction:', error);

      handleErrorCards('Create Transaction', [
        error instanceof Error ? error.message : 'Unable to create transaction. Please try again.',
      ]);
    }
  }

  return (
    <ScreenContainer padding={0}>
      <ScreenHeader title="New Transaction" />
      <View style={styles.form}>
        {/* transaction type selection */}
        <View style={{ gap: 10 }}>
          {transaction?.transactionType && (
            <TransactionTypeSelection
              onPressHandler={handleTransactionTypes}
              transactionType={transaction?.transactionType}
            />
          )}
        </View>
        {/* inputs */}
        <View style={{ width: '100%' }}>
          <AppInput
            label="Title"
            placeholder="Transaction Title"
            keyboardType="default"
            onChangeText={(value) => handleInput(InputTypesEnum.title, value)}
            onBlur={() => handleInputBlur(InputTypesEnum.title)}
            value={transaction?.title ?? ''}
            error={
              touchedFields?.title
                ? (validateInput(transaction?.title ?? '', transactionTextValidators.title ?? []) ??
                  undefined)
                : undefined
            }
            maxLength={TRANSACTION_TITLE_MAX_LENGTH}
            autoGrow
            maxAutoGrowHeight={60}
          />
          <AppInput
            label="Description"
            placeholder="Transaction description if any"
            keyboardType="default"
            onChangeText={(value) => handleInput(InputTypesEnum.description, value)}
            onBlur={() => handleInputBlur(InputTypesEnum.description)}
            value={transaction?.description ?? ''}
            error={
              touchedFields?.description
                ? (validateInput(
                    transaction?.description ?? '',
                    transactionTextValidators.description ?? []
                  ) ?? undefined)
                : undefined
            }
            maxLength={TRANSACTION_DESCRIPTION_MAX_LENGTH}
            autoGrow
          />
          <AppInput
            label="Amount"
            placeholder={
              transaction?.transactionType === TransactionType.expense
                ? 'How much did it cost?'
                : 'How much did you earn?'
            }
            keyboardType="decimal-pad"
            onChangeText={(value) => handleInput(InputTypesEnum.amount, value)}
            onBlur={() => handleInputBlur(InputTypesEnum.amount)}
            value={amountInput}
            error={
              touchedFields?.amount
                ? (validateInput(amountInput ?? '', transactionTextValidators.amount ?? []) ??
                  undefined)
                : undefined
            }
          />
        </View>
        {/* editable fields */}
        <View style={styles.datePickerContainer}>
          {transaction?.transactionDate && (
            <AppDateTimePicker
              date={transaction.transactionDate}
              dateHandler={handleTransactionDate}
              maxDateLimit={new Date()}
              clearDateHandler={clearTransactionDate}
            />
          )}
        </View>
        <View style={styles.curPayDate}>
          {transaction?.originalCurrency && (
            <AppCurrencySelection
              currency={transaction.originalCurrency}
              currencyHandler={handleCurrency}
            />
          )}

          {transaction?.paymentMethod && (
            <TransactionPaymentMethod
              paymentHandler={handlePayment}
              paymentMethod={transaction.paymentMethod}
            />
          )}
        </View>
      </View>
      {/* errors if any for field errors other than inputs */}
      {errorCards.length > 0 && (
        <ScrollView style={styles.errors}>
          {errorCards?.map((cards) => (
            <AppErrorCard label={cards.title} messages={cards.messages} key={cards.title} />
          ))}
        </ScrollView>
      )}
      {/* buttons */}
      <View style={styles.buttons}>
        {/* cancel or Go Back button */}
        <AppButton
          label={!isCreateDisabled ? 'Cancel Transaction' : 'Go Back'}
          icon={
            !isCreateDisabled ? (
              <ReceiptXIcon weight="regular" />
            ) : (
              <CaretLeftIcon weight="regular" />
            )
          }
          style={!isCreateDisabled ? styles.cancelTransaction : styles.goBack}
          onPress={() => router.back()}
        />
        {/* create transaction button */}
        <AppButton
          label="Create Transaction"
          icon={<ReceiptIcon weight="regular" />}
          disabled={isCreateDisabled}
          onPress={handleCreateTransaction}
        />
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
  buttons: { margin: 10, gap: 10 },
  goBack: { backgroundColor: colors.accentLavender },
  cancelTransaction: {
    backgroundColor: colors.statusError,
  },
  curPayDate: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  errors: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: 250,
    marginHorizontal: 10,
  },
  datePickerContainer: {
    minWidth: 0,
  },
});

export default CreateTransaction;
