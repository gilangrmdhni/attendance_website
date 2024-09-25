import Head from 'next/head';
import Footer from '../../components/Footer';
import MobileContainer from '../../components/MobileContainer';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileSection from '../../components/profile/ProfileSection';

const generalInformationItems = [
  { name: "Employee List" },
  { name: "Personal Information" },
];

const settingItems = [
  { name: "Change Password" },
  { name: "Notification" },
];

const aboutItems = [
  { name: "Privacy Policy" },
  { name: "Terms & Condition" },
];

const logoutItem = [
  { name: "LogOut", isLogout: true },
];

const Profile = () => {
  return (
    <MobileContainer>
      <Head>
        <title>NUN | Profile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ProfileHeader />
      <main className="px-4 py-4">
        <div className='mb-20'>
          <ProfileSection title="General Information" items={generalInformationItems} />
          <ProfileSection title="Setting" items={settingItems} />
          <ProfileSection title="About" items={aboutItems} />
          <ProfileSection title="" items={logoutItem} />
        </div>
      </main>
      <Footer />
    </MobileContainer>
  );
};

export default Profile;
