import {create} from 'zustand';
type color = 'light' | 'dark';
type ColorSchemaType = {
  colorSchema: color
  setColorSchema: (color: 'light' | 'dark') => void;
  setInitialColorSchema:()=>void
  isInitalize:boolean,
  getColorSchema:()=>color
};

const useColorSchemaStore = create<ColorSchemaType>((set,get) => ({
  colorSchema: 'dark', // Initial color schema state
  isInitalize:false,
  setInitialColorSchema: () => {
    if(!window)return
    const colorStorage = window.localStorage.getItem('color-schema');
    const browserColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialColorSchema = colorStorage?colorStorage:browserColor;
    
    // Use the setColorSchema function to set the color schema
    set({ colorSchema: initialColorSchema as color,isInitalize:true });
  },
  setColorSchema: (newColorSchema) => {
    if (newColorSchema === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      window.localStorage.setItem('color-schema', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('color-schema', 'light');
    }
    document.documentElement.setAttribute('data-color-mode', newColorSchema);
    set({ colorSchema: newColorSchema });
  },
  getColorSchema() {
    if(!get().isInitalize){
      get().setInitialColorSchema()
    }
    return get().colorSchema
  },
}));

export default useColorSchemaStore;
