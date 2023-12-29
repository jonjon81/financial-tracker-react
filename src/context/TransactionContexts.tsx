import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { TransactionState } from '../types/Transaction';
import { fetchTransactions } from '../services/mockBackend';
import transactionReducer from '../reducers/transactionsReducer';
import { setTransactions } from '../actions/transactionActions';

interface TransactionProviderProps {
  children: ReactNode;
}

const initialTransactionState: TransactionState = {
  transactions: [],
};

export const TransactionContext = createContext<{
  state: TransactionState;
  dispatch: React.Dispatch<any>;
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
        dispatch(setTransactions(transactionsData));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactionsData();
  }, []);

  return <TransactionContext.Provider value={{ state, dispatch }}>{children}</TransactionContext.Provider>;
};

export const useTransaction = () => useContext(TransactionContext);
