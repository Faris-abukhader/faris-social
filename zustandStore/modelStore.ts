import { create } from "zustand"

type EventModel<DataType> = {
    show: boolean,
    data:DataType|undefined
    setShow: (show: boolean,data?:DataType) => void
}

export const modelStoreGenerator = <T>()=> create<EventModel<T>>((set) => ({
    show: false,
    data:undefined,
    setShow(show,data) {
        set({ show,data:show?data:undefined })
    },
}))