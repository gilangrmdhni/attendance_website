// Tipe untuk item riwayat absensi
export interface HistoryItem {
    id: number;
    tipe: string; // Misalnya, "wfo" untuk Work From Office
    status: string; // Status seperti "present"
    checkin_at: string; // Waktu check-in dalam format ISO 8601
    checkout_at: string; // Waktu checkout dalam format ISO 8601
    total_hours_worked: string; // Total jam kerja
  }
  
  // Tipe untuk item persetujuan permintaan
  export interface RequestApproval {
    id: number; // ID permintaan
    request_id: number; // ID permintaan
    category: string; // Kategori, misalnya "Reimbursment" atau "TimeOff"
    description: string; // Deskripsi permintaan
    dates: string; // Tanggal dalam format ISO 8601
    status: string; // Status permintaan, misalnya "approved" atau "waiting"
  }
  
  // Tipe untuk state history
  export interface HistoryState {
    history: HistoryItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  
  // Tipe untuk state request approval
  export interface RequestApprovalState {
    requests: RequestApproval[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  