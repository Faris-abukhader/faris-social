import { create } from 'zustand'

type OffCanva = {
    open:boolean,
    setOpen:(open:boolean)=>void,
    openFunc:()=>void,
    toggle:()=>void
}

const useOffcanva = create<OffCanva>((set) => ({
  open: false,
  setOpen(open) {
      set({open})
  },
  toggle() {
    set((state) => ({ open: !state.open }))
},
  openFunc() {
    set(()=>({open:true}))
  },
}))

export default useOffcanva;