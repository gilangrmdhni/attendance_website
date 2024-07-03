import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Header = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <header className="bg-blue-500 text-white p-4 rounded-b-xl">
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-semibold">Good Morning 🙌</h1>
        <p className="text-lg font-medium">{user.name}</p>
      </div>
      <div className="mt-4 bg-white text-black p-4 rounded-lg shadow-md w-full max-w-xs mx-auto text-center">
        <p className="text-sm">{user.date}</p>
        <div className="flex justify-center items-center space-x-2">
          <span className="text-lg font-semibold">{user.workHourTime}</span>
        </div>
        <p className="text-sm">Work hour time</p>
      </div>
    </header>
  );
};

export default Header;
