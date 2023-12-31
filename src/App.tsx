import React, { useEffect, useState } from 'react';
import SummaryWidget from './components/SummaryWidget';
import InvoicesWidget from './components/InvoicesWidget';
import { useInvoice } from './context/InvoiceContexts';
import { useTransaction } from './context/TransactionContexts';
import './App.css';

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
          <SummaryWidget transactions={transactionState.transactions} />
          <InvoicesWidget transactions={transactionState.transactions} />
        </div>
      )}
    </div>
  );
};

export default App;
