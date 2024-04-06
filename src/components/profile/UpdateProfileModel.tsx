import { Button } from "@faris/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@faris/components/ui/dialog"
import { Input } from "@faris/components/ui/input"
import { Label } from "@faris/components/ui/label"
import { Pencil } from "lucide-react"
import { useTranslation } from "next-i18next"
import { useToast } from "@faris/components/ui/use-toast"
import { api } from "@faris/utils/api"
import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { updateProfileSchema } from "@faris/server/module/profile/profile.schema"
import { Textarea } from "../ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useState } from "react"
import { Toaster } from "@faris/components/ui/toaster"

interface UpdateProfileDialogProps {
    id: string
    fullName: string
    bio: string | null,
    livingLocation: string | null
    fromLocation: string | null
    status: string | null
}
export function UpdateProfileDialog({ id, bio, livingLocation, fromLocation, status, fullName }: UpdateProfileDialogProps) {
    const { t } = useTranslation()
    const { toast } = useToast()
    const [open,setOpen] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_,setDummy] = useState(0)


    const { register,getValues,setValue,formState:{errors} } = useForm({
        resolver: valibotResolver(updateProfileSchema),
        defaultValues: {
            id,
            bio:bio??null,
            livingLocation:livingLocation??null,
            fromLocation:fromLocation??null,
            status:status??null,
            fullName
        },
    })
    const { mutate } = api.profile.updateProfile.useMutation({
        onSuccess() {
            toast({
                title: t('accountUpdatedSuccessfully'),
                description: t('actionNeedTime')
            })
        },
    })

    const onClickHandler = ()=>{
        mutate(getValues())
        setOpen(false)
    }
    return (
        <>
        <Toaster/>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={()=>setOpen(!open)} variant={'secondary'} className='w-full sm:w-fit gap-x-1 shadow-sm' >
                    <Pencil className='w-3 h-3' />
                    <span>{t('editProfile')}</span>
                </Button>
            </DialogTrigger>
            <DialogContent  className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('editProfile')}</DialogTitle>
                    <DialogDescription>{t('editProfileDescription')}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">{t('fullName')}</Label>
                        <Input {...register('fullName')} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">{t('bio')}</Label>
                        <Textarea {...register('bio')} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">{t('livingLocation')}</Label>
                        <Input {...register('livingLocation')} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">{t('fromLocation')}</Label>
                        <Input {...register('fromLocation')} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">{t('status')}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full" variant="outline">{getValues().status!= null ? getValues().status : t('status')}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={()=>{setDummy(prevs=>prevs+1);setValue('status','single')}}>
                                        <span>{t('single')}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=>{setDummy(prevs=>prevs+1);setValue('status','married')}}>
                                    <span>{t('married')}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={Object.keys(errors).length>0} onClick={onClickHandler} type="submit">{t('confirm')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}
