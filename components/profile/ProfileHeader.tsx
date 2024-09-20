import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AppDispatch, RootState } from '../../store/store';
import ProfilePopup from './ProfilePopup';
import { fetchUser, updateUserPicture } from '../../store/slices/userSlice';

const ProfileHeader = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error } = useSelector((state: RootState) => state.user);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      dispatch(updateUserPicture(event.target.files[0])).then(() => {
        dispatch(fetchUser());
      });
      setIsPopupVisible(false);
    }
  };

  const handleLoginRedirect = () => {
    if (!token) {
      router.push('/login');
    }
  };

  if (!isMounted) {
    return null;
  }

  const profilePictureUrl = user?.picture === '/storage/uploads/default.jpg'
    ? '/icons/userEdit.png' 
    : user?.picture
      ? `https://api.attendance.nuncorp.id${user.picture}`
      : '/icons/userEdit.png';


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
            {token ? user?.full_name : 'Silahkan login'}
          </h1>
          <p className="text-sm text-gray-400">
            {token ? user?.email : ''}
          </p>
          <p className="text-sm text-gray-400">
            {user?.position ? String(user.position) : 'N/A'}
          </p>
        </div>
      </div>
      {isPopupVisible && token && <ProfilePopup onClose={togglePopup} onFileChange={handleFileChange} />}
      {error && token && <p className="text-red-500">{error}</p>}
    </header>
  );
};

export default ProfileHeader;
