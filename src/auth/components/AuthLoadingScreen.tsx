export const AuthLoadingScreen = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-surface-hard">
            <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
                aria-label="Cargando sesión"
                role="status"
            />
        </div>
    );
};
