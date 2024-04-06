import {create} from 'zustand';

type UrlHistoryStore = {
  url: string | null;
  setUrl: (newUrl: string) => void;
};

export const useUrlHistoryStore = create<UrlHistoryStore>((set) => ({
  url: null,
  setUrl: (newUrl) => {
    set({ url: newUrl });
  },
}));
