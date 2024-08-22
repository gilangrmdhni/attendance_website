import { GetServerSideProps, NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchNewsDetail, NewsDetail as NewsDetailType } from '../../store/slices/newsDetailSlice'; 
import { useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

interface NewsDetailProps {
  initialNewsDetail: NewsDetailType | null;
}

const NewsDetail: NextPage<NewsDetailProps> = ({ initialNewsDetail }) => {
  const dispatch: AppDispatch = useDispatch();
  const newsDetail = useSelector((state: RootState) => state.newsDetail.newsDetail);
  const status = useSelector((state: RootState) => state.newsDetail.status);
  const error = useSelector((state: RootState) => state.newsDetail.error);

  useEffect(() => {
    if (initialNewsDetail) {
      dispatch(fetchNewsDetail(initialNewsDetail.id));
    }
  }, [dispatch, initialNewsDetail]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>{error}</p>;
  }

  if (!newsDetail) {
    return <p>News not found</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{newsDetail.title}</h1>
      <p className="text-sm text-gray-500">{formatDate(newsDetail.dates)}</p>
      <img src={newsDetail.picture} alt={newsDetail.title} className="w-full h-auto" />
      <p className="mt-4">{newsDetail.description}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  if (!id || Array.isArray(id)) {
    return {
      notFound: true,
    };
  }

  try {
    const response = await axiosInstance.get(`/news/${id}`);
    const newsDetail = response.data.body;

    if (!newsDetail) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialNewsDetail: newsDetail || null,
      },
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      notFound: true,
    };
  }
};

export default NewsDetail;
