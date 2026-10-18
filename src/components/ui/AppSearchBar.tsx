import { MagnifyingGlassIcon } from 'phosphor-react-native';
import { View, ViewStyle } from 'react-native';
import AppInput from './AppInput';

interface AppSearchBarProps {
  query: string;
  queryHandler: (query: string) => void;
  placeholder: string;
  style?: ViewStyle;
}

const AppSearchBar = ({ query, queryHandler, placeholder, style }: AppSearchBarProps) => {
  return (
    <View style={style}>
      <AppInput
        label=""
        iconPosition="start"
        icon={<MagnifyingGlassIcon weight="thin" />}
        placeholder={placeholder}
        value={query}
        onChangeText={queryHandler}
      />
    </View>
  );
};

export default AppSearchBar;
