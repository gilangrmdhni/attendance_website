export interface CheckoutPayload {
  checkout_at: string;
  message: string;
  elapsed_time: number;
}

export interface CheckoutResponse {
  success: boolean;
  data: any;
}
