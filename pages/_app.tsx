// pages/_app.tsx
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import store, { RootState } from '@/store/store';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <AuthHandler>
                <Component {...pageProps} />
            </AuthHandler>
        </Provider>
    );
}

const AuthHandler = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (!token && router.pathname !== '/login') {
            router.push('/login');
        }
    }, [token, router]);

    return <>{children}</>;
};

export default MyApp;
