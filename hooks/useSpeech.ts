import { useCallback, useEffect, useRef, useState } from 'react';
import { SpeechManager } from '@/lib/SpeechManager';
import { useBookmarks } from './useBookmarks';
import { getArticle } from '@/lib/getArticle';
import { Bookmark } from '@/types/bookmark';

export const useSpeech = () => {
  const { bookmarks } = useBookmarks();
  const speech = useRef<SpeechManager | null>(null);
  const currentId = useRef('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const getArticleText = async (id: string) => {
    const url = bookmarks.find((bm) => bm.id === id)?.url;
    if (!url) {
      console.error('No url found to play');
      stop();
      return null;
    }
    const text = await getArticle(url, abortController?.signal as AbortSignal);
    if (!text) {
      console.error('No article text found');
      stop();
      return null;
    }
    return text;
  };

  const speak = async (id: string) => {
    setLoading(true);
    setAbortController(new AbortController());
    currentId.current = id;
    try {
      const text = await getArticleText(id);
      if (!text) return;
      speech.current?.speak(text);
      setLoading(false);
    } catch (e) {
      console.error('Error on hear click: ', e);
      currentId.current = '';
      setLoading(false);
    }
  };

  const stop = () => {
    speech.current?.stop();
    currentId.current = '';
  };

  const pause = () => {
    speech.current?.pause();
  };

  const resume = () => {
    speech.current?.resume();
  };

  const abortLoading = useCallback(async () => {
    abortController?.abort('Cancel fetching article with Abort Controller.');
    setLoading(false);
    setAbortController(new AbortController());
    currentId.current = '';
    if (await speech.current?.isSpeaking()) {
      speech.current?.stop();
      setIsSpeaking(false);
    }
  }, [abortController]);

  const playNextItem = useCallback(() => {
    if (!currentId.current || !bookmarks?.length) return;
    const currentIndex = bookmarks.findIndex(
      (bm) => bm.id === currentId.current
    );
    const nextBookmark = bookmarks.at(currentIndex + 1) as Bookmark;
    speak(nextBookmark.id);
  }, [currentId.current, bookmarks, speak]);

  useEffect(() => {
    if (!speech?.current && !!bookmarks?.length) {
      const speechManager = new SpeechManager({
        onEnd: playNextItem,
        onPlay: () => setIsSpeaking(true),
        onStop: () => setIsSpeaking(false),
      });
      speech.current = speechManager;
    }
  }, [SpeechManager, speech.current, playNextItem, bookmarks]);

  return {
    speak,
    loading,
    isSpeaking,
    stop,
    pause,
    resume,
    currentId: currentId.current,
    abortLoading,
  };
};
