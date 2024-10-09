// pages/personal-information.tsx
import Head from 'next/head';
import Footer from '../../components/Footer';
import MobileContainer from '../../components/MobileContainer';
import PersonalInformation from '../../components/profile/PersonalInformation';

const PersonalInformationPage = () => {
  return (
    <MobileContainer>
      <Head>
        <title>NUN | Informasi Pribadi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <PersonalInformation />
      <Footer />
    </MobileContainer>
  );
};

export default PersonalInformationPage;
