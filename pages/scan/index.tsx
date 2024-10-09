import Head from 'next/head';
import Footer from '../../components/Footer';
import MobileContainer from '../../components/MobileContainer';
import ScanHeader from '../../components/scan/ScanHeader';
import ScanContent from '../../components/scan/ScanContent';

const Scan = () => {
    return (
        <MobileContainer>
            <Head>
                <title>NUN | Kehadiran</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <ScanHeader />
            <main className="pt-20 pb-10">
                <ScanContent />
            </main>
            <Footer />
        </MobileContainer>
    );
};

export default Scan;
