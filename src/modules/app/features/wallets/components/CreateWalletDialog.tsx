import { useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";

import { CreateWalletData } from "../interfaces/Wallets";

interface CreateWalletDialogProps {
    isShowBtn: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateWallet: (walletData: CreateWalletData, options?: { onSuccess?: () => void; onError?: () => void }) => void;
    isCreating?: boolean;
}

const inputClass =
    "h-10 w-full rounded-lg border border-border bg-card px-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"

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
        <>
            {isShowBtn && (
                <button
                    type="button"
                    onClick={() => onOpenChange(true)}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    Crear billetera
                </button>
            )}

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <button
                        type="button"
                        aria-label="Cerrar"
                        className="absolute inset-0 bg-background/70"
                        onClick={() => onOpenChange(false)}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-custom">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Nueva billetera</h2>
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                void handleSubmit(onInternalSubmit)(e);
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label htmlFor="walletName" className="text-sm font-medium text-label">
                                    Nombre de la billetera
                                </label>
                                <input
                                    id="walletName"
                                    placeholder="Ingrese el nombre de la billetera"
                                    className={inputClass}
                                    {...register("name", { required: true })}
                                />
                                {isSubmitted && errors.name && (
                                    <p className="text-sm text-danger mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="walletDescription" className="text-sm font-medium text-label">
                                    Descripción
                                </label>
                                <textarea
                                    id="walletDescription"
                                    placeholder="Ingrese la descripción de la billetera"
                                    className={`${inputClass} min-h-20 py-2`}
                                    {...register("description")}
                                />
                                {isSubmitted && errors.description && (
                                    <p className="text-sm text-danger mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <div className="space-y-1.5 flex-1">
                                    <label htmlFor="walletCurrency" className="text-sm font-medium text-label">
                                        Moneda
                                    </label>
                                    <select
                                        id="walletCurrency"
                                        className={inputClass}
                                        {...register("currency", { required: true })}
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                    {isSubmitted && errors.currency && (
                                        <p className="text-sm text-danger mt-1">
                                            {errors.currency.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5 flex-1">
                                    <label htmlFor="walletInitialValue" className="text-sm font-medium text-label">
                                        Balance inicial
                                    </label>
                                    <input
                                        id="walletInitialValue"
                                        placeholder="$0.00"
                                        className={inputClass}
                                        {...register("initialValue", { required: true })}
                                    />
                                    {isSubmitted && errors.initialValue && (
                                        <p className="text-sm text-danger mt-1">
                                            {errors.initialValue.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
                                >
                                    {isCreating ? "Creando billetera..." : "Guardar billetera"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
};
