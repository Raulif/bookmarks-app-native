import { useEffect, useRef } from 'react';
import {
	Animated,
	StyleSheet,
	Text,
	useAnimatedValue,
	View,
} from 'react-native';
import { useStore } from 'zustand';
import playerStore from '@/store/playerStateStore';

type DrawerProps = {
	children: React.ReactNode;
};

export const Drawer = ({ children }: DrawerProps) => {
	const playerState = useStore(playerStore, (state) => state);

	const ref = useRef<View>(null);
	let slideAnimation = useAnimatedValue(120);

	const slideIn = () => {
		Animated.timing(slideAnimation, {
			toValue: 0,
			duration: 200,
			useNativeDriver: true,
		}).start();
	};
	const slideOut = () => {
		Animated.timing(slideAnimation, {
			toValue: 1640,
			duration: 200,
			useNativeDriver: true,
		}).start();
	};

	useEffect(() => {
		if (playerState.isPlaying) {
			slideIn();
		} else {
			slideOut();
		}
	}, [playerState.isPlaying]);

	return (
		<Animated.View
			ref={ref}
			style={[
				styles.drawer,
				{
					transform: [
						{
							translateY: slideAnimation,
						},
					],
				},
			]}
		>
			<Text style={[styles.topLine]}>Listening to:</Text>
			<View style={[styles.content]}>
				<Text style={[styles.title]} numberOfLines={2}>
					{playerState.currentTitle}
				</Text>

				{children}
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	drawer: {
		boxShadow: '0px -2px 6px 8px rgba(0,0,0,0.3)',
		position: 'absolute',
		backgroundColor: 'blueviolet',
		bottom: 0,
		width: '100%',
		paddingTop: 24,
		paddingBottom: 48,
		paddingHorizontal: 16,
	},
	content: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: 24,
	},
	title: {
		fontFamily: 'Lora_400Regular',
		color: 'white',
		fontSize: 18,
		flexShrink: 1,
		flex: 1,
	},
	topLine: {
		fontSize: 14,
		fontFamily: 'Lora_400Regular',
		color: 'white',
		marginBottom: 8,
	},
});
