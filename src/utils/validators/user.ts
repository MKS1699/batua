import { USER_INSERT } from '@/db/users';
import { emailValidator, InputValidator, isValidDate, maxLength, requiredText } from './common';

export const USER_NAME_MAX_LENGTH: number = 20;

export const userTextValidators: Partial<Record<keyof USER_INSERT, InputValidator<string>[]>> = {
  id: [requiredText], // state or db validation
  name: [requiredText, maxLength(USER_NAME_MAX_LENGTH)], // ui & state or db validation
  createdAt: [requiredText, isValidDate], // state or db validation
  email: [requiredText, emailValidator], // ui & state or db validation
  phone: [requiredText], // validation to validate type of phone based on country code could be // ui & state or db validation
  updatedAt: [requiredText, isValidDate], // ui & state or db validation
};
