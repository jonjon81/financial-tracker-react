import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { Transaction } from '../types/Transaction';
import { fetchTransactions } from '../services/mockBackend';

export interface TransactionState {
  transactions: Transaction[];
}

export enum TransactionActionTypes {
  SET_TRANSACTIONS = 'SET_TRANSACTIONS',
}

export type TransactionAction = {
  type: TransactionActionTypes;
  payload: any;
};

const transactionReducer = (state: TransactionState, action: TransactionAction): TransactionState => {
  switch (action.type) {
    case TransactionActionTypes.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };

    default:
      return state;
  }
};

const initialTransactionState: TransactionState = {
  transactions: [],
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionContext = createContext<{
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
}>({
  state: initialTransactionState,
  dispatch: () => null,
});

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialTransactionState);

  useEffect(() => {
    const fetchTransactionsData = async () => {
      try {
        const transactionsData = await fetchTransactions();
        dispatch({ type: TransactionActionTypes.SET_TRANSACTIONS, payload: transactionsData });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactionsData();
  }, []);

  return <TransactionContext.Provider value={{ state, dispatch }}>{children}</TransactionContext.Provider>;
};

export const useTransaction = () => useContext(TransactionContext);
