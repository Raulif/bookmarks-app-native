import { formatDate, isHearable } from '@/lib/helpers';
import { Bookmark } from '@/types/bookmark';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HearButton } from './HearButton';

type ListItemProps = {
  id: Bookmark['id'];
  title: Bookmark['title'];
  // consumed: Bookmark["consumed"];
  url: Bookmark['url'];
  dateAdded: number;
  // onCheckboxChange: (id: Bookmark["id"], isChecked: boolean) => void;
  onHearPress: (id: Bookmark['id']) => void;
  // number: number;
  onStopPress: () => void;
  onCancelPress: () => void;
  currentId: Bookmark['id'];
  playing: boolean;
  loading: boolean;
};
export const ListItem = ({
  id,
  // onCheckboxChange,
  // number,
  dateAdded,
  // consumed,
  url,
  title,
  onHearPress,
  currentId,
  onStopPress,
  loading,
  onCancelPress,
  playing,
}: ListItemProps) => {
  const hearable = useMemo(() => isHearable(url), [url]);
  return (
    <View style={styles.container}>
      <Text>{formatDate(dateAdded)}</Text>
      <Text
        style={{ ...styles.title, ...(currentId === id ? styles.active : {}) }}
      >
        {title}
      </Text>
      {hearable ? (
        <HearButton
          playing={playing}
          loading={loading}
          onHearPress={() => onHearPress(id)}
          onStopPress={onStopPress}
          onCancelPress={onCancelPress}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontFamily: 'Lora_400Regular',
    lineHeight: 24,
  },
  container: {
    marginBottom: 16,
  },
  active: {
    color: 'blueviolet',
    fontFamily: 'Lora_700Bold',
    fontWeight: 700,
  },
});
