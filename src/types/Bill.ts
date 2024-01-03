export interface Bill {
  vendor: string;
  creationDate: string;
  referenceNumber: string;
  amount: number;
  status: string;
  category: string;
}

export interface BillState {
  bills: Bill[];
}

export type BillAction =
  | { type: 'ADD_BILL'; payload: Bill }
  | { type: 'UPDATE_BILL'; payload: Bill }
  | { type: 'DELETE_BILL'; payload: number }
  | { type: 'SET_BILLS'; payload: Bill[] };
