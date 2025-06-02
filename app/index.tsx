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
import { useBookmarks } from '@/hooks/useBookmarks';
import { ListItem } from '@/components/ListItem';
import { useSpeech } from '@/hooks/useSpeech';

export default function App() {
  let [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_700Bold,
    Lora_400Regular_Italic,
  });
  const { bookmarks, updateBookmark } = useBookmarks();
  const {
    speak,
    stop,
    currentId,
    loading: gettingText,
    isSpeaking,
    abortLoading: cancelGettingText,
  } = useSpeech();
  if (!fontsLoaded || !bookmarks?.length) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headlineContainer}>
        <Text style={styles.headline}>Bookmarked Articles</Text>
        <TouchableOpacity
          onPress={stop}
          style={styles.stop}
        >
          <Text style={styles.stopText}>Stop</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.counter}>[{bookmarks.length} links]</Text>
      <Text style={styles.read}>Consumed</Text>
      <FlatList
        data={bookmarks}
        removeClippedSubviews={true}
        renderItem={({ item }) => (
          <ListItem
            {...item}
            onHearPress={speak}
            onStopPress={stop}
            playing={isSpeaking && currentId === item.id}
            loading={gettingText && currentId === item.id}
            onCancelPress={cancelGettingText}
            onCheckboxChange={updateBookmark}
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
  },
  headlineContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  headline: {
    fontFamily: 'Lora_700Bold',
    fontSize: 40,
    marginBottom: 8,
    alignSelf: 'flex-start',
    flex: 1,
  },
  counter: {
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'Lora_400Regular_Italic',
    paddingHorizontal: 16,
  },
  read: {
    fontFamily: 'Lora_700Bold',
    marginBottom: 20,
    textAlign: 'right',
    width: '100%',
    paddingHorizontal: 16,
  },
  stop: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: 'blueviolet',
    borderRadius: 4,
    alignItems: 'center',
  },
  stopText: {
    color: 'white',
    fontFamily: 'Lora_700Bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
