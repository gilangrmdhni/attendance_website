import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '../store/store';

const withAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const router = useRouter();
        const token = useSelector((state: RootState) => state.auth.token);
        const [isClient, setIsClient] = useState(false);

        useEffect(() => {
            setIsClient(true);
        }, []);

        useEffect(() => {
            if (isClient && !token) {
                router.push('/login');
            }
        }, [token, router, isClient]);

        if (!isClient) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
