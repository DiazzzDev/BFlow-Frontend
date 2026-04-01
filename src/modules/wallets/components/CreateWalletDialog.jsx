import { Plus } from "lucide-react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../../../components/ui/field";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export const CreateWalletDialog = ({ isShowBtn, open, onOpenChange }) => {
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
                <form action="">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="walletName">Nombre de la billetera</FieldLabel>
                            <Input id="walletName" placeholder="Ingrese el nombre de la billetera" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="walletDescription">Descripción</FieldLabel>
                            <Textarea id="walletDescription" placeholder="Ingrese la descripción de la billetera" />
                        </Field>
                        <div className="flex gap-2">
                            <Field>
                                <FieldLabel htmlFor="walletCurrency">Moneda</FieldLabel>
                                <Select placeholder="Ingrese la moneda de su billetera" >
                                    <SelectTrigger id="walletCurrency">
                                        <SelectValue placeholder="Selecciona una moneda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="walletInitialValue" className="text-[var(--text-primary)]">Balance inicial</FieldLabel>
                                <Input id="walletInitialValue" placeholder="$0.00" />
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