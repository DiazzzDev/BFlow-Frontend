import { Plus } from "lucide-react";
import { useRef } from "react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../../../../../components/ui/field";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Textarea } from "../../../../../components/ui/textarea";
import { NativeSelect, NativeSelectOption } from "../../../../../components/ui/native-select";
import { WalletCreationPayload } from "../wallet.store.ts";

interface CreateWalletDialogProps {
    isShowBtn: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    createWallet: (walletData: WalletCreationPayload) => void;
}

export const CreateWalletDialog = ({ isShowBtn, open, onOpenChange, createWallet }: CreateWalletDialogProps) => {
    const walletNameRef = useRef<HTMLInputElement>(null);
    const walletDescriptionRef = useRef<HTMLTextAreaElement>(null);
    const walletCurrencyRef = useRef<HTMLSelectElement>(null);
    const walletInitialValueRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        createWallet({
            name: walletNameRef.current?.value || '',
            description: walletDescriptionRef.current?.value || '',
            currency: walletCurrencyRef.current?.value || '',
            initialValue: Number(walletInitialValueRef.current?.value) || 0
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
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="walletName">Nombre de la billetera</FieldLabel>
                            <Input id="walletName" placeholder="Ingrese el nombre de la billetera" ref={walletNameRef} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="walletDescription">Descripción</FieldLabel>
                            <Textarea id="walletDescription" placeholder="Ingrese la descripción de la billetera" ref={walletDescriptionRef} />
                        </Field>
                        <div className="flex gap-2">
                            <Field>
                                <FieldLabel htmlFor="walletCurrency">Moneda</FieldLabel>
                                <NativeSelect id="walletCurrency" ref={walletCurrencyRef}>
                                    <NativeSelectOption value="USD">USD</NativeSelectOption>
                                    <NativeSelectOption value="EUR">EUR</NativeSelectOption>
                                </NativeSelect>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="walletInitialValue" className="text-[var(--text-primary)]">Balance inicial</FieldLabel>
                                <Input id="walletInitialValue" placeholder="$0.00" ref={walletInitialValueRef} />
                            </Field>
                        </div>
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <Button type="submit">Guardar billetera</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
};
