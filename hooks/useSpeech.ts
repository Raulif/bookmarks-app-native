import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { fetchArticle } from '@/lib/fetchArticle';
import { SpeechManager } from '@/lib/SpeechManager';
import playerStore from '@/store/playerStateStore';
import { Bookmark } from '@/types/bookmark';
import { useBookmarks } from './useBookmarks';

export const useSpeech = () => {
	const { bookmarks } = useBookmarks();
	const playerState = useStore(playerStore, (state) => state);
	const speech = useRef<SpeechManager | null>(null);
	const [abortController, setAbortController] =
		useState<AbortController | null>(new AbortController());

	const stop = useCallback(() => {
		if (speech.current?.stop) {
			speech.current?.stop();
		}
	}, []);

	const getArticle = useCallback(
		async (id: string, title: string) => {
			const isSpeaking = await speech.current?.isSpeaking();
			if (isSpeaking) {
				speech.current?.stop();
				speech.current = null;
			}

			playerState.setIsLoading(true, id);
			// Get article URL
			const articleUrl = bookmarks.find((bm) => bm.id === id)?.url;
			if (!articleUrl) {
				console.error('No url found to play');
				playerState.resetState();
				return null;
			}
			// Get article text
			const articleText = await fetchArticle(
				articleUrl,
				abortController?.signal as AbortSignal,
			);

			if (!articleText) {
				console.error('No article text found');
				playerState.resetState();
				return null;
			}

			setAbortController(new AbortController());
			playerState.setCurrentTitle(title);
			playerState.setArticle(articleText);
			playerState.setCurrentId(id);
		},
		[abortController, bookmarks, playerState],
	);

	const cancel = useCallback(async () => {
		if (playerState.isLoading) {
			abortController?.abort('Cancel fetching article with Abort Controller.');
			setAbortController(new AbortController());
			playerState.resetState();
		}

		if (await speech.current?.isSpeaking()) {
			stop();
		}
	}, [abortController, playerState, stop]);

	const playNext = useCallback(() => {
		if (!playerState.currentId || !bookmarks?.length) return;
		const currentIndex = bookmarks.findIndex(
			(bm) => bm.id === playerState.currentId,
		);
		const nextBookmark = bookmarks.at(currentIndex + 1) as Bookmark;
		getArticle(nextBookmark.id, nextBookmark.title);
	}, [playerState.currentId, bookmarks, getArticle]);

	const onPlayCallback = useCallback(() => {
		playerState.onPlay();
		playerState.setArticle('');
	}, [playerState]);

	const onStopCallback = useCallback(() => {
		playerState.setArticle('');
		playerState.onStop();
		speech.current = null;
	}, [playerState]);

	const createSpeechManager = useCallback(() => {
		const speechManager = new SpeechManager({
			onEnd: playNext,
			onPlay: onPlayCallback,
			onStop: onStopCallback,
		});
		speech.current = speechManager;
		return speechManager;
	}, [playNext, onPlayCallback, onStopCallback]);

	useEffect(() => {
		if (playerState.text && !playerState.isPlaying) {
			const speech = createSpeechManager();
			speech.speak(playerState.text);
		}
	}, [playerState.isPlaying, playerState.text, createSpeechManager]);

	return {
		getArticle,
		stop,
		cancel,
	};
};
