import { useCallback, useEffect, useRef, useState } from 'react';
import { SpeechManager } from '@/lib/SpeechManager';
import { useBookmarks } from './useBookmarks';
import { getArticle } from '@/lib/getArticle';
import { Bookmark } from '@/types/bookmark';

export const useSpeech = () => {
  const { bookmarks } = useBookmarks();
  const [speech, setSpeech] = useState<SpeechManager | null>(null);
  const currentId = useRef('');
  const [gettingText, setGettingText] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const playNextItem = useCallback(() => {
    if (!currentId.current || !bookmarks.length) return;
    console.log('play next item', currentId.current);
    const currentIndex = bookmarks.findIndex(
      (bm) => bm.id === currentId.current
    );
    const nextBookmark = bookmarks.at(currentIndex + 1) as Bookmark;
    speak(nextBookmark.id);
  }, [currentId.current, bookmarks]);

  useEffect(() => {
    if (!speech) {
      const speechManager = new SpeechManager({
        onEnd: playNextItem,
        onPlay: () => setIsSpeaking(true),
        onStop: () => setIsSpeaking(false),
      });
      setSpeech(speechManager);
    }
  }, [SpeechManager, speech]);

  const getArticleText = async (id: string) => {
    const url = bookmarks.find((bm) => bm.id === id)?.url;
    if (!url) {
      setGettingText(false);
      throw Error('No url found to play');
    }
    const text = await getArticle(url, abortController?.signal as AbortSignal);
    if (!text) {
      throw Error('No article text found');
    }
    setGettingText(false);
    return text;
  };

  const speak = useCallback(
    async (id: string) => {
      setAbortController(new AbortController());
      setGettingText(true);
      currentId.current = id;
      try {
        const text = await getArticleText(id);

        speech?.speak(text);
      } catch (e) {
        console.error('Error on hear click: ', e);
        currentId.current = '';
        setGettingText(false);
      }
    },
    [bookmarks, currentId.current]
  );

  const stop = useCallback(() => {
    speech?.stop();
  }, [speech]);

  const pause = useCallback(() => {
    speech?.pause();
  }, [speech]);

  const resume = useCallback(() => {
    speech?.resume();
  }, [speech]);

  const cancelGettingText = useCallback(async () => {
    abortController?.abort('cancel fetching');
    setGettingText(false);
    setAbortController(new AbortController());
    currentId.current = '';
    if (await speech?.isSpeaking()) {
      speech?.stop();
      setIsSpeaking(false);
    }
  }, [abortController, speech]);

  return {
    speak,
    gettingText,
    isSpeaking,
    stop,
    pause,
    resume,
    currentId: currentId.current,
    cancelGettingText,
  };
};
