// features/user/UserComponent.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const UserComponent = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <header className="p-4 bg-blue-600 text-white rounded-b-lg relative">
      <div className="flex flex-col items-start ">
        <h1 className="text-xl font-semibold">Good Morning 🙌</h1>
        <p className="text-lg font-medium">{user.name}</p>
      </div>
      <div className="mt-4 bg-white text-black p-4 rounded-lg shadow-md w-full max-w-xs mx-auto text-center absolute -bottom-12">
        <p className="text-sm">{user.date}</p>
        <div className="flex justify-center items-center space-x-2">
          <span className="text-lg font-semibold">{user.workHourTime}</span>
        </div>
        <p className="text-sm">Work hour time</p>
      </div>
    </header>
  );
};

export default UserComponent;
