import React, { useEffect, useState } from 'react';
import InvoicesWidget from './components/InvoicesWidget';
import BarChart from './components/BarChart';
import { useInvoice } from './context/InvoiceContexts';
import { useTransaction } from './context/TransactionContexts';
import './App.css';
import SummaryWidget from './components/SummaryWidget';

const App: React.FC = () => {
  const { state: invoiceState } = useInvoice();
  const { state: transactionState } = useTransaction();
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (invoiceState.invoices.length > 0) {
      setLoading(false);
    }
  }, [invoiceState.invoices]);

  return (
    <div className="container py-2">
      {isLoading ? (
        <div className="d-flex justify-content-center spinner-overlay">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <SummaryWidget />
          <InvoicesWidget transactions={transactionState.transactions} />
          <BarChart />
        </div>
      )}
    </div>
  );
};

export default App;
