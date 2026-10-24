import { useAppDispatch } from '@/store/hooks';
import { getUser, UPDATE_USER_INPUT, updateUser } from '@/store/slice/userSlice';
import { validateInput } from '@/utils/validators/common';
import { USER_NAME_MAX_LENGTH, userTextValidators } from '@/utils/validators/user';
import { FloppyDiskIcon, WarningCircleIcon, XCircleIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppCard, AppInput } from './ui';

interface EditProfileProps {
  user: ReturnType<typeof getUser>;
  onCancel: () => void;
}

enum EditProfileTouchableFieldsEnum {
  name = 'name',
  email = 'email',
  phone = 'phone',
}

const EditProfile = ({ user, onCancel }: EditProfileProps) => {
  const dispatch = useAppDispatch();
  const [editUserState, setEditUserState] = useState<UPDATE_USER_INPUT['updates'] | null>(null);
  const hasUserEdited =
    !!user &&
    !!editUserState &&
    (user.name !== editUserState.name ||
      user.email !== editUserState.email ||
      user.phone !== editUserState.phone);

  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<EditProfileTouchableFieldsEnum, boolean>>
  >({});

  const hasValidationErrors =
    !editUserState ||
    Object.values(EditProfileTouchableFieldsEnum).some((field) => {
      const value = editUserState[field]?.trim() ?? '';
      const validators = userTextValidators[field] ?? [];

      return validateInput(value, validators) !== null;
    });

  function handleInputBlur(touchableField: EditProfileTouchableFieldsEnum) {
    setTouchedFields((prev) => ({
      ...prev,
      [touchableField]: true,
    }));
  }

  useEffect(() => {
    if (!user) return;

    setEditUserState((current) => current ?? user);
  }, [user]);

  function handleUserNameChange(newName: string) {
    const prevUser = editUserState;
    if (!prevUser) return;
    setEditUserState({
      ...prevUser,
      name: newName,
    });
  }

  function handleUserPhoneChange(newPhone: string) {
    const prevUser = editUserState;
    if (!prevUser) return;
    setEditUserState({
      ...prevUser,
      phone: newPhone,
    });
  }

  function handleUserEmailChange(newEmail: string) {
    const prevUser = editUserState;
    if (!prevUser) return;
    setEditUserState({
      ...prevUser,
      email: newEmail,
    });
  }

  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!editUserState || !user || !hasUserEdited) return;

    const fieldsToValidate = [
      EditProfileTouchableFieldsEnum.name,
      EditProfileTouchableFieldsEnum.email,
      EditProfileTouchableFieldsEnum.phone,
    ];

    setTouchedFields((prev) => ({
      ...prev,
      name: true,
      email: true,
      phone: true,
    }));

    const hasErrors = fieldsToValidate.some((field) => {
      const value = editUserState[field]?.trim() ?? '';
      const validators = userTextValidators[field] ?? [];

      return validateInput(value, validators) !== null;
    });

    if (hasErrors) return;

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
      setTouchedFields({});
      onCancel();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  }

  function getFieldError(field: EditProfileTouchableFieldsEnum) {
    if (!touchedFields[field]) return undefined;

    const value = editUserState?.[field]?.trim() ?? '';
    const validators = userTextValidators[field] ?? [];

    return validateInput(value, validators) ?? undefined;
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
          variant={hasValidationErrors ? 'danger' : 'primary'}
          icon={
            !hasUserEdited || hasValidationErrors || isSaving ? (
              <WarningCircleIcon />
            ) : (
              <FloppyDiskIcon />
            )
          }
          iconPosition="left"
          disabled={!hasUserEdited || hasValidationErrors || isSaving}
          onPress={handleSave}
        />
      </View>
      {/* form */}
      <View>
        <AppInput
          label="Name"
          placeholder={editUserState?.name ?? 'Enter your name'}
          value={editUserState?.name}
          onBlur={() => handleInputBlur(EditProfileTouchableFieldsEnum.name)}
          onChangeText={handleUserNameChange}
          keyboardType="default"
          error={getFieldError(EditProfileTouchableFieldsEnum.name)}
          maxLength={USER_NAME_MAX_LENGTH}
        />
        <AppInput
          label="Email"
          placeholder={editUserState?.email ?? 'Enter your email'}
          value={editUserState?.email}
          onChangeText={handleUserEmailChange}
          onBlur={() => handleInputBlur(EditProfileTouchableFieldsEnum.email)}
          keyboardType="email-address"
          error={getFieldError(EditProfileTouchableFieldsEnum.email)}
        />
        <AppInput
          label="Phone"
          placeholder={editUserState?.phone ?? 'Enter your phone'}
          value={editUserState?.phone}
          onChangeText={handleUserPhoneChange}
          onBlur={() => handleInputBlur(EditProfileTouchableFieldsEnum.phone)}
          keyboardType="phone-pad"
          error={getFieldError(EditProfileTouchableFieldsEnum.phone)}
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
