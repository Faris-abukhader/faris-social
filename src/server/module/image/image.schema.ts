import { type Output, object, string } from "valibot";

export const deleteOneImageSchema = object({
    id:string()
})

export type DeleteOneImage = Output<typeof deleteOneImageSchema>
