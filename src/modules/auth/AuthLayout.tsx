import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export const AuthLayout = () => {
    return (
        <>
            <Outlet />
            <ToastContainer />
        </>
    );
}

