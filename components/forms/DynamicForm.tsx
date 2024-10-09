import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, submitPermissionRequest } from '../../store/slices/permissionSlice';
import { submitReimbursementRequest } from '../../store/slices/reimbursementSlice';
import { AppDispatch, RootState } from '../../store/store';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import router from 'next/router';
import axios from 'axios';
import { fetchLeaveAllowance, submitTimeOffRequest } from '@/store/slices/timeOffSlice';
import { submitOvertimeRequest } from '@/store/slices/overtimeSlice';

type DynamicFormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'file' | 'date' | 'select';
};

type DynamicFormProps = {
  title: string;
  description?: string;
  fields: DynamicFormField[];
  onSubmit?: (formData: FormData) => void;
};

const DynamicFormWithHeader: React.FC<DynamicFormProps> = ({ title, description, fields, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const { categories, categoriesStatus } = useSelector((state: RootState) => state.permission); // Mengambil state kategori izin
  const leaveAllowance = useSelector((state: RootState) => state.timeOff.leaveAllowance); // Mengambil total cuti

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'warning'>('success');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState<boolean>(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [totalLeave, setTotalLeave] = useState<number | null>(null);


  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
    dispatch(fetchLeaveAllowance());
  }, [dispatch, categoriesStatus]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbarMessage('File size exceeds the 5MB limit.');
        setSnackbarType('warning');
        setSnackbarVisible(true);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const validateForm = (formData: FormData) => {
    const requiredFields = fields.filter(f => f.type !== 'file');
    for (const field of requiredFields) {
      if (!formData.get(field.name)) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (!validateForm(formData)) {
      setSnackbarMessage('Please fill out all required fields.');
      setSnackbarType('warning');
      setSnackbarVisible(true);
      return;
    }

    const formObject: { [key: string]: FormDataEntryValue | undefined } = Object.fromEntries(formData.entries());
    console.log('Data yang akan dikirim:', formObject);

    const dateFields = fields.filter(f => f.type === 'date').map(f => f.name);
    dateFields.forEach((field) => {
      const value = formObject[field];
      if (typeof value === 'string') {
        formObject[field] = formatDate(value as string);
      }
    });

    const categoryPermissionId = Number(formObject['category_permission_id']);

    const formattedData = {
      ...formObject,
      category_permission_id: isNaN(categoryPermissionId) ? 0 : categoryPermissionId, // Jika tidak valid, kirim 0
      attachment: formData.get('attachment') as File,
    };

    try {
      setSnackbarMessage('Submitting data...');
      setSnackbarType('success');
      setSnackbarVisible(true);

      let response;
      if (title.includes('Izin')) {
        response = await dispatch(submitPermissionRequest(formattedData as any));
      } else if (title.includes('Reimbursement')) {
        response = await dispatch(submitReimbursementRequest(formattedData as any));
      } else if (title.includes('Cuti')) {
        response = await dispatch(submitTimeOffRequest(formattedData as any));
      } else if (title.includes('Lembur')) {
        response = await dispatch(submitOvertimeRequest(formattedData as any));
      }

      // Cek jika response ada dan mengandung error
      if (response && response.payload && 'error' in response.payload) {
        throw new Error(response.payload.error.message || 'Failed to submit data');
      }

      // Jika tidak ada error, asumsikan berhasil
      setSnackbarMessage('Data submitted successfully!');
      setSnackbarType('success');
      setIsSuccessPopupVisible(true);
    } catch (err: unknown) {
      console.error('Submission error:', err);

      let errorMessage = 'Failed to submit data. Please try again.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || 'Something went wrong';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setErrorMessage(errorMessage);
      setIsErrorPopupVisible(true);
      setSnackbarMessage(errorMessage);
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      // Pastikan snackbar terlihat setelah proses selesai
      if (snackbarVisible) {
        setSnackbarVisible(true);
      }
    }
  };

  const closeErrorPopup = () => {
    setIsErrorPopupVisible(false);
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupVisible(false);
  };

  return (
    <header className="bg-primary-blue text-white p-4 pb-20 relative bg-[url('/images/header.png')] bg-cover bg-center rounded-b-lg">
      <div className="flex items-start">
        <button
          onClick={() => router.back()}
          className="text-white p-2 rounded-full bg-blue-700 hover:bg-blue-800"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="ml-4 text-xl font-semibold">{title}</h1>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-70px] w-full max-w-xs">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
            {fields.map((field, index) => (
              <div key={index}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder={"Tambahkan Keterangan"}
                  />
                ) : field.type === 'file' ? (
                  <div className="w-full border-2 border-dashed border-blue-300 rounded-lg p-4 text-center text-black">
                    <img src="/icons/upload.png" alt="Camera Icon" className="w-10 h-8 mx-auto mb-2" />
                    <input
                      id={field.name}
                      type="file"
                      name={field.name}
                      className="hidden"
                      accept="*/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor={field.name} className="block text-sm font-medium text-blue-500 cursor-pointer">
                      Upload Bukti foto untuk mengajukan
                    </label>
                    <label htmlFor={field.name} className="block text-xs font-normal text-gray-500 cursor-pointer">
                      Tambahkan bukti untuk mengkonfirmasi
                    </label>
                    {filePreview && (
                      <div className="mt-4">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-full h-auto border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}

                    name={field.name}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'number' ? (
                  <input
                    id={field.name}
                    type="number"
                    name={field.name}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder={"IDR 0"}
                  />
                ) : (
                  <div className="relative">
                    <input
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder={field.label}
                    />
                    {field.type === 'date' && (
                      <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-6 8h6m-8 4h10M5 8h14M5 12h.01M5 16h.01"
                            className="text-black"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </form>
        </div>
        {/* Menampilkan total cuti */}
        <div className='pt-4 flex justify-center'>
          {title.includes('Cuti Form') && leaveAllowance !== null && (
            <div className='w-full bg-primary-blue border border-gray-300 rounded-lg p-3 text-center'>
              <h2>Total Cuti Anda : {leaveAllowance} Hari</h2>
            </div>
          )}
        </div>
        <div className='pt-4 pb-20'>
          <button
            onClick={() => formRef.current?.requestSubmit()}
            className="w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajukan
          </button>
        </div>
      </div>
      {isSuccessPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <div className="mb-4 w-full items-center">
              <img
                src="/icons/eror.png"
                alt="Success Icon"
                className="w-20 h-auto object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-500">Error</h2>
            <p className='text-gray-500'>{errorMessage}</p>
            <button
              onClick={closeSuccessPopup}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isErrorPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md text-center">
            <div className="mb-4 w-full">
              <img
                src="/images/ornamen.png"
                alt="Success Icon"
                className="w-full h-auto object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-500">Success</h2>
            <p className='text-gray-500'>Data submitted successfully!</p>
            <button
              onClick={closeErrorPopup}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DynamicFormWithHeader;