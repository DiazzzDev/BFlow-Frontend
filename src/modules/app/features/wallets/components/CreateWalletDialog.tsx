import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../../../../../components/ui/field";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Textarea } from "../../../../../components/ui/textarea";
import { NativeSelect, NativeSelectOption } from "../../../../../components/ui/native-select";
import { CreateWalletData } from "../interfaces/Wallets";

interface CreateWalletDialogProps {
    isShowBtn: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateWallet: (walletData: CreateWalletData, options?: { onSuccess?: () => void; onError?: () => void }) => void;
    isCreating?: boolean;
}

export const CreateWalletDialog = ({ isShowBtn, open, onOpenChange, onCreateWallet, isCreating }: CreateWalletDialogProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm<CreateWalletData>({ mode: 'onSubmit' });

    const onInternalSubmit = (data: CreateWalletData) => {
        onCreateWallet(data, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {isShowBtn && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4" />
                        Crear billetera
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nueva billetera</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onInternalSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="walletName">Nombre de la billetera</FieldLabel>
                            <Input id="walletName" placeholder="Ingrese el nombre de la billetera" {...register("name", { required: true })} />
                            {isSubmitted && errors.name && (
                                <p className="text-sm text-warning mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="walletDescription">Descripción</FieldLabel>
                            <Textarea id="walletDescription" placeholder="Ingrese la descripción de la billetera" {...register("description")} />
                            {isSubmitted && errors.description && (
                                <p className="text-sm text-warning mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </Field>
                        <div className="flex gap-2">
                            <Field>
                                <FieldLabel htmlFor="walletCurrency">Moneda</FieldLabel>
                                <NativeSelect id="walletCurrency" {...register("currency", { required: true })}>
                                    <NativeSelectOption value="USD">USD</NativeSelectOption>
                                    <NativeSelectOption value="EUR">EUR</NativeSelectOption>
                                </NativeSelect>
                                {isSubmitted && errors.currency && (
                                    <p className="text-sm text-warning mt-1">
                                        {errors.currency.message}
                                    </p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="walletInitialValue" className="text-foreground">Balance inicial</FieldLabel>
                                <Input id="walletInitialValue" placeholder="$0.00" {...register("initialValue", { required: true })} />
                                {isSubmitted && errors.initialValue && (
                                    <p className="text-sm text-warning mt-1">
                                        {errors.initialValue.message}
                                    </p>
                                )}
                            </Field>
                        </div>
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? "Creando billetera..." : "Guardar billetera"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
};

