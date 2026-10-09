import { useAppDispatch } from '@/store/hooks';
import { deleteUser, getUser } from '@/store/slice/userSlice';
import { colors } from '@/theme';
import { AtIcon, DeviceMobileCameraIcon, UserIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppText } from './ui';

interface UserCardProps {
  user: ReturnType<typeof getUser>;
}

const UserCard = ({ user }: UserCardProps) => {
  const dispatch = useAppDispatch();
  function handleDelete() {
    if (!user) return;
    dispatch(deleteUser(user?.id));
  }

  return (
    <AppCard backgroundColor={colors.accentPink}>
      <View style={styles.userInfo}>
        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <UserIcon weight="thin" size={20} />
          </View>
          <AppText variant="remainingAmount">{user?.name}</AppText>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <AtIcon weight="thin" size={20} />
          </View>
          <AppText variant="bodyItalic">{user?.email}</AppText>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <DeviceMobileCameraIcon weight="thin" size={20} />
          </View>
          <AppText variant="metadataItalic">{user?.phone}</AppText>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  user: {
    paddingVertical: 10,
  },
  userInfo: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    backgroundColor: colors.accentYellow,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    padding: 3,
    borderRadius: 5,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default UserCard;
