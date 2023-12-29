import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { fetchInvoices } from '../services/mockBackend';
import { InvoiceAction, InvoiceState } from '../types/Invoice';
import invoiceReducer from '../reducers/invoiceReducer';
import { setInvoices } from '../actions/invoiceActions';

const initialState: InvoiceState = {
  invoices: [],
};

interface InvoiceProviderProps {
  children: ReactNode;
}

export const InvoiceContext = createContext<{
  state: InvoiceState;
  dispatch: React.Dispatch<InvoiceAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const invoicesData = await fetchInvoices();
        dispatch(setInvoices(invoicesData));
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoiceData();
  }, []);

  return <InvoiceContext.Provider value={{ state, dispatch }}>{children}</InvoiceContext.Provider>;
};

export const useInvoice = () => useContext(InvoiceContext);
