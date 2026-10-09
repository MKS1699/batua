import { EditProfile, ScreenContainer, UserCard } from '@/components';
import { AppBottomSheet, AppButton } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';
import { getUser } from '@/store/slice/userSlice';
import BottomSheet from '@expo/ui/community/bottom-sheet';
import { PencilSimpleIcon } from 'phosphor-react-native';
import { useEffect, useRef } from 'react';
import { Keyboard, StyleSheet } from 'react-native';

const User = () => {
  const user = useAppSelector(getUser);
  const editProfileRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const keyboardSubscription = Keyboard.addListener('keyboardDidShow', () => {
      editProfileRef.current?.snapToIndex(1);
    });

    return () => keyboardSubscription.remove();
  }, []);

  return (
    <ScreenContainer style={styles.container}>
      <UserCard user={user} />
      <AppButton
        variant="primary"
        label="Edit Profile"
        icon={<PencilSimpleIcon />}
        iconPosition="left"
        onPress={() => {
          editProfileRef.current?.snapToIndex(0);
        }}
      />
      <AppBottomSheet sheetRef={editProfileRef} onClose={() => {}} snapPoints={['50%', '90%']}>
        <EditProfile user={user} onCancel={() => editProfileRef?.current?.close()} />
      </AppBottomSheet>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    gap: 10,
    justifyContent: 'center',
  },
});

export default User;
