export interface CheckInPayload {
    checkin_latitude: string | number;
    checkin_longitude: string | number;
    picture: File; 
}

export interface CheckInResponse {
    body: {
        checkin_at: string;
    };
    code: number;
    error: string ;
    message: string;
}


export interface CheckinState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: CheckInResponse | null;
}
