import { useAppDispatch } from '@/store/hooks';
import { getUser, UPDATE_USER_INPUT, updateUser } from '@/store/slice/userSlice';
import { FloppyDiskIcon, XCircleIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppCard, AppInput } from './ui';

interface EditProfileProps {
  user: ReturnType<typeof getUser>;
  onCancel: () => void;
}

type ProfileErrors = {
  name?: string;
  email?: string;
  phone?: string;
};

const EditProfile = ({ user, onCancel }: EditProfileProps) => {
  const dispatch = useAppDispatch();
  const [editUserState, setEditUserState] = useState<UPDATE_USER_INPUT['updates'] | null>(null);
  const hasUserEdited =
    !!user &&
    !!editUserState &&
    (user.name !== editUserState.name ||
      user.email !== editUserState.email ||
      user.phone !== editUserState.phone);
  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => {
    if (!user) return;

    setEditUserState((current) => current ?? user);
  }, [user]);

  function validateProfile(): ProfileErrors {
    const errors: ProfileErrors = {};

    const name = editUserState?.name?.trim() ?? '';
    const email = editUserState?.email?.trim() ?? '';
    const phone = editUserState?.phone?.trim() ?? '';

    if (!name) {
      errors.name = 'Name cannot be empty.';
    }

    if (!email) {
      errors.email = 'Email cannot be empty.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!phone) {
      errors.phone = 'Phone cannot be empty.';
    }

    return errors;
  }

  function handleUserNameChange(newName: string) {
    const prevUser = editUserState;
    if (!prevUser) return;
    setEditUserState({
      ...prevUser,
      name: newName,
    });

    setErrors((prev) => ({
      ...prev,
      name: undefined,
    }));
  }

  function handleUserPhoneChange(newPhone: string) {
    const prevUser = editUserState;
    if (!prevUser) return;
    setEditUserState({
      ...prevUser,
      phone: newPhone,
    });

    setErrors((prev) => ({
      ...prev,
      phone: undefined,
    }));
  }

  function handleUserEmailChange(newEmail: string) {
    const prevUser = editUserState;
    if (!prevUser) return;
    setEditUserState({
      ...prevUser,
      email: newEmail,
    });

    setErrors((prev) => ({
      ...prev,
      email: undefined,
    }));
  }

  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    const validationErrors = validateProfile();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    if (!editUserState || !user || !hasUserEdited) return;

    setIsSaving(true);

    try {
      const updatedUser = await dispatch(
        updateUser({
          id: user.id,
          updates: {
            name: editUserState.name?.trim(),
            email: editUserState.email?.trim(),
            phone: editUserState.phone?.trim(),
          },
        })
      ).unwrap();

      setEditUserState(updatedUser);
      setErrors({});
      onCancel(); // Close the sheet after a successful save
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Keep the sheet open so the user can retry.
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppCard style={styles.container}>
      {/* buttons */}
      <View style={styles.buttons}>
        <AppButton
          label="Cancel"
          variant="danger"
          icon={<XCircleIcon />}
          iconPosition="right"
          onPress={onCancel}
        />
        <AppButton
          label={isSaving ? 'Saving...' : 'Save'}
          variant="primary"
          icon={<FloppyDiskIcon />}
          iconPosition="left"
          disabled={!hasUserEdited || isSaving}
          onPress={handleSave}
        />
      </View>
      {/* form */}
      <View>
        <AppInput
          label="Name"
          placeholder={editUserState?.name ?? 'Enter your name'}
          value={editUserState?.name}
          onChangeText={handleUserNameChange}
          keyboardType="default"
          error={errors?.name}
        />
        <AppInput
          label="Email"
          placeholder={editUserState?.email ?? 'Enter your email'}
          value={editUserState?.email}
          onChangeText={handleUserEmailChange}
          keyboardType="email-address"
          error={errors?.email}
        />
        <AppInput
          label="Phone"
          placeholder={editUserState?.phone ?? 'Enter your phone'}
          value={editUserState?.phone}
          onChangeText={handleUserPhoneChange}
          keyboardType="phone-pad"
          error={errors?.phone}
        />
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flex: 1,
    flexGrow: 1,
  },
  buttons: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default EditProfile;
