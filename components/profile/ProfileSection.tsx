// components/profile/ProfileSection.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logout } from '../../store/slices/authSlice';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const ProfileSection = ({ title, items }: { title: string; items: any[] }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogoutClick = () => {
    setIsModalVisible(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setIsModalVisible(false);
    router.push('/login');
  };

  const handleCancelLogout = () => {
    setIsModalVisible(false);
  };

  const handleItemClick = (item: any) => {
    if (item.isLogout) {
      handleLogoutClick();
    } else {
      switch (item.name) {
        case 'Personal Information':
          router.push('/personal-information');
          break;
        case 'Employee List':
          router.push('/employees');
          break;
        case 'Privacy Policy':
          router.push('/PrivacyPolicyPage');
          break;
        case 'Terms & Condition':
          router.push('/TermsConditionsPage');
          break;
        case 'Change Password':
          router.push('/ChangePassword');
          break;
        default:
          break;
      }
    }
  };
  return (
    <section className="bg-white p-4 rounded-lg shadow-md mb-4">
      {title && <h2 className="font-semibold mb-2">{title}</h2>}
      <div className="border-t border-gray-200">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <span className="text-gray-700">{item.name}</span>
            <img src={item.isLogout ? "/images/logout.png" : "/images/arrow-circle-right.png"} alt="Icon" className="w-4 h-4" />
          </div>
        ))}
      </div>
      <LogoutConfirmationModal
        isVisible={isModalVisible}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </section>
  );
};

export default ProfileSection;
