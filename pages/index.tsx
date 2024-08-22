import Head from 'next/head';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MobileContainer from '../components/MobileContainer';
import News from '../components/news';
import withAuth from '../components/withAuth';
import MainContent from '@/components/MainContent';


const Home = () => {
    return (
        <div className="relative">
            <Head>
                <title>Home</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <MobileContainer>
                <Header />
                <main className="px-4 py-16">
                    <div className='pt-16'>
                        <MainContent />
                    </div>
                    <News />
                </main>
                <Footer />
            </MobileContainer>
        </div>
    );
};

export default withAuth(Home);
