import { TransactionActionTypes, TransactionAction, Transaction } from '../types/Transaction';

export const setTransactions = (transactions: Transaction[]): TransactionAction => ({
  type: TransactionActionTypes.SET_TRANSACTIONS,
  payload: transactions,
});
