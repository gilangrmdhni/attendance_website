import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Header = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <header className="bg-blue-800 text-white p-4 pb-20 relative rounded-b-lg">
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-semibold">Good Morning 🙌</h1>
        <p className="text-lg font-medium">{user.name}</p>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-70px] w-full max-w-xs">
        <div className="bg-white text-black p-4 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-600 mb-2">{user.date}</p>
          <div className="flex justify-center items-center space-x-1 mb-2">
            <span className="bg-gray-100 px-2 py-1 rounded-md">{user.workHourTime.split(':')[0]}</span>
            <span>:</span>
            <span className="bg-gray-100 px-2 py-1 rounded-md">{user.workHourTime.split(':')[1]}</span>
            <span>:</span>
            <span className="bg-gray-100 px-2 py-1 rounded-md">{user.workHourTime.split(':')[2]}</span>
            <span>:</span>
            <span className="bg-gray-100 px-2 py-1 rounded-md">{user.workHourTime.split(':')[3]}</span>
          </div>
          <div className="flex justify-center items-center space-x-1 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 0 0-10 10h2a8 8 0 1 1 16 0h2a10 10 0 0 0-10-10z"/>
            </svg>
            <span className='text-gray-400 '>Work hour time</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
