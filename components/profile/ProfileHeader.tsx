import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AppDispatch, RootState } from '../../store/store';
import ProfilePopup from './ProfilePopup';
import { fetchUser, updateUserPicture } from '../../store/slices/userSlice';
import { fetchLeaveAllowance } from '@/store/slices/timeOffSlice';

const ProfileHeader = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, error } = useSelector((state: RootState) => state.user);
  const { token } = useSelector((state: RootState) => state.auth);
  const [profilePictureUrl, setProfilePictureUrl] = useState('/icons/userEdit.png');
  const leaveAllowance = useSelector((state: RootState) => state.timeOff.leaveAllowance);


  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
    dispatch(fetchLeaveAllowance());
  }, [dispatch, token]);

  useEffect(() => {
    // Ensure client-side rendering only after mount
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user?.picture) {
      setProfilePictureUrl(`https://api.attendance.nuncorp.id${user.picture}?timestamp=${Date.now()}`);
    }
  }, [user]);


  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newPictureUrl = URL.createObjectURL(event.target.files[0]);
      setProfilePictureUrl(newPictureUrl); // Set URL lokal

      // Update gambar di API
      dispatch(updateUserPicture(event.target.files[0])).then((action) => {
        if (updateUserPicture.fulfilled.match(action)) {
          // Jika berhasil, kita bisa refetch user untuk mendapatkan data terbaru
          dispatch(fetchUser());
        } else {
          // Jika gagal, kita dapat mengembalikan URL yang sudah ada jika perlu
          console.error(action.payload);
        }
      });
      setIsPopupVisible(false);
    }
  };

  const handleLoginRedirect = () => {
    if (!token) {
      router.push('/login');
    }
  };
  const handleNotificationClick = () => {
    router.push('/Notifications');
  };

  // Wait until the component is mounted to render client-side content
  if (!isMounted) {
    return null; // Avoid rendering on the server
  }

  return (
    <header className="bg-primary-blue text-white p-6 relative bg-[url('/images/header.png')] bg-cover bg-center rounded-b-3xl text-center">
      <div className='flex justify-between items-center p-1'>
        <span className='font-bold text-2xl'>Profil</span>
        <Image
          src="/icons/notification.png"
          alt="Notification Icon"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={handleNotificationClick}
        />
      </div>
      <div className="bg-white p-4 rounded-lg flex items-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 cursor-pointer">
          <Image
            src={profilePictureUrl}
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onClick={token ? togglePopup : handleLoginRedirect}
          />
        </div>
        <div className="text-left cursor-pointer" onClick={handleLoginRedirect}>
          <h1 className="text-lg font-semibold text-gray-800">
            {token && user ? user?.full_name : 'Silahkan login'}
          </h1>
          <p className="text-sm text-gray-400">
            {token && user ? user?.email : ''}
          </p>
          <p className="text-sm text-gray-400">
            {user?.position ? String(user.position) : 'N/A'}
          </p>
          <p className="text-sm text-gray-400">
            Total Cuti Anda: {leaveAllowance} Hari
          </p>
        </div>
      </div>
      {isPopupVisible && token && <ProfilePopup onClose={togglePopup} onFileChange={handleFileChange} />}
      {error && <p className="text-red-500">{error}</p>}
    </header>
  );
};

export default ProfileHeader;