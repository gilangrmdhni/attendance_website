import Footer from '../components/Footer';
import Header from '../components/Header';
import MobileContainer from '../components/MobileContainer';
import News from '../components/news';
import withAuth from '../components/withAuth';
import MainContent from '@/components/MainContent';
import { useState, useEffect } from 'react';

const Home = () => {
    const [showLocationPopup, setShowLocationPopup] = useState(false);

    useEffect(() => {
        // Cek status izin lokasi
        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'denied' || result.state === 'prompt') {
                    setShowLocationPopup(true); // Tampilkan popup jika izin belum diberikan
                }
            }).catch((error) => {
                console.error("Error checking geolocation permission: ", error);
            });
        }
    }, []);

    const handleOpenSettings = () => {
        alert("Silakan buka pengaturan browser Anda untuk mengizinkan akses lokasi. Biasanya ada di Pengaturan > Privasi & Keamanan.");
    };

    const handleClosePopup = () => {
        setShowLocationPopup(false); // Menutup popup
    };

    return (
        <div className="relative">
            <MobileContainer>
                <Header />
                <main className="px-4 py-16">
                    <div className='pt-16'>
                        <MainContent />
                    </div>
                    <div className='pb-4'>
                        <News />
                    </div>
                </main>
                <Footer />
            </MobileContainer>

            {/* Popup untuk mengaktifkan lokasi */}
            {showLocationPopup && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="relative bg-white p-6 rounded shadow-lg">
                        {/* Tombol X untuk menutup popup */}
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                        >
                            &#10005; {/* Simbol X */}
                        </button>

                        <h2 className="text-lg font-semibold">Aktifkan Lokasi</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Aplikasi ini membutuhkan akses ke lokasi Anda. Silakan aktifkan layanan lokasi.
                        </p>
                        <div className="flex mt-4">
                            <button
                                onClick={handleOpenSettings}
                                className="bg-primary-blue text-white py-2 px-4 rounded"
                            >
                                Periksa Pengaturan Browser
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAuth(Home);
