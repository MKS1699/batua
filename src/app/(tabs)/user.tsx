import ScreenContainer from '@/components/ScreenContainer';
import UserCard from '@/components/UserCard';
import { useAppSelector } from '@/store/hooks';
import { getUser } from '@/store/slice/userSlice';
import { Text, View } from 'react-native';

const User = () => {
  const user = useAppSelector(getUser);
  // to do create user profile load existing data then let user edit data
  return (
    <ScreenContainer>
      <View>
        <Text>User</Text>
        <UserCard user={user} />
      </View>
    </ScreenContainer>
  );
};

export default User;
