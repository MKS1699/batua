import { colors } from '@/theme';
import { GenericDates, getGenericDate } from '@/utils/utils';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { PencilSimpleIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../ui';

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
      {!editDate ? (
        <View style={styles.container}>
          <AppText
            variant="bodyItalic"
            style={[
              styles.dateDisplay,
              !canEdit && {
                borderRightWidth: 1,
                borderTopRightRadius: 50,
                borderBottomRightRadius: 50,
              },
            ]}
          >
            {dateToDisplay}
          </AppText>
          {canEdit && (
            <Pressable
              onPress={() => {
                setEditDate(true);
                setPickerMode('date');
              }}
              style={styles.editIcon}
            >
              <PencilSimpleIcon size={32} weight="thin" />
            </Pressable>
          )}
        </View>
      ) : (
        <>
          {dateHandler && (
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
                    console.log(isPastDate);

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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateDisplay: {
    fontSize: 26,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.accentTeal,
    borderRightWidth: 0,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    flex: 1,
    paddingLeft: 20,
    paddingVertical: 5,
    height: 50,
  },
  editIcon: {
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderWidth: 1,
    borderColor: colors.accentTeal,
    padding: 2,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentBlue,
  },
});

export default TransactionDateTime;
