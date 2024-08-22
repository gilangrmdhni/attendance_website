import Head from 'next/head';
import Footer from '../../components/Footer';
import MobileContainer from '../../components/MobileContainer';
import RequestHeader from '../../components/request/RequestHeader';

const RequestIndex = () => {
    return (
        <MobileContainer>
            <Head>
                <title>Request</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            
            <RequestHeader />
            
            <main className="pt-4">
                <div className="text-center">Pilih menu di atas untuk melihat form.</div>
            </main>

            <Footer />
        </MobileContainer>
    );
};

export default RequestIndex;
