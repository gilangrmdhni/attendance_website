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
import { submitAttendanceUpdateRequest } from '@/store/slices/attendanceUpdateSlice';
import { AiOutlineWarning } from 'react-icons/ai';
import axiosInstance from '@/utils/axiosInstance';


type DynamicFormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'file' | 'date' | 'select' | 'time' | 'overtime';
};

interface Attachment {
  amount: string;
  attachment: string | null;
}

const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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
  const { categories, categoriesStatus } = useSelector((state: RootState) => state.permission);
  const leaveAllowance = useSelector((state: RootState) => state.timeOff.leaveAllowance);
  const [attachments, setAttachments] = useState<Attachment[]>([
    { amount: '', attachment: null },
  ]); const [filePreview, setFilePreview] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState<boolean>(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [totalLeave, setTotalLeave] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
    dispatch(fetchLeaveAllowance());
  }, [dispatch, categoriesStatus]);

  const handleAddAttachment = () => {
    setAttachments([...attachments, { amount: '', attachment: null }]);
  };

  const handleRemoveAttachment = (index: any) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  const handleAttachmentChange = async (index: number, field: string, value: number | File | undefined) => {
    if (field === 'attachment' && value instanceof File) {
      setIsUploading(true);
      const filePath = await uploadFile(value);
      if (filePath) {
        setAttachments((prev) => {
          const updatedAttachments = [...prev];
          updatedAttachments[index] = {
            ...updatedAttachments[index],
            attachment: filePath,
          };
          return updatedAttachments;
        });
      } else {
        // Tampilkan pesan kesalahan kepada pengguna
        console.error('Gagal mengunggah file');
      }
      setIsUploading(false); // Pastikan menonaktifkan status upload
    } else {
      setAttachments((prev) => {
        const updatedAttachments = [...prev];
        updatedAttachments[index] = {
          ...updatedAttachments[index],
          [field]: value,
        };
        return updatedAttachments;
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);  // Menyimpan file yang dipilih ke dalam state
      if (selectedFile.size > 5 * 1024 * 1024) {
        setSnackbarMessage('File size exceeds the 5MB limit.');
        setSnackbarType('warning');
        setSnackbarVisible(true);
        return;
      }
      const reader = new FileReader();
      if (selectedFile.type.startsWith('image/')) {
        // Jika file adalah gambar, tampilkan preview gambar
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Jika file bukan gambar, tampilkan nama file atau ikon
        setFilePreview(null);
        setSnackbarMessage(`File ${selectedFile.name} siap diunggah.`);
        setSnackbarType('info');
        setSnackbarVisible(true);
      }
    } else {
      setFile(null);
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
        console.log(`Field ${field.name} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Validasi form
    if (!validateForm(formData)) {
      setSnackbarMessage('Please fill out all required fields.');
      setSnackbarType('warning');
      setSnackbarVisible(true);
      return;
    }

    const formObject: { [key: string]: FormDataEntryValue | undefined } = Object.fromEntries(formData.entries());
    console.log('Data yang akan dikirim:', formObject);

    // Format fields tanggal
    const dateFields = fields.filter(f => f.type === 'date').map(f => f.name);
    dateFields.forEach((field) => {
      const value = formObject[field];
      if (typeof value === 'string') {
        formObject[field] = formatDate(value as string);
      }
    });

    const categoryPermissionId = Number(formObject['category_permission_id']);

    // Format data untuk dikirim
    const formattedData = {
      ...formObject,
      category_permission_id: isNaN(categoryPermissionId) ? null : categoryPermissionId,
      attachment: formData.get('attachment') as File,
      attachments: await Promise.all(attachments.map(async att => ({
        amount: att.amount,
        attachment: att.attachment,
      }))),
    };

    try {
      // Tampilkan snackbar "Submitting data..."
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
      } else if (title.includes('Attendance Update')) {
        response = await dispatch(submitAttendanceUpdateRequest(formattedData as any));
      }

      // Cek jika response mengandung error
      if (response && response.payload && response.payload.error) {
        throw new Error(response.payload.error || 'Failed to submit data');
      }

      // Jika tidak ada error, berarti submit berhasil
      setSnackbarMessage('Data submitted successfully!');
      setSnackbarType('success');
      setIsSuccessPopupVisible(true);
    } catch (err: unknown) {
      console.log('Error yang diterima:', err);
      let errorMessage = 'Terjadi kesalahan yang tidak terduga pada aplikasi. Mohon coba lagi.';

      if (axios.isAxiosError(err)) {
        if (err.response) {
          const statusCode = err.response.status;
          const errorData = err.response.data;
          console.log('Error response:', errorData);

          if (statusCode === 400) {
            errorMessage = errorData?.message || 'Permintaan tidak valid. Periksa inputan Anda.';
          } else if (statusCode === 401) {
            errorMessage = 'Akses ditolak. Anda perlu login untuk melanjutkan.';
          } else if (statusCode === 403) {
            errorMessage = 'Anda tidak memiliki izin untuk melakukan tindakan ini.';
          } else if (statusCode === 404) {
            errorMessage = 'Data yang Anda cari tidak ditemukan.';
          } else if (statusCode === 500) {
            errorMessage = 'Terjadi kesalahan di server. Mohon coba lagi nanti.';
          } else if (statusCode === 503) {
            errorMessage = 'Layanan sedang tidak tersedia. Coba lagi nanti.';
          } else {
            errorMessage = errorData?.error || 'Terjadi kesalahan yang tidak terduga. Mohon coba lagi.';
          }
        } else if (err.request) {
          errorMessage = 'Tidak ada respons dari server. Mohon periksa koneksi internet Anda.';
        } else {
          errorMessage = 'Terjadi kesalahan dalam pengaturan permintaan. Silakan coba lagi.';
        }
      } else {
        errorMessage = 'Terjadi kesalahan yang tidak terduga pada aplikasi. Mohon coba lagi.';
      }

      // Update state dan tampilkan popup error hanya sekali
      if (!isErrorPopupVisible) {
        setErrorMessage(errorMessage);
        setIsErrorPopupVisible(true);
        setSnackbarMessage(errorMessage);
        setSnackbarType('error');
        setSnackbarVisible(true);
      }
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/upload-attachment/file', formData);
      return response.data.body.file_path;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };
  const closeErrorPopup = () => {
    setIsErrorPopupVisible(false);
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupVisible(false);
  };

  useEffect(() => {
    console.log('RequestForm rendered');
  }, []);

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
                  title.includes('Reimbursement') ? (
                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg mt-4">
                      <h2 className="text-lg font-semibold text-gray-800 mb-3">Lampiran</h2>
                      {attachments.map((attachment, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2 mb-4 border-b pb-2">
                          <input
                            type="number"
                            placeholder="Harga"
                            className="border border-gray-300 rounded-lg p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={attachment.amount}
                            onChange={(e) => handleAttachmentChange(index, 'amount', Number(e.target.value))}
                            required
                          />
                          <input
                            type="file"
                            onChange={(e) => handleAttachmentChange(index, 'attachment', e.target.files?.[0])}
                            className="border border-gray-300 rounded-lg p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="text-red-500 hover:text-red-700 transition duration-200"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddAttachment}
                        className="mt-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200"
                      >
                        Tambah
                      </button>
                    </div>
                  ) : (
                    <div className="w-full border-2 border-dashed border-blue-300 rounded-lg p-4 text-center text-black">
                      <img src="/icons/upload.png" alt="Upload Icon" className="w-10 h-8 mx-auto mb-2" />
                      <input
                        id={field.name}
                        type="file"
                        name={field.name}
                        className="hidden"
                        accept="*/*"
                        onChange={handleFileChange}
                      />
                      <label htmlFor={field.name} className="block text-sm font-medium text-blue-500 cursor-pointer">
                        Upload Lampiran untuk mengajukan
                      </label>
                      <label htmlFor={field.name} className="block text-xs font-normal text-gray-500 cursor-pointer">
                        Tambahkan bukti untuk mengkonfirmasi
                      </label>
                      {filePreview ? (
                        <div className="mt-4">
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-full h-auto border border-gray-300 rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="mt-4 text-gray-700">
                          {file ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{file.name}</span>
                              {/* Ikon file sesuai jenis */}
                              <AiOutlineWarning className="text-blue-500" />
                            </div>
                          ) : (
                            <span></span>
                          )}
                        </div>
                      )}
                    </div>
                  )
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
                ) : field.type === 'time' ? (
                  <input
                    id={field.name}
                    type="time"
                    name={field.name}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                ) : field.type === 'number' ? (
                  <input
                    id={field.name}
                    type="number"
                    name={field.name}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder={"IDR 0"}
                  />
                ) : field.type === 'overtime' ? (
                  <input
                    id={field.name}
                    type="number"
                    name={field.name}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder={"0"}
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
            <div className='w-full rounded-lg p-2 text-center flex items-center justify-center'>
              <AiOutlineWarning className='mr-2 text-black' /> {/* Ikon di sebelah kiri */}
              <h2 className='text-black'>
                Total Cuti Anda: {leaveAllowance} Hari
              </h2>
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="mb-4 flex justify-center">
              <img
                src="/icons/eror.png" // Perbaiki nama file dari "eror.png" menjadi "error.png"
                alt="Error Icon"
                className="w-20 h-20 object-cover" // Pastikan ukuran gambar sesuai
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center">Terjadi Kesalahan</h2>
            <p className='text-gray-600 text-center mt-2'>
              {errorMessage || 'Gagal Untuk Membuat Formulir.'}
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeSuccessPopup}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {isErrorPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[9999]">
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