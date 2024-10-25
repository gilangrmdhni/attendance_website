// import React, { useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { submitReimbursementRequest } from '../../store/slices/reimbursementSlice';
// import { AppDispatch } from '../../store/store';
// import { ArrowLeftIcon } from '@heroicons/react/24/outline';
// import router from 'next/router';
// import axios from 'axios';

// interface Attachment {
//   amount: number;
//   attachment: File | null;
// }

// const ReimbursementForm: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const formRef = useRef<HTMLFormElement>(null);
//   const [attachments, setAttachments] = useState<Attachment[]>([]);
//   const [filePreview, setFilePreview] = useState<string | null>(null);
//   const [snackbarMessage, setSnackbarMessage] = useState<string>('');
//   const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'warning'>('success');
//   const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
//   const [isErrorPopupVisible, setIsErrorPopupVisible] = useState<boolean>(false);
//   const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>('');

//   const handleAddAttachment = () => {
//     const emptyFile = new File([], "");
//     setAttachments([...attachments, { amount: 0, attachment: emptyFile }]);
//   };

//   const handleAttachmentChange = (index: number, field: 'amount' | 'attachment', value: any) => {
//     const newAttachments = [...attachments];
//     newAttachments[index][field] = value;
//     setAttachments(newAttachments);
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setSnackbarMessage('File size exceeds the 5MB limit.');
//         setSnackbarType('warning');
//         setSnackbarVisible(true);
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFilePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setFilePreview(null);
//     }
//   };

//   const validateForm = (formData: FormData) => {
//     // Implementasi logika validasi
//     return true; // Ubah sesuai dengan logika validasi yang diinginkan
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);

//     if (!validateForm(formData)) {
//       setSnackbarMessage('Please fill out all required fields.');
//       setSnackbarType('warning');
//       setSnackbarVisible(true);
//       return;
//     }

//     const formattedData = {
//       category_id: parseInt(formData.get('category_id') as string), // Ambil category_id
//       start_date: formData.get('start_date') as string, // Ambil start_date
//       end_date: formData.get('end_date') as string, // Ambil end_date
//       description: formData.get('description') as string, // Ambil description
//       trip: formData.get('trip') as string, // Ambil trip
//       attachments: await Promise.all(attachments.map(async att => ({
//         amount: att.amount,
//         attachment: att.attachment ? await uploadFile(att.attachment) : null,
//       }))),
//     };

//     try {
//       setSnackbarMessage('Submitting data...');
//       setSnackbarType('success');
//       setSnackbarVisible(true);

//       const response = await dispatch(submitReimbursementRequest(formattedData));

//       if (response && response.payload && 'error' in response.payload) {
//         throw new Error(response.payload.error.message || 'Failed to submit data');
//       }

//       setSnackbarMessage('Data submitted successfully!');
//       setSnackbarType('success');
//       setIsSuccessPopupVisible(true);
//     } catch (err: unknown) {
//       console.error('Submission error:', err);
//       let errorMessage = 'Failed to submit data. Please try again.';
//       if (axios.isAxiosError(err)) {
//         errorMessage = err.response?.data?.message || 'Something went wrong';
//       } else if (err instanceof Error) {
//         errorMessage = err.message;
//       }
//       setErrorMessage(errorMessage);
//       setIsErrorPopupVisible(true);
//       setSnackbarMessage(errorMessage);
//       setSnackbarType('error');
//       setSnackbarVisible(true);
//     }
//   };

//   const uploadFile = async (file: File): Promise<string | null> => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('https://api.attendance.nuncorp.id/api/upload-attachment/file', formData);
//       return response.data.path;
//     } catch (error) {
//       console.error('File upload error:', error);
//       return null;
//     }
//   };

//   const closeErrorPopup = () => {
//     setIsErrorPopupVisible(false);
//   };

//   const closeSuccessPopup = () => {
//     setIsSuccessPopupVisible(false);
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <header className="bg-primary-blue text-white p-4 rounded-t-lg">
//         <div className="flex items-start">
//           <button
//             onClick={() => router.back()}
//             className="text-white p-2 rounded-full bg-blue-700 hover:bg-blue-800"
//           >
//             <ArrowLeftIcon className="w-6 h-6" />
//           </button>
//           <h1 className="ml-4 text-xl font-semibold">Form Reimbursement</h1>
//         </div>
//       </header>
//       <form onSubmit={handleSubmit} ref={formRef} className="space-y-4 p-4">
//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-2">Deskripsi</label>
//           <textarea
//             id="description"
//             name="description"
//             rows={4}
//             className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//             placeholder="Tambahkan Keterangan"
//           />
//         </div>

//         {/* Default attachment field */}
//         <div className="mb-4">
//           <h2 className="text-lg font-semibold text-gray-600">Lampiran</h2>
//           <div className="flex items-center space-x-4 mb-2">
//             <input
//               type="number"
//               placeholder="Amount"
//               className="border border-gray-300 rounded-lg p-2 w-1/4"
//               onChange={(e) => handleAttachmentChange(0, 'amount', Number(e.target.value))}
//               required
//             />
//             <input
//               type="file"
//               onChange={(e) => handleAttachmentChange(0, 'attachment', e.target.files?.[0])}
//               className="border border-gray-300 rounded-lg p-2 w-3/4"
//             />
//           </div>
//         </div>

//         {/* Dynamic attachments */}
//         {attachments.map((attachment, index) => (
//           <div key={index} className="flex items-center space-x-4 mb-2">
//             <input
//               type="number"
//               placeholder="Amount"
//               className="border border-gray-300 rounded-lg p-2 w-1/4"
//               value={attachment.amount}
//               onChange={(e) => handleAttachmentChange(index, 'amount', Number(e.target.value))}
//               required
//             />
//             <input
//               type="file"
//               onChange={(e) => handleAttachmentChange(index, 'attachment', e.target.files?.[0])}
//               className="border border-gray-300 rounded-lg p-2 w-3/4"
//             />
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={handleAddAttachment}
//           className="mt-2 text-blue-500"
//         >
//           Tambah Lampiran
//         </button>

//         <button
//           type="submit"
//           className="w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Ajukan
//         </button>
//       </form>
//       {isSuccessPopupVisible && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg">
//             <h2 className="text-lg font-semibold">Sukses!</h2>
//             <p>{snackbarMessage}</p>
//             <button onClick={closeSuccessPopup} className="mt-2 text-blue-500">Tutup</button>
//           </div>
//         </div>
//       )}
//       {isErrorPopupVisible && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg">
//             <h2 className="text-lg font-semibold">Error!</h2>
//             <p>{errorMessage}</p>
//             <button onClick={closeErrorPopup} className="mt-2 text-blue-500">Tutup</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReimbursementForm;
