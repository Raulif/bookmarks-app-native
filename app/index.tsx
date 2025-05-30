import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from '@expo-google-fonts/lora/useFonts';
import {
  Lora_400Regular,
  Lora_700Bold,
  Lora_400Regular_Italic,
} from '@expo-google-fonts/lora';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useBookmarks } from '@/hooks/useBookmarks';
import { ListItem } from '@/components/ListItem';
import { Bookmark } from '@/types/bookmark';
import { useSpeech } from '@/hooks/useSpeech';

export default function App() {
  let [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_700Bold,
    Lora_400Regular_Italic,
  });
  const { bookmarks } = useBookmarks();
  const { speak, stop, currentId, gettingText, isSpeaking, cancelGettingText } =
    useSpeech();
  if (!fontsLoaded || !bookmarks?.length) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headline}>Bookmarked Articles</Text>
      <Text style={styles.counter}>[{bookmarks.length} links]</Text>
      <Text style={styles.read}>Consumed</Text>
      <TouchableOpacity onPress={stop}>
        <Text>Stop</Text>
      </TouchableOpacity>
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <ListItem
            {...item}
            onHearPress={speak}
            onStopPress={stop}
            currentId={currentId}
            playing={isSpeaking && currentId === item.id}
            loading={gettingText && currentId === item.id}
            onCancelPress={cancelGettingText}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headline: {
    fontFamily: 'Lora_700Bold',
    fontSize: 40,
    marginBottom: 8,
  },
  counter: {
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'Lora_400Regular_Italic',
  },
  read: {
    fontFamily: 'Lora_700Bold',

    marginBottom: 20,
    textAlign: 'right',
    width: '100%',
  },
});
