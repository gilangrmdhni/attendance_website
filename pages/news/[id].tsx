import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnouncementDetail, reset } from '../../store/slices/announcementDetailSlice';
import { RootState, AppDispatch } from '../../store/store';
import Image from 'next/image';
import MobileContainer from '@/components/MobileContainer';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const NewsDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch: AppDispatch = useDispatch();

  const announcement = useSelector((state: RootState) => state.announcementDetail?.announcement);
  const status = useSelector((state: RootState) => state.announcementDetail?.status);
  const error = useSelector((state: RootState) => state.announcementDetail?.error);

  useEffect(() => {
    if (id) {
      dispatch(reset()); // Reset state when id changes
      dispatch(fetchAnnouncementDetail(Number(id)));
    }
  }, [id, dispatch]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (status === 'loading') {
    return <p className="text-center">Loading...</p>;
  }

  if (status === 'failed') {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!announcement) {
    return <p className="text-center">Announcement not found.</p>;
  }

  const imageUrl = `https://api.attendance.nuncorp.id${announcement.picture}`;

  return (
    <MobileContainer>
      <header className="bg-primary-blue text-white p-6 h-60 rounded-b-3xl relative bg-[url('/images/header.png')] bg-cover bg-center">
        <div className="flex items-center relative z-10">
          <button
            onClick={() => router.back()}
            className="text-white p-2 rounded-full bg-blue-700 hover:bg-blue-800"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="ml-4 text-xl font-semibold">Announcement Details</h1>
        </div>
      </header>
      <div className="bg-white p-4 max-w-screen-sm rounded-xl shadow-md mx-4 -mt-40 mb-8 z-10 relative">
        <div className="mb-4">
          <Image
            src={imageUrl}
            alt={`Image for announcement: ${announcement.title}`}
            width={800}
            height={400}
            className="w-full h-auto rounded-md"
          />
        </div>
        <h1 className="text-2xl font-semibold mb-2">{announcement.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{formatDate(announcement.dates)}</p>
        <p className="text-base text-gray-700">{announcement.description}</p>
      </div>
    </MobileContainer>
  );
};

export default NewsDetail;
