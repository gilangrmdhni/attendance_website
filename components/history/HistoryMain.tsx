import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchHistory } from '../../store/slices/historySlice';
import { fetchRequestApprovals } from '../../store/slices/requestApprovalSlice';
import HistoryItem from '../../components/history/HistoryItem';
import TimeOffItem from '../../components/history/TimeOffItem';
import { HistoryItem as HistoryItemType, RequestApproval as RequestApprovalType } from '../../store/types/historyTypes';

const HistoryMain = () => {
  const dispatch: AppDispatch = useDispatch();
  const history = useSelector((state: RootState) => state.history.history);
  const historyStatus = useSelector((state: RootState) => state.history.status);
  const requests = useSelector((state: RootState) => state.requestApproval.requests);
  const requestsStatus = useSelector((state: RootState) => state.requestApproval.status);

  useEffect(() => {
    if (historyStatus === 'idle') {
      dispatch(fetchHistory());
    }
    if (requestsStatus === 'idle') {
      dispatch(fetchRequestApprovals());
    }
  }, [dispatch, historyStatus, requestsStatus]);

  return (
    <div>
      <h1>History</h1>
      <h2>Attendance History</h2>
      {historyStatus === 'loading' && <p>Loading...</p>}
      {historyStatus === 'succeeded' && (
        history.map((item: HistoryItemType, index: number) => (
          <HistoryItem
            key={index}
            type={item.tipe === 'wfo' ? 'Office' : 'Anywhere'}
            date={new Date(item.checkin_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            startTime={new Date(item.checkin_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'}
            endTime={item.checkout_at !== '0001-01-01T00:00:00Z' ? new Date(item.checkout_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : 'Not Checked Out'}
            totalTime={item.total_hours_worked}
          />
        ))
      )}
      {historyStatus === 'failed' && <p>Error loading history data.</p>}

      <h2>Time Off Requests</h2>
      {requestsStatus === 'loading' && <p>Loading...</p>}
      {requestsStatus === 'succeeded' && (
        requests.map((item: RequestApprovalType, index: number) => (
          <TimeOffItem
            key={index}
            type={item.category === 'TimeOff' ? 'Sick' : 'Other'}
            reason={item.description}
            date={new Date(item.dates).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            duration={item.status === 'approved' ? 'Full Day' : 'Pending'}
          />
        ))
      )}
      {requestsStatus === 'failed' && <p>Error loading time off data.</p>}
    </div>
  );
};

export default HistoryMain;
