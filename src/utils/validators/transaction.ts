import { TRANSACTION_INSERT, TRANSACTION_SELECT } from '@/db/transactions';
import { PaymentMethod, TransactionType } from '@/types/dataTypes';
import {
  currencyValidator,
  InputValidator,
  isValidDate,
  maxLength,
  noFutureDate,
  positiveAmount,
  requiredText,
} from './common';

export const TRANSACTION_TITLE_MAX_LENGTH: number = 50;
export const TRANSACTION_DESCRIPTION_MAX_LENGTH: number = 100;

export const validateTransactionType: InputValidator<TRANSACTION_SELECT['transactionType']> = (
  type
) => {
  const types = Object.values(TransactionType);
  if (!types.includes(type)) {
    return 'Invalid Transaction type.';
  }
  return null;
};

// export const validateOriginalCurrency: InputValidator<TRANSACTION_SELECT['originalCurrency']> = (
//   currency
// ) => {
//   if (!CurrencyCodes.includes(currency)) {
//     return 'Invalid Currency.';
//   }
//   return null;
// };

export const validatePaymentMethod: InputValidator<TRANSACTION_SELECT['paymentMethod']> = (
  method
) => {
  const methods = Object.values(PaymentMethod);
  if (!methods.includes(method)) {
    return 'Invalid Payment method.';
  }
  return null;
};

export const transactionTextValidators: Partial<
  Record<
    Exclude<keyof TRANSACTION_INSERT, 'originalCurrency' | 'transactionType' | 'paymentMethod'>,
    InputValidator<string>[]
  >
> = {
  budgetId: [requiredText],
  createdBy: [requiredText],
  id: [requiredText],
  title: [requiredText, maxLength(TRANSACTION_TITLE_MAX_LENGTH)],
  description: [maxLength(TRANSACTION_DESCRIPTION_MAX_LENGTH)],
  amount: [requiredText, positiveAmount],
  transactionDate: [isValidDate, noFutureDate],
  createdAt: [isValidDate],
  updatedAt: [isValidDate],
};

export const transactionTypeValidators: InputValidator<TRANSACTION_SELECT['transactionType']>[] = [
  validateTransactionType,
];

export const originalCurrencyValidators: InputValidator<TRANSACTION_SELECT['originalCurrency']>[] =
  [currencyValidator];

export const paymentMethodValidators: InputValidator<TRANSACTION_SELECT['paymentMethod']>[] = [
  validatePaymentMethod,
];
