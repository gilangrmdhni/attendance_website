import Head from 'next/head';
import Footer from '../../components/Footer';
import MobileContainer from '../../components/MobileContainer';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileSection from '../../components/profile/ProfileSection';

const generalInformationItems = [
  { name: "Daftar Karyawan" },
  { name: "Informasi Pribadi" },
];

const settingItems = [
  { name: "Ubah Kata Sandi" },
  { name: "Notifikasi" },
];

const aboutItems = [
  { name: "Kebijakan Privasi" },
  { name: "Syarat & Ketentuan" },
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
          <ProfileSection title="Informasi Umum" items={generalInformationItems} />
          <ProfileSection title="Pengaturan" items={settingItems} />
          <ProfileSection title="Tentang" items={aboutItems} />
          <ProfileSection title="" items={logoutItem} />
        </div>
      </main>
      <Footer />
    </MobileContainer>
  );
};

export default Profile;
