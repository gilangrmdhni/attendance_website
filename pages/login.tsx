import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login } from '../store/slices/authSlice';
import MobileContainer from '@/components/MobileContainer';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, token } = useSelector((state: RootState) => state.auth);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        if (token) {
            router.push('/');
        }
    }, [token, router]);



    const handleLogin = async () => {
        if (!username || !password) {
            setError("Username and password are required");
            return;
        }

        const loginData = { username, password };

        try {
            await dispatch(login(loginData)).unwrap();
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return 'Good Morning 👋';
        } else if (currentHour < 18) {
            return 'Good Afternoon 😊';
        } else {
            return 'Good Evening 🌙';
        }

        setGreeting(getGreeting());
    };

    return (
        <MobileContainer>
            <div className="flex flex-col items-center justify-center bg-white">
                <Head>
                    <title>Login</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-orange-500" style={{ height: '450px' }}>
                        {/* Logo di kanan atas */}
                        <div className="absolute top-2 right-2">
                            <img src="/icons/logoNUN.png" alt="Logo" className="w-20 h-20 object-contain" />
                        </div>

                        {/* Background Image */}
                        <div className="absolute inset-0 bg-no-repeat bg-cover" style={{ backgroundImage: "url('/images/bgLogin.png')" }}></div>

                        {/* Gambar Baru di Kiri Bawah */}
                        <div className="absolute bottom-4 left-4">
                            <img src="/images/iconNun.png" alt="New Image" className="w-25 h-25 object-fill" />
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6 py-10">
                        <p className="text-gray-700 text-sm mb-1">{greeting}</p>
                        <h1 className="text-xl font-semibold mb-4">Selamat Datang Kembali, Masuk untuk Melanjutkan aktivitas Anda!</h1>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <label htmlFor="identifier" className="block text-gray-600 font-medium mb-1">Email atau Username</label>
                        <input
                            id="identifier"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your Email or Username"
                            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />

                        <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password"
                            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />

                        <button
                            onClick={handleLogin}
                            className={`w-full py-2 bg-orange-500 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </MobileContainer>
    );
};

export default Login;
