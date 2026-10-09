import BottomSheet, {
  BottomSheetMethods,
  BottomSheetProps,
  BottomSheetView,
} from '@expo/ui/community/bottom-sheet';
import { ReactNode, RefObject } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

interface AppBottomSheetProps {
  onClose: () => void;
  children: ReactNode;
  snapPoints?: BottomSheetProps['snapPoints'];
  sheetRef: RefObject<BottomSheetMethods | null>;
}

const AppBottomSheet = ({ onClose, children, snapPoints, sheetRef }: AppBottomSheetProps) => {
  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
    >
      <BottomSheetView style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default AppBottomSheet;
