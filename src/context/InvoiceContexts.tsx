import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { fetchInvoices } from '../services/mockBackend';
import { InvoiceAction, InvoiceState } from '../types/Invoice';
import invoiceReducer from '../reducers/invoiceReducer';
import { setInvoices } from '../actions/invoiceActions';

interface InvoiceProviderProps {
  children: ReactNode;
}

const initialInvoiceState: InvoiceState = {
  invoices: [],
};

export const InvoiceContext = createContext<{
  state: InvoiceState;
  dispatch: React.Dispatch<InvoiceAction>;
}>({
  state: initialInvoiceState,
  dispatch: () => null,
});

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(invoiceReducer, initialInvoiceState);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const invoicesData = await fetchInvoices();
        if (!invoicesData || !Array.isArray(invoicesData)) {
          throw new Error('Invalid data received from fetchInvoices');
        }
        dispatch(setInvoices(invoicesData));
      } catch (error) {
        console.error('Error fetching or processing invoices:', error);
      }
    };

    fetchInvoiceData();
  }, []);

  return <InvoiceContext.Provider value={{ state, dispatch }}>{children}</InvoiceContext.Provider>;
};

export const useInvoice = () => useContext(InvoiceContext);
