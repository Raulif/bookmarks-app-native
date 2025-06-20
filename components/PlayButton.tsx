import { useCallback } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

type PlayerButtonProps = {
	onPlayPress?: () => void;
	onCancelPress?: () => void;
	onStopPress: () => void;
	isPlaying: boolean;
	isLoading?: boolean;
	isListItem: boolean;
};

export const PlayerButton = ({
	onCancelPress,
	onPlayPress,
	onStopPress,
	isPlaying,
	isLoading,
}: PlayerButtonProps) => {
	const onPress = useCallback(() => {
		if (isPlaying) {
			onStopPress();
		} else if (isLoading) {
			onCancelPress && onCancelPress();
		} else {
			onPlayPress && onPlayPress();
		}
	}, [isPlaying, isLoading, onCancelPress, onPlayPress, onStopPress]);

	return (
		<TouchableOpacity
			style={[styles.container, isPlaying ? styles.playingContainer : {}]}
			onPress={onPress}
		>
			{isLoading ? (
				<ActivityIndicator color="white" />
			) : !isPlaying ? (
				<View style={[styles.icon, styles.play]} />
			) : (
				<View style={[styles.icon, styles.stop]} />
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 32,
		width: 32,
		borderRadius: '50%',
		backgroundColor: 'blueviolet',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-end',
	},
	playingContainer: {
		backgroundColor: 'white',
	},
	icon: {
		height: 14,
		width: 14,
	},
	play: {
		borderTopWidth: 7,
		borderBottomWidth: 7,
		borderLeftWidth: 14,
		borderTopColor: 'transparent',
		borderBottomColor: 'transparent',
		borderLeftColor: 'white',
		marginLeft: 2,
	},
	pause: {
		borderLeftWidth: 5,
		borderRightWidth: 5,
		borderLeftColor: 'blueviolet',
		borderRightColor: 'blueviolet',
		marginLeft: 0,
	},
	resume: {
		borderTopWidth: 7,
		borderBottomWidth: 7,
		borderLeftWidth: 14,
		borderTopColor: 'transparent',
		borderBottomColor: 'transparent',
		borderLeftColor: 'blueviolet',
		marginLeft: 2,
	},
	stop: {
		backgroundColor: 'blueviolet',
	},
});
