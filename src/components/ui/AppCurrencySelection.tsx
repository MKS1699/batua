import { colors } from '@/theme';
import { Currency, CurrencyCountryList, CurrencyList, CurrencyOption } from '@/types/dataTypes';
import { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
import { CaretUpDownIcon } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppBottomSheet, AppCard, AppCurrencyIcon, AppDivider, AppText } from '../ui';
import AppSearchBar from '../ui/AppSearchBar';

interface AppCurrencySelectionProps {
  currency: Currency;
  currencyHandler: (newCurr: Currency) => void;
}

const AppCurrencySelection = ({ currency, currencyHandler }: AppCurrencySelectionProps) => {
  const currenciesSheetRef = useRef<BottomSheetMethods | null>(null);
  const [query, setQuery] = useState<string>('');

  function handleQuery(query: string) {
    setQuery(query);
  }

  function handleCurrencySelect(newCurrency: Currency) {
    currencyHandler(newCurrency);
    currenciesSheetRef.current?.close();
    setQuery('');
  }

  function createCurrencyCard(currency: CurrencyOption, country_name?: string) {
    const { code, name } = currency;

    return (
      <Pressable
        onPress={() => handleCurrencySelect(code as Currency)}
        key={`Currency-${currency.title}-${country_name ?? name}`}
        style={styles.currencySelectCard}
        hitSlop={10}
      >
        <View style={styles.currencySelectCardItem}>
          <AppCurrencyIcon currency={code as Currency} variant="body" />
          <AppText variant="body">{code}</AppText>
        </View>
        <View style={styles.currencySelectCardItem}>
          <AppDivider
            orientation="vertical"
            rounded
            slanting="right"
            slantingAngle="10deg"
            bgColor={colors.borderSubtle}
          />
          <AppText variant="metadataItalic">{country_name ?? name}</AppText>
        </View>
      </Pressable>
    );
  }

  const normalizedQuery = query.trim().toLowerCase();

  const filteredList = (): CurrencyOption[] => {
    return CurrencyList.filter(({ code, name, title, symbol }) => {
      const matchesCurrency = [code, name, title, symbol].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );

      const matchesCountry = CurrencyCountryList.some(
        (country) =>
          country.currency_code === code &&
          [country.country_name, country.official_country_name, country.currency_name].some(
            (value) => value.toLowerCase().includes(normalizedQuery)
          )
      );

      return matchesCurrency || matchesCountry;
    });
  };

  const filteredCurrencies = filteredList();

  useEffect(() => {
    if (query.trim().length > 0) {
      currenciesSheetRef.current?.snapToIndex(1);
    }
  }, [query]);

  return (
    <View style={{ width: 'auto' }}>
      <Pressable onPress={() => currenciesSheetRef.current?.snapToIndex(0)} hitSlop={10}>
        <AppCard style={styles.currencyView}>
          <View style={styles.currencyCard}>
            <AppCurrencyIcon currency={currency} variant="body" />
            <AppText variant="body">{currency}</AppText>
          </View>
          <CaretUpDownIcon size={22} />
        </AppCard>
      </Pressable>

      <AppBottomSheet
        sheetRef={currenciesSheetRef}
        onClose={() => setQuery('')}
        snapPoints={['half', 'full']}
        header={
          // search bar for currencies
          <AppCard style={{ marginTop: 0, paddingTop: 0 }}>
            <AppSearchBar
              query={query}
              queryHandler={handleQuery}
              placeholder="Search Currency..."
              style={{ marginTop: 0, paddingTop: 0 }}
            />
          </AppCard>
        }
      >
        <AppCard style={styles.bottomSheetCard}>
          <View style={styles.currencyList}>
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => {
                const matchingCountry = CurrencyCountryList.find(
                  (country) =>
                    country.currency_code === currency.code &&
                    [country.country_name, country.official_country_name].some((value) =>
                      value.toLowerCase().includes(normalizedQuery)
                    )
                );

                return createCurrencyCard(currency, matchingCountry?.official_country_name);
              })
            ) : (
              <AppText>No currencies found.</AppText>
            )}
          </View>
        </AppCard>
      </AppBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  currencyView: {
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexShrink: 0,
  },
  bottomSheetCard: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  currencySelectCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 6,
  },
  currencyList: {
    gap: 10,
  },
  searchResult: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.borderSubtle,
    paddingVertical: 10,
    flexDirection: 'column',
    gap: 10,
  },
  currencySelectCardItem: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingRight: 10 },
});

export default AppCurrencySelection;
