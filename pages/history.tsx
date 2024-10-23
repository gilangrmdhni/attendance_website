import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchHistory } from '../store/slices/historySlice';
import { fetchRequestApprovals } from '../store/slices/requestApprovalSlice';
import HistoryItem from '../components/history/HistoryItem';
import TimeOffItem from '../components/history/TimeOffItem';
import Footer from '../components/Footer';
import MobileContainer from '../components/MobileContainer';
import HistoryHeader from '../components/history/HistoryHeader';
import { HistoryItem as HistoryItemType, RequestApproval as RequestApprovalType } from '../store/types/historyTypes';
import Head from 'next/head';
import { useRouter } from 'next/router';

const History = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const history = useSelector((state: RootState) => state.history.history);
  const historyStatus = useSelector((state: RootState) => state.history.status);
  const requests = useSelector((state: RootState) => state.requestApproval.requests);
  const requestsStatus = useSelector((state: RootState) => state.requestApproval.status);
  const [activeTab, setActiveTab] = useState<'Attendance' | 'Time Off'>('Attendance');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<string | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<string | null>(null);


  useEffect(() => {
    // Fetch data berdasarkan status saat pertama kali komponen dimuat
    if (historyStatus === 'idle' && activeTab === 'Attendance') {
      dispatch(fetchHistory());
    }
    if (requestsStatus === 'idle' && activeTab === 'Time Off') {
      dispatch(fetchRequestApprovals());
    }
  }, [dispatch, historyStatus, requestsStatus, activeTab]);
  
  // Refetch ketika activeTab berubah
  useEffect(() => {
    if (activeTab === 'Attendance' && historyStatus === 'idle') {
      dispatch(fetchHistory());
    } else if (activeTab === 'Time Off' && requestsStatus === 'idle') {
      dispatch(fetchRequestApprovals());
    }
  }, [dispatch, activeTab, historyStatus, requestsStatus]);  

  const filteredHistory = (history ?? []).filter((item: HistoryItemType) => {
    const matchesSearch = item.tipe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(item.checkin_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).includes(searchTerm.toLowerCase());
    const matchesDateRange = (!filterStartDate || new Date(item.checkin_at) >= new Date(filterStartDate)) &&
      (!filterEndDate || new Date(item.checkin_at) <= new Date(filterEndDate));
    return matchesSearch && matchesDateRange;
  });

  const filteredRequests = (requests ?? []).filter((request: RequestApprovalType) => {
    const matchesSearch = request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(request.dates).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).includes(searchTerm.toLowerCase());
    const matchesDateRange = (!filterStartDate || new Date(request.dates) >= new Date(filterStartDate)) &&
      (!filterEndDate || new Date(request.dates) <= new Date(filterEndDate));
    return matchesSearch && matchesDateRange;
  });

  return (
    <MobileContainer>
      <Head>
        <title>History</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <HistoryHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterStartDate={filterStartDate}
        setFilterStartDate={setFilterStartDate}
        filterEndDate={filterEndDate}
        setFilterEndDate={setFilterEndDate}
      />
      <main className="px-4 pb-20">
        {activeTab === 'Attendance' && (
          <>
            <div className="text-gray-500 text-sm my-2 text-center"></div>
            {historyStatus === 'loading' && <p>Memuat data kehadiran...</p>}
            {historyStatus === 'succeeded' && filteredHistory.length > 0 ? (
              filteredHistory.map((item: HistoryItemType) => (
                <HistoryItem
                  key={item.id}
                  type={item.tipe === 'work from anywhere/home' ? 'Anywhere' : item.tipe === 'work from office' ? 'Office' : 'Unknown'}
                  date={new Date(item.checkin_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  startTime={new Date(item.checkin_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'}
                  endTime={item.checkout_at !== '0001-01-01T00:00:00Z' ? new Date(item.checkout_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : 'Not Checked Out'}
                  totalTime={item.total_hours_worked}
                />
              ))
            ) : (
              <p>Tidak ada catatan kehadiran yang ditemukan.</p>
            )}
            {historyStatus === 'failed' && <p>Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p>}
          </>
        )}
        {activeTab === 'Time Off' && (
          <>
            <div className="text-gray-500 text-sm my-2 text-center"></div>
            {requestsStatus === 'loading' && <p>Memuat permintaan izin...</p>}
            {requestsStatus === 'succeeded' && filteredRequests.length > 0 ? (
              filteredRequests.map((item: RequestApprovalType) => {
                // Menentukan tipe berdasarkan kategori
                let type;
                switch (item.category) {
                  case 'Izin':
                    type = 'Izin';
                    break;
                  case 'Reimbursment':
                    type = 'Reimbursement';
                    break;
                  case 'TimeOff':
                    type = 'Sakit';
                    break;
                  case 'Lembur':
                    type = 'Lembur';
                    break;
                  default:
                    type = 'Lainnya';
                }

                let status;
                switch (item.status) {
                  case 'approved':
                    status = 'Disetujui';
                    break;
                  case 'waiting':
                    status = 'Menunggu Persetujuan';
                    break;
                  case 'rejected':
                    status = 'Ditolak';
                    break;
                  default:
                    status = 'Status Tidak Diketahui';
                }

                return (
                  <TimeOffItem
                    key={item.id}
                    type={type}
                    category={item.category}
                    reason={item.description}
                    start_date={new Date(item.start_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    submission={item.status}
                  />
                );
              })
            ) : (
              <p>Tidak ada permintaan izin yang ditemukan.</p>
            )}
            {requestsStatus === 'failed' && <p>Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p>}
          </>
        )}
      </main>
      <Footer />
    </MobileContainer>
  );
};

export default History;
