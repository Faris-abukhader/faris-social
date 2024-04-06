import { create } from 'zustand'

type Detection = {
    isMobile:boolean,
    setIsMobile:(isMobile:boolean|undefined)=>void
}

const useMobileDetection = create<Detection>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile) => {
    if(!!isMobile) set((_) => ({ isMobile:isMobile }))
  }
}))

export default useMobileDetection;