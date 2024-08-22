// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';

// const Header = () => {
//   const checkinData = useSelector((state: RootState) => state.checkin.data);
//   const [elapsedTime, setElapsedTime] = useState<number>(0); // Waktu berlalu dalam detik
//   const user = useSelector((state: RootState) => state.auth.user);

//   // Extract checkin_at from checkinData
//   const checkinAt = checkinData?.checkin_at;

//   useEffect(() => {
//     if (checkinAt) {
//       console.log("Checkin At:", checkinAt); // Tambahkan log ini
//       const checkinDate = new Date(checkinAt);
  
//       const interval = setInterval(() => {
//         const now = new Date();
//         const diff = now.getTime() - checkinDate.getTime();
//         console.log("Difference in milliseconds:", diff); 
//         const seconds = Math.floor(diff / 1000) % 60;
//         const minutes = Math.floor(diff / 60000) % 60;
//         const hours = Math.floor(diff / 3600000) % 24;
//         const days = Math.floor(diff / 86400000);
  
//         setElapsedTime(days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds);
//       }, 1000);
  
//       return () => clearInterval(interval);
//     }
//   }, [checkinAt]);  

//   const formatTime = (seconds: number) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
//   };

//   const handleCheckout = () => {
//     // Kirim data checkout ke server
//     const checkoutAt = new Date().toISOString();
//     const message = "Saya Pamit"; // Misalnya, ini bisa menjadi pesan checkout yang dikirim ke API

//     // Kirim data checkout ke API (implementasikan sesuai kebutuhan)
//     console.log("Checking out...");
//     console.log("Checkout message:", message);
//     console.log("Checkout time:", checkoutAt);
//     console.log("Elapsed time:", elapsedTime);
//   };

//   return (
//     <header className="bg-primary-blue text-white p-8 pb-20 relative rounded-b-lg">
//       <div className="flex flex-col items-start">
//         <h1 className="text-xl font-semibold">Good Morning 🙌</h1>
//         <p className="text-lg font-medium">{user?.full_name}</p>
//       </div>
//       <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-70px] w-full max-w-80">
//         <div className="bg-white text-black p-4 rounded-lg shadow-md text-center">
//           <p className="text-sm text-gray-600 mb-2">{new Date().toLocaleDateString()}</p>
//           <div className="flex justify-center items-center space-x-1 mb-2">
//             {checkinAt ? (
//               <span className="bg-gray-100 px-2 py-1 rounded-md">{formatTime(elapsedTime)}</span>
//             ) : (
//               <span className="bg-gray-100 px-2 py-1 rounded-md">00:00:00</span>
//             )}
//           </div>
//           <div className="flex justify-center items-center space-x-1 text-gray-400 text-sm">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M12 2a10 10 0 0 0-10 10h2a8 8 0 1 1 16 0h2a10 10 0 0 0-10-10z"/>
//             </svg>
//             <span className='text-gray-400'>Work hour time</span>
//           </div>
//           {checkinAt && (
//             <button
//               onClick={handleCheckout}
//               className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
//             >
//               Checkout
//             </button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
