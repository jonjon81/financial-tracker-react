import React, { useEffect, useState } from 'react';
import SummaryWidget from './components/SummaryWidget';
import InvoicesWidget from './components/InvoicesWidget';
import { useInvoice } from './context/InvoiceContexts';
import { useTransaction } from './context/TransactionContexts';
import { Invoice } from './types/Invoice';

const App: React.FC = () => {
  const { state: invoiceState } = useInvoice();
  const { state: transactionState } = useTransaction();
  const [invoicesLast30, setInvoicesLast30] = useState<number>(0);

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
      <div className="dashboard">
        <SummaryWidget invoicesLast30Days={invoicesLast30} transactions={transactionState.transactions} />
        <InvoicesWidget
          invoices={invoiceState.invoices}
          setInvoices={() => {}}
          transactions={transactionState.transactions}
        />
      </div>
    </div>
  );
};

export default App;
