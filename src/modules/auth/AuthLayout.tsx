import { Outlet } from 'react-router';
import { Toaster } from 'sonner'


export const AuthLayout = () => {
    return (
        <>
            <Outlet />
            <Toaster />
        </>
    );
}

