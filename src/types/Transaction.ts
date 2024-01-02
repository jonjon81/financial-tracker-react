export interface Transaction {
  transactionDate: string;
  description: string;
  referenceNumber: string;
  amount: number;
  category: string;
}

export interface TransactionState {
  transactions: Transaction[];
}

export enum TransactionActionTypes {
  SET_TRANSACTIONS = 'SET_TRANSACTIONS',
}

export type TransactionAction = {
  type: TransactionActionTypes;
  payload: Transaction[];
};
