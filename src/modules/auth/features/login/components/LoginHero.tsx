export const LoginHero = () => {
    return (
        <div className="max-w-xl space-y-10">
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-wide text-text-muted">
                            Balance
                        </p>
                        <h4 className="mt-2 text-2xl font-semibold">$65,660</h4>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-wide text-text-muted">
                            Billeteras
                        </p>
                        <h4 className="mt-2 text-2xl font-semibold">5</h4>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-wide text-text-muted">
                            Gasto mes
                        </p>
                        <h4 className="mt-2 text-2xl font-semibold text-red-400">
                            -$8,620
                        </h4>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/8 bg-black/10 p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                        <span className="text-text-muted">
                            Corporate Ops — gasto mensual
                        </span>
                        <span className="font-medium text-text-primary">70%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                        <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-red-500 to-red-400" />
                    </div>
                </div>
            </div>
        </div>
    )
}