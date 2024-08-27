// components/news/index.tsx
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAnnouncements } from '../../store/slices/announcementSlice';
import Image from 'next/image';

const News: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const announcements = useSelector((state: RootState) => state.announcements.announcements);
  const status = useSelector((state: RootState) => state.announcements.status);
  const error = useSelector((state: RootState) => state.announcements.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAnnouncements());
    }
  }, [status, dispatch]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = announcements.map((announcement) => {
      // Gabungkan base URL dengan path gambar
      const imageUrl = `https://api.attendance.nuncorp.id${announcement.picture}`;
      return (
        <Link key={announcement.id} href={`/news/${announcement.id}`}>
          <div className="flex items-center border-b pb-2 cursor-pointer">
            <Image
              src={imageUrl}
              alt={announcement.title}
              width={64}
              height={64} 
              className="w-16 h-16 rounded-md mr-4"
            />
            <div>
              <p className="text-sm text-gray-500">{formatDate(announcement.dates)}</p>
              <p className="font-semibold">{announcement.title}</p>
              <p className="text-sm text-gray-600">{announcement.description}</p>
            </div>
          </div>
        </Link>
      );
    });
  } else if (status === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Announcement</h2>
        <a href="#" className="text-primary-blue text-xs">See All</a>
      </div>
      <div className="space-y-4">
        {content}
      </div>
    </section>
  );
};

export default News;
