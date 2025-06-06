import { create } from 'zustand';

interface Store {
  isPlaying: boolean;
  currentId: string;
  isLoading: boolean;
  setCurrentId: (id: string) => void;
  setIsLoading: (isLoading: boolean, id: string) => void;
  resetState: () => void;
  onPlay: () => void;
  onStop: () => void;
  text: string;
  setArticle: (text: string) => void;
  loadingId: string;
  currentTitle: string;
  setCurrentTitle: (currentTitle: string) => void;
}

const playerStore = create<Store>()((set, get) => ({
  isPlaying: false,
  currentId: '',
  isLoading: false,
  text: '',
  loadingId: '',
  currentTitle: '',
  setCurrentId: (id) => set({ currentId: id }),
  setIsLoading: (isLoading, loadingId) => set({ isLoading, loadingId }),
  resetState: () =>
    set({
      isPlaying: false,
      isLoading: false,
      currentId: '',
      text: '',
      loadingId: '',
      currentTitle: '',
    }),
  onPlay: () =>
    set({
      isLoading: false,
      isPlaying: true,
      loadingId: '',
    }),
  onStop: () =>
    set({ currentId: '', isPlaying: false, text: '', currentTitle: '' }),
  setArticle: (text) => set({ text }),
  setCurrentTitle: (currentTitle) => set({ currentTitle }),
}));

export default playerStore;
