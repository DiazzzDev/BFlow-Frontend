interface Props {
    children: React.ReactNode;
}

export const AuthProvider = ({
    children,
}: Props) => {
    return <>{children}</>;
};