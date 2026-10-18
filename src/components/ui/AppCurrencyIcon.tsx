import {
  CurrencyDollarIcon,
  CurrencyEurIcon,
  CurrencyGbpIcon,
  CurrencyInrIcon,
  CurrencyJpyIcon,
  CurrencyKrwIcon,
  CurrencyKztIcon,
  CurrencyNgnIcon,
  CurrencyRubIcon,
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
    case 'INR':
      return <CurrencyInrIcon {...props} />;
    case 'GBP':
      return <CurrencyGbpIcon {...props} />;
    case 'JPY':
      return <CurrencyJpyIcon {...props} />;
    case 'USD':
      return <CurrencyDollarIcon {...props} />;
    case 'EUR':
      return <CurrencyEurIcon {...props} />;
    case 'KRW':
      return <CurrencyKrwIcon {...props} />;
    case 'KZT':
      return <CurrencyKztIcon {...props} />;
    case 'NGN':
      return <CurrencyNgnIcon {...props} />;
    case 'RUB':
      return <CurrencyRubIcon {...props} />;
    default:
      return <MoneyWavyIcon {...props} />;
  }
};

export default AppCurrencyIcon;
