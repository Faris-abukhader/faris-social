import {create} from 'zustand';

type Localization = {
    language:string,
    setLanguage:(language:string|undefined)=>void
}


const useLocalizationStore = create<Localization>((set) => ({
  language: 'en',
  setLanguage: (lang) => {
    if(lang!=undefined){
      set({ language: lang })
    }
  },
}));

export default useLocalizationStore;
