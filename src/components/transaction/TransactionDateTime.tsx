import { colors } from '@/theme';
import { GenericDates, getGenericDate } from '@/utils/utils';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { CalendarDotIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppCard, AppText } from '../ui';

interface TransactionDateTimeProps {
  date: string;
  editMode?: boolean;
  dateHandler?: (date: Date) => void;
}

const TransactionDateTime = ({ date, editMode = false, dateHandler }: TransactionDateTimeProps) => {
  const now = new Date();
  const parsedDate = new Date(date);

  const genericDate = getGenericDate(parsedDate);

  const dateToDisplay =
    genericDate !== GenericDates.undefined ? genericDate : parsedDate.toLocaleDateString();

  const [editDate, setEditDate] = useState<boolean>(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currDate, setCurrDate] = useState<Date>(parsedDate);

  const canEdit = editMode && typeof dateHandler === 'function';

  if (Number.isNaN(parsedDate.getTime())) {
    return <AppText>—</AppText>;
  }

  return (
    <>
      <Pressable
        onPress={() => {
          setEditDate(true);
          setPickerMode('date');
        }}
      >
        <AppCard style={styles.container}>
          <AppText variant="body">{dateToDisplay}</AppText>
          <CalendarDotIcon size={22} />
        </AppCard>
      </Pressable>

      {editDate && dateHandler && (
        <>
          {pickerMode === 'date' ? (
            // date picker
            <DateTimePicker
              maximumDate={now}
              value={new Date(date)}
              onValueChange={(_, changedDate) => {
                if (!changedDate) return;

                // checking selected date for past date
                const updatedDate = new Date(changedDate);
                const selectedDay = new Date(updatedDate);
                const today = new Date();

                selectedDay.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                const isPastDate = selectedDay.getTime() < today.getTime();

                //   setting time to 12 pm Noon time for past date
                if (isPastDate) {
                  updatedDate.setHours(12, 0, 0, 0);
                } else {
                  // Today's transaction: explicitly reset to current time
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
              }}
              mode="date"
              onDismiss={() => {
                setEditDate(false);
                setPickerMode('date');
              }}
              positiveButton={{ label: 'Time' }}
            />
          ) : (
            // time picker
            <DateTimePicker
              maximumDate={now}
              value={currDate}
              onValueChange={(_, changedDate) => {
                if (changedDate) {
                  const newDateWithNewTime = new Date(currDate);

                  newDateWithNewTime.setHours(
                    changedDate.getHours(),
                    changedDate.getMinutes(),
                    changedDate.getSeconds(),
                    changedDate.getMilliseconds()
                  );

                  setCurrDate(newDateWithNewTime);
                  setPickerMode('date');
                  dateHandler(newDateWithNewTime);
                  setEditDate(false);
                }
              }}
              mode="time"
              onDismiss={() => {
                setEditDate(false);
                setPickerMode('date');
              }}
              positiveButton={{
                label: 'Select',
              }}
            />
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'auto',
    gap: 10,
    padding: 10,
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
  // editIcon: {
  //   borderTopRightRadius: 12,
  //   borderBottomRightRadius: 12,
  //   borderWidth: 1,
  //   borderColor: colors.accentTeal,
  //   padding: 2,
  //   width: 36,
  //   height: 44,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: colors.accentBlue,
  // },
});

export default TransactionDateTime;
