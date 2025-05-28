import { useSpeech } from '@/hooks/useSpeech';
import { formatDate, isHearable } from '@/lib/helpers';
import { Bookmark } from '@/types/bookmark';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Speech from 'expo-speech';

type ListItemProps = {
  id: Bookmark['id'];
  title: Bookmark['title'];
  // consumed: Bookmark["consumed"];
  url: Bookmark['url'];
  dateAdded: number;
  // onCheckboxChange: (id: Bookmark["id"], isChecked: boolean) => void;
  // onHearClick: (id: Bookmark["id"]) => void;
  // number: number;
  // onStop: () => void;
  // onCancel: () => void;
};
export const ListItem = ({
  id,
  // onCheckboxChange,
  // number,
  dateAdded,
  // consumed,
  url,
  title,
  // onHearClick,
  // onStop,
  // onCancel,
}: ListItemProps) => {
  const hearable = useMemo(() => isHearable(url), [url]);
  return (
    <View style={styles.container}>
      <Text>{formatDate(dateAdded)}</Text>
      <Text style={styles.title}>{title}</Text>
      {hearable ? (
        <TouchableOpacity
          onPress={(e) => {
            Speech.speak(`WebView with some things written in native is probably the most pragmatic way to get it done. If there is a feature that requires native functionality just write that part in native the rest reuse the site and make some changes to integrate the two.`)
          }}
        >
          <Text>Hear</Text>
        </TouchableOpacity>
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
});
