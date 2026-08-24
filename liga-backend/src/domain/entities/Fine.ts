export interface Fine {
  id?: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'PENDING_VERIFICATION' | 'PAID';
  receiptUrl?: string | null;
  paymentDate?: Date | null;
  teamId: string;
  matchId?: string | null;
  playerId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}