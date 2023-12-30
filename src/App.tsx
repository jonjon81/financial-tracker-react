import React, { useEffect, useState } from 'react';
import SummaryWidget from './components/SummaryWidget';
import InvoicesWidget from './components/InvoicesWidget';
import { useInvoice } from './context/InvoiceContexts';
import { useTransaction } from './context/TransactionContexts';
import { Invoice } from './types/Invoice';
import './App.css';

const App: React.FC = () => {
  const { state: invoiceState } = useInvoice();
  const { state: transactionState } = useTransaction();
  const [invoicesLast30, setInvoicesLast30] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const calculateInvoicesCreatedLast30Days = (invoicesData: Invoice[]): number => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const invoicesLast30Days = invoicesData.filter((invoice) => new Date(invoice.creationDate) >= thirtyDaysAgo);
      return invoicesLast30Days.length;
    };

    const invoicesLast30DaysCount = calculateInvoicesCreatedLast30Days(invoiceState.invoices);
    setInvoicesLast30(invoicesLast30DaysCount);
    if (invoiceState.invoices.length > 0) {
      setLoading(false);
    }
  }, [invoiceState.invoices]);

  return (
    <div className="container">
      <h1>Financial Dashboard</h1>

      {isLoading ? (
        <div className="d-flex justify-content-center spinner-overlay">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <SummaryWidget invoicesLast30Days={invoicesLast30} transactions={transactionState.transactions} />
          <InvoicesWidget transactions={transactionState.transactions} />
        </div>
      )}
    </div>
  );
};

export default App;
