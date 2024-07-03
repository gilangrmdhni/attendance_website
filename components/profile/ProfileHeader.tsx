import { useState } from 'react';
import ProfilePopup from './ProfilePopup';

const ProfileHeader = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <header className="bg-blue-800 text-white p-6 rounded-b-3xl text-center">
      <div className="bg-white p-4 rounded-lg flex items-center">
        <img
          src="/images/profile-user.png"
          alt="Profile Picture"
          className="w-16 h-16 rounded-full mr-4 cursor-pointer"
          onClick={togglePopup}
        />
        <div className="text-left">
          <h1 className="text-lg font-semibold text-gray-800">Azil</h1>
          <p className="text-sm text-gray-400">azil.sharukan@Gmail.com</p>
          <p className="text-sm text-gray-400">Senior BackEnd Developer</p>
        </div>
      </div>
      {isPopupVisible && <ProfilePopup onClose={togglePopup} />}
    </header>
  );
};

export default ProfileHeader;
