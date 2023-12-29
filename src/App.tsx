import React, { useEffect, useState } from 'react';
import SummaryWidget from './components/SummaryWidget';
import InvoicesWidget from './components/InvoicesWidget';
import { Spinner } from 'react-bootstrap';
import { useInvoice } from './context/InvoiceContexts';
import { useTransaction } from './context/TransactionContexts';
import { Invoice } from './types/Invoice';

const App: React.FC = () => {
  const { state: invoiceState } = useInvoice();
  const { state: transactionState } = useTransaction();
  const [invoicesLast30, setInvoicesLast30] = useState<number>(0);
  const [isLoading] = useState(false);

  useEffect(() => {
    const calculateInvoicesCreatedLast30Days = (invoicesData: Invoice[]): number => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const invoicesLast30Days = invoicesData.filter((invoice) => new Date(invoice.creationDate) >= thirtyDaysAgo);

      return invoicesLast30Days.length;
    };

    const invoicesLast30DaysCount = calculateInvoicesCreatedLast30Days(invoiceState.invoices);
    setInvoicesLast30(invoicesLast30DaysCount);
  }, [invoiceState.invoices]);

  return (
    <div className="container">
      <h1>Financial Dashboard</h1>
      {isLoading ? (
        <div className="spinner-overlay">
          <Spinner animation="border" variant="primary" className="centered-spinner" />
        </div>
      ) : (
        <div className="dashboard">
          <SummaryWidget invoicesLast30Days={invoicesLast30} transactions={transactionState.transactions} />
          <InvoicesWidget
            invoices={invoiceState.invoices}
            setInvoices={() => {}}
            transactions={transactionState.transactions}
          />
        </div>
      )}
    </div>
  );
};

export default App;
