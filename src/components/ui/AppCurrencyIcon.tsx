import {
  CurrencyDollarIcon,
  CurrencyGbpIcon,
  CurrencyInrIcon,
  CurrencyJpyIcon,
  MoneyWavyIcon,
} from 'phosphor-react-native';

import { colors, typography } from '@/theme';
import { Currency } from '@/types/dataTypes';

type TypographyVariant = keyof typeof typography;
type IconColors = keyof typeof colors;

interface AppCurrencyIconProps {
  currency: Currency;
  variant?: TypographyVariant;
  color?: IconColors;
}

const AppCurrencyIcon = ({
  currency,
  variant = 'body',
  color = 'borderStrong',
}: AppCurrencyIconProps) => {
  const size = typography[variant].fontSize;
  const resolvedColor = color ? colors[color] : undefined;
  const props = { size, ...(resolvedColor ? { color: resolvedColor } : {}) };

  switch (currency) {
    case Currency.INR:
      return <CurrencyInrIcon {...props} />;
    case Currency.GBP:
      return <CurrencyGbpIcon {...props} />;
    case Currency.JPY:
      return <CurrencyJpyIcon {...props} />;
    case Currency.USD:
      return <CurrencyDollarIcon {...props} />;
    default:
      return <MoneyWavyIcon {...props} />;
  }
};

export default AppCurrencyIcon;
