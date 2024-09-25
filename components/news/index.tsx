import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAnnouncements } from '../../store/slices/announcementSlice';
import Image from 'next/image';
import MobileContainer from '../MobileContainer';

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = announcements.map((announcement) => {
      const imageUrl = `https://api.attendance.nuncorp.id${announcement.picture}`;
      return (
        <Link key={announcement.id} href={`/news/${announcement.id}`}>
          <div className="flex items-center border-b p-2 cursor-pointer">
            <Image
              src={imageUrl}
              alt={announcement.title}
              width={64}
              height={64}
              className="w-16 h-16 rounded-md mr-4"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-500">{formatDate(announcement.created_at)}</p>
              <p className="text-sm font-semibold">{announcement.title}</p>
              <p className="text-sm text-gray-600">{truncateText(announcement.description, 20)}</p> {/* Batasi deskripsi */}
            </div>
          </div>
        </Link>
      );
    });
  } else if (status === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <MobileContainer>
      <section className="bg-white p-4 rounded-lg shadow-md max-w-screen-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Announcement</h2>
          <a href="#" className="text-primary-blue text-xs">See All</a>
        </div>
        <div className="space-y-4">
          {content}
        </div>
      </section>
    </MobileContainer>
  );
};

export default News;
