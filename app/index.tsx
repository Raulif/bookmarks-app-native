import {
	Lora_400Regular,
	Lora_400Regular_Italic,
	Lora_700Bold,
} from '@expo-google-fonts/lora';
import { useFonts } from '@expo-google-fonts/lora/useFonts';
import { useCallback } from 'react';
import {
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from 'zustand';
import { Drawer } from '@/components/Drawer';
import { ListItem } from '@/components/ListItem';
import { PlayerButton } from '@/components/PlayButton';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useSpeech } from '@/hooks/useSpeech';
import playerStore from '@/store/playerStateStore';
import { Bookmark } from '@/types/bookmark';

export default function App() {
	let [fontsLoaded] = useFonts({
		Lora_400Regular,
		Lora_700Bold,
		Lora_400Regular_Italic,
	});
	const { bookmarks, updateBookmark } = useBookmarks();
	const { stop, cancel, getArticle } = useSpeech();
	const playerState = useStore(playerStore, (state) => state);

	const onToggleConsumed = useCallback(
		(id: Bookmark['id'], consumed: boolean) => {
			if (playerState.currentId === id) {
				stop();
			}
			updateBookmark(id, consumed);
		},
		[playerState.currentId],
	);

	if (!fontsLoaded || !bookmarks?.length) {
		return null;
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.headlineContainer}>
				<Text style={styles.headline}>Bookmarked Articles</Text>
				<TouchableOpacity
					onPress={cancel}
					style={styles.stop}
					className="cancel-button"
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
						isPlaying={
							playerState.currentId === item.id && playerState.isPlaying
						}
						onToggleConsumed={onToggleConsumed}
					>
						{item.hearable && (
							<View style={[item.consumed ? styles.consumed : {}]}>
								<PlayerButton
									onPlayPress={() => getArticle(item.id, item.title)}
									onCancelPress={cancel}
									onStopPress={stop}
									isListItem={true}
									isPlaying={
										playerState.currentId === item.id && playerState.isPlaying
									}
									isLoading={
										playerState.loadingId === item.id && playerState.isLoading
									}
								/>
							</View>
						)}
					</ListItem>
				)}
				keyExtractor={(item) => item.id}
			/>
			<Drawer>
				<PlayerButton isPlaying={true} onStopPress={stop} isListItem={false} />
			</Drawer>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
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
	consumed: {
		opacity: 0.3,
	},
});
