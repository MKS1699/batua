import { colors } from '@/theme';
import { GenericDates, getGenericDate } from '@/utils/utils';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { CalendarPlusIcon, CalendarXIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import AppCard from './AppCard';
import AppDivider from './AppDivider';
import AppText from './AppText';

interface AppDateTimePickerProps {
  date: string;
  dateHandler?: (date: Date) => void;
  maxDateLimit?: Date;
  minDateLimit?: Date;
  clearDateHandler?: () => void;
}

const AppDateTimePicker = ({
  date,
  dateHandler,
  maxDateLimit,
  minDateLimit,
  clearDateHandler,
}: AppDateTimePickerProps) => {
  const parsedDate = date ? new Date(date) : null;

  const hasValidDate = parsedDate !== null && !Number.isNaN(parsedDate.getTime());

  const initialDate = hasValidDate ? parsedDate : new Date();

  const genericDate = hasValidDate ? getGenericDate(initialDate) : GenericDates.undefined;

  const dateToDisplay = hasValidDate
    ? genericDate !== GenericDates.undefined
      ? genericDate
      : initialDate.toLocaleDateString()
    : 'Select date';

  const [editDate, setEditDate] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currDate, setCurrDate] = useState<Date>(initialDate);

  function isWithinDateLimits(value: Date) {
    const selectedDay = new Date(value);
    selectedDay.setHours(0, 0, 0, 0);

    if (maxDateLimit) {
      const maxDay = new Date(maxDateLimit);

      if (Number.isNaN(maxDay.getTime())) return false;

      maxDay.setHours(0, 0, 0, 0);

      if (selectedDay.getTime() > maxDay.getTime()) return false;
    }

    if (minDateLimit) {
      const minDay = new Date(minDateLimit);

      if (Number.isNaN(minDay.getTime())) return false;

      minDay.setHours(0, 0, 0, 0);

      if (selectedDay.getTime() < minDay.getTime()) return false;
    }

    return true;
  }

  function closePicker() {
    setEditDate(false);
    setPickerMode('date');
  }

  function handleOpenPicker() {
    const openingDate = hasValidDate && isWithinDateLimits(initialDate) ? initialDate : new Date();

    setCurrDate(openingDate);
    setPickerMode('date');
    setEditDate(true);
  }

  function handleDateChange(changedDate?: Date) {
    if (!changedDate) return;

    const updatedDate = new Date(changedDate);

    if (Number.isNaN(updatedDate.getTime())) return;

    if (!isWithinDateLimits(updatedDate)) return;

    const selectedDay = new Date(updatedDate);
    const today = new Date();

    selectedDay.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const isPastDate = selectedDay.getTime() < today.getTime();

    if (isPastDate) {
      // Preserve the existing behavior for past transaction dates.
      updatedDate.setHours(12, 0, 0, 0);
    } else {
      // Use the current time when selecting today or a future date.
      const currentTime = new Date();

      updatedDate.setHours(
        currentTime.getHours(),
        currentTime.getMinutes(),
        currentTime.getSeconds(),
        currentTime.getMilliseconds()
      );
    }

    setCurrDate(updatedDate);
    setPickerMode('time');
  }

  function handleTimeChange(changedDate?: Date) {
    if (!changedDate) return;

    const newDateWithNewTime = new Date(currDate);

    newDateWithNewTime.setHours(
      changedDate.getHours(),
      changedDate.getMinutes(),
      changedDate.getSeconds(),
      changedDate.getMilliseconds()
    );

    // Enforce the date-only limits before committing the selection.
    if (!isWithinDateLimits(newDateWithNewTime)) {
      setPickerMode('date');
      return;
    }

    setCurrDate(newDateWithNewTime);
    dateHandler?.(newDateWithNewTime);
    closePicker();
  }

  function clearDate() {
    if (clearDateHandler) {
      // self value reset
      setCurrDate(initialDate);
      setEditDate(false);
      setPickerMode('date');
      // parent clear handler
      clearDateHandler();
    }
    return;
  }

  return (
    <>
      {/* <AppCard style={styles.container}>
        <AppText variant="body" style={{ flex: 1 }}>
          {dateToDisplay}
        </AppText>
        <Pressable onPress={handleOpenPicker}>
          <CalendarPlusIcon size={22} />
        </Pressable>
        {clearDateHandler && currDate && (
          <Pressable onPress={clearDate} style={{}}>
            <AppDivider orientation="vertical" rounded />
            <CalendarXIcon size={22} />
          </Pressable>
        )}
      </AppCard> */}

      <AppCard style={styles.container}>
        <AppText variant="body" style={styles.dateText}>
          {dateToDisplay}
        </AppText>

        <Pressable onPress={handleOpenPicker} style={styles.iconButton} hitSlop={4}>
          <CalendarPlusIcon size={22} />
        </Pressable>

        {clearDateHandler && hasValidDate && (
          <>
            <AppDivider orientation="vertical" rounded />
            <Pressable onPress={clearDate} style={styles.iconButton} hitSlop={4}>
              <CalendarXIcon size={22} />
            </Pressable>
          </>
        )}
      </AppCard>

      {editDate && dateHandler && (
        <>
          {pickerMode === 'date' ? (
            <DateTimePicker
              maximumDate={maxDateLimit}
              minimumDate={minDateLimit}
              value={currDate}
              onValueChange={(_, changedDate) => {
                handleDateChange(changedDate);
              }}
              mode="date"
              onDismiss={closePicker}
              positiveButton={{ label: 'Time' }}
            />
          ) : (
            <DateTimePicker
              value={currDate}
              onValueChange={(_, changedDate) => {
                handleTimeChange(changedDate);
              }}
              mode="time"
              onDismiss={closePicker}
              positiveButton={{ label: 'Select' }}
            />
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   alignSelf: 'auto',
  //   flexShrink: 1,
  //   gap: 10,
  //   padding: 10,
  // },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'auto',
    flexShrink: 1,
    gap: 8,
    padding: 10,
  },
  dateText: {
    flex: 1,
    flexShrink: 1,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dateDisplay: {
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.accentTeal,
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    height: 44,
    flexShrink: 1,
  },
});

export default AppDateTimePicker;
