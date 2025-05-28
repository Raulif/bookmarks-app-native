import { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';

export const useSpeech = () => {
  const [speech, setSpeech] = useState<{
    speak: (typeof Speech)['speak'];
  } | null>(null);
  useEffect(() => {
    const getVoices = async () => {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    };

    const configureSpeech = async () => {
      const voices = await getVoices();
      console.log(voices.filter((v) => v.language === 'en-US'));
    };
    configureSpeech();
    const options = {
      voice: 'en-US-language',
    };
    const speaker = {
      speak: (text: string) => Speech.speak(text, options),
    };
    setSpeech(speaker);
  }, []);

  return { speech };
};
