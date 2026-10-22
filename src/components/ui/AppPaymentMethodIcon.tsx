import {
  BankIcon,
  CreditCardIcon,
  DeviceMobileCameraIcon,
  DotsThreeOutlineIcon,
  MoneyIcon,
} from 'phosphor-react-native';

import { colors } from '@/theme';
import { PaymentMethod } from '@/types/dataTypes';
import { IconColors, iconSize, TypographyVariant } from '@/utils/utils';

interface AppPaymentMethodIconProps {
  paymentMethod: PaymentMethod;
  variant?: TypographyVariant;
  color?: IconColors;
}

const AppPaymentMethodIcon = ({
  paymentMethod,
  variant = 'body',
  color = 'borderStrong',
}: AppPaymentMethodIconProps) => {
  const size = iconSize(variant);
  const resolvedColor = color ? colors[color] : undefined;
  const props = { size, ...(resolvedColor ? { color: resolvedColor } : {}) };

  switch (paymentMethod) {
    case PaymentMethod.bankTransfer:
      return <BankIcon {...props} />;
    case PaymentMethod.cash:
      return <MoneyIcon {...props} />;
    case PaymentMethod.creditCard:
      return <CreditCardIcon {...props} />;
    case PaymentMethod.debitCard:
      return <CreditCardIcon {...props} />;
    case PaymentMethod.upi:
      return <DeviceMobileCameraIcon {...props} />;
    default:
      // this also handles "other" method
      return <DotsThreeOutlineIcon {...props} />;
  }
};

export default AppPaymentMethodIcon;
