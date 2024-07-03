import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around py-2 max-w-sm w-full mx-auto">
      <Link href="/" legacyBehavior>
        <a className={`flex flex-col items-center ${router.pathname === '/' ? 'text-blue-800' : 'text-gray-400'}`}>
          <img
            src="/icons/home.png"
            alt="Home"
            className={`w-6 h-6 mb-1 ${router.pathname === '/' ? 'filter-blue' : 'filter-gray'}`}
          />
          <span className="text-xs">Home</span>
        </a>
      </Link>
      <Link href="/request" legacyBehavior>
        <a className={`flex flex-col items-center ${router.pathname === '/request' ? 'text-blue-800' : 'text-gray-400'}`}>
          <img
            src="/icons/edit.png"
            alt="Request"
            className={`w-6 h-6 mb-1 ${router.pathname === '/request' ? 'filter-blue' : 'filter-gray'}`}
          />
          <span className="text-xs">Request</span>
        </a>
      </Link>
      <Link href="/scan" legacyBehavior>
        <a className={`flex flex-col items-center ${router.pathname === '/scan' ? 'text-blue-800' : 'text-gray-400'}`}>
          <div className="bg-blue-800 p-3 rounded-full">
            <img
              src="/icons/scan.png"
              alt="Scan"
              className={`w-6 h-6 ${router.pathname === '/scan' ? 'filter-blue' : 'filter-gray'}`}
            />
          </div>
        </a>
      </Link>
      <Link href="/history" legacyBehavior>
        <a className={`flex flex-col items-center ${router.pathname === '/history' ? 'text-blue-800' : 'text-gray-400'}`}>
          <img
            src="/icons/menu-board.png"
            alt="History"
            className={`w-6 h-6 mb-1 ${router.pathname === '/history' ? 'filter-blue' : 'filter-gray'}`}
          />
          <span className="text-xs">History</span>
        </a>
      </Link>
      <Link href="/profile" legacyBehavior>
        <a className={`flex flex-col items-center ${router.pathname === '/profile' ? 'text-blue-800' : 'text-gray-400'}`}>
          <img
            src="/icons/user-octagon.png"
            alt="Profile"
            className={`w-6 h-6 mb-1 ${router.pathname === '/profile' ? 'filter-blue' : 'filter-gray'}`}
          />
          <span className="text-xs">Profile</span>
        </a>
      </Link>
    </footer>
  );
};

export default Footer;
