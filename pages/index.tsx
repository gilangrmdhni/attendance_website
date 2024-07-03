import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useFetchUserQuery } from '../store/apiSlice';
import { updateUser } from '../features/user/userSlice';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MobileContainer from '../components/MobileContainer';
import Announcement from '../components/Announcement';

export default function Home() {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useFetchUserQuery(1);

  useEffect(() => {
    if (data) {
      dispatch(updateUser({ name: data.name, workHourTime: data.workHourTime, date: data.date }));
    }
  }, [data, error, isLoading, dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="relative">
      <Head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <MobileContainer>
        <Header />
        <main className="px-4 pt-16 pb-20">
          <section className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-center mb-2 text-lg font-semibold">Juni 2024</h2>
            <div className="grid grid-cols-7 gap-2 text-center">
              <span className="text-xs">MNG</span><span className="text-xs">SEN</span><span className="text-xs">SEL</span><span className="text-xs">RAB</span><span className="text-xs">KAM</span><span className="text-xs">JUM</span><span className="text-xs">SAB</span>
              {[...Array(30)].map((_, i) => (
                <span key={i} className={`p-2 text-sm ${i === 23 ? 'bg-blue-500 text-white rounded-full' : ''}`}>{i + 1}</span>
              ))}
            </div>
          </section>
          <Announcement />
        </main>
        <Footer />
      </MobileContainer>
    </div>
  );
}
