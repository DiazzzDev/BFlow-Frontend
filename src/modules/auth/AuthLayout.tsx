import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner'


export const AuthLayout = () => {
    return (
        <>
            <Outlet />
            <Toaster />
        </>
    );
}

