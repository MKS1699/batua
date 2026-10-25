import { BUDGET_SELECT } from '@/db/budgets';
import {
  boolValidator,
  currencyValidator,
  InputValidator,
  isValidDate,
  maxLength,
  positiveAmount,
  requiredText,
} from './common';

export const BUDGET_NAME_MAX_LENGTH: number = 50;
export const BUDGET_DESCRIPTION_MAX_LENGTH: number = 100;

export const budgetTextValidators: Partial<
  Record<Exclude<keyof BUDGET_SELECT, 'isShareable' | 'currency'>, InputValidator<string>[]>
> = {
  createdAt: [isValidDate],
  description: [maxLength(BUDGET_DESCRIPTION_MAX_LENGTH)],
  startDate: [isValidDate],
  endDate: [isValidDate], // to add validator which distinguishes that the date provided is not of past than the start date
  id: [requiredText],
  name: [requiredText, maxLength(BUDGET_NAME_MAX_LENGTH)],
  ownerId: [requiredText],
  updatedAt: [isValidDate],
  limitAmount: [positiveAmount],
};

export const currencyValidators: InputValidator<BUDGET_SELECT['currency']>[] = [currencyValidator];

export const sharableValidators: InputValidator<BUDGET_SELECT['isShareable']>[] = [boolValidator];
