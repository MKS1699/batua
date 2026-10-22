export interface ValidatorSuccessMessage {
  validation: 'success';
  message?: string;
}

export interface ValidatorErrorMessage {
  validation: 'fail';
  message: string;
  errorAt?: string;
}

export type Validation = ValidatorSuccessMessage | ValidatorErrorMessage;

export type Validations = Validation[];
