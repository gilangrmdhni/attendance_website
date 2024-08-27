import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance'; // Import axiosInstance
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Import Heroicons
import MobileContainer from '@/components/MobileContainer';
import Footer from '@/components/Footer';

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/request-otp', { email });
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
      router.push('/login'); // Redirect to login page or other page after success
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileContainer>
      <div className="bg-blue-800 text-white p-4 rounded-b-3xl">
        <div className='flex items-center'>
          <button onClick={() => router.back()} className='mr-4'>
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className='text-2xl font-bold'>Change Password</h1>
        </div>
      </div>
      <div className="p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isOtpSent}
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
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <button
            onClick={isOtpSent ? handleChangePassword : handleRequestOtp}
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${loading ? 'opacity-50' : ''}`}
          >
            {isOtpSent ? 'Change Password' : 'Send OTP'}
          </button>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </div>
      <Footer />
    </MobileContainer>
  );
};

export default ChangePassword;
