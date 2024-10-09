import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchUser } from '@/store/slices/userSlice';
import axiosInstance from '@/utils/axiosInstance';
import { AppDispatch, RootState } from '../store/store';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Impor ikon mata
import MobileContainer from '@/components/MobileContainer';
import Footer from '@/components/Footer';

const ChangePassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); // State untuk menampilkan/menyembunyikan password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk menampilkan/menyembunyikan confirm password
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const router = useRouter();

  const { user, loading: userLoading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleRequestOtp = async () => {
    if (!user?.email) {
      setMessage('Please update your email before requesting OTP.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/request-otp', { email: user.email });
      setMessage('OTP sent to your email.');
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error requesting OTP:', error);
      setMessage('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put('/auth/change-password', {
        new_password: newPassword,
        confirm_password: confirmPassword,
        otp,
      });
      setMessage('Password changed successfully!');
      setIsPasswordChanged(true);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Failed to change password. Please try again.');
      setIsPasswordChanged(false);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MobileContainer>
      <div className="bg-blue-800 text-white p-4 rounded-b-3xl">
        <div className='flex items-center'>
          <button onClick={() => router.back()} className='mr-4'>
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className='text-2xl font-bold'>Ubah Kata Sandi</h1>
        </div>
      </div>
      <div className="p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {user?.email ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="border rounded-md px-3 py-2 w-full"
                />
              </div>
              {isOtpSent && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                  </button>
                </div>
              </div>
              <button
                onClick={isOtpSent ? handleChangePassword : handleRequestOtp}
                disabled={loading}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md ${loading ? 'opacity-50' : ''}`}
              >
                {isOtpSent ? 'Change Password' : 'Send OTP'}
              </button>
            </>
          ) : (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md flex items-center">
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m0 0V8h.01M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tidak ada alamat email yang ditemukan. Harap perbarui profil Anda untuk menyertakan alamat email.</span>
            </div>
          )}
          {/* Pesan sukses atau error */}
          {message && (
            <p className={`mt-4 text-${isPasswordChanged ? 'green' : 'red'}-500`}>{message}</p>
          )}
        </div>
      </div>
      <Footer />
    </MobileContainer>
  );
};

export default ChangePassword;
