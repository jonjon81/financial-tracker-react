import React, { useState, useEffect } from 'react';
import SummaryWidget from './components/SummaryWidget';
import InvoicesWidget from './components/InvoicesWidget';
import { fetchInvoices, fetchTransactions } from './services/mockBackend';
import { Invoice } from './types/Invoice';
import { Transaction } from './types/Transaction';
import { Spinner } from 'react-bootstrap';
import './App.css';

const App: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoicesLast30, setInvoicesLast30] = useState<number>(0);
  const [isLoading, setLoading] = useState(false);

  // Calculate invoices created in the last 30 days
  useEffect(() => {
    const calculateInvoicesCreatedLast30Days = (invoicesData: Invoice[]): number => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const invoicesLast30Days = invoicesData.filter((invoice) => new Date(invoice.creationDate) >= thirtyDaysAgo);

      return invoicesLast30Days.length;
    };

    const invoicesLast30DaysCount = calculateInvoicesCreatedLast30Days(invoices);
    setInvoicesLast30(invoicesLast30DaysCount);
  }, [invoices]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const invoicesData = await fetchInvoices();
        const transactionsData = await fetchTransactions();

        setInvoices(invoicesData);
        setTransactions(transactionsData);

        // Check invoices to update status
        const updatedInvoices = invoicesData.map((invoice) => {
          const matchedTransaction = transactionsData.find(
            (transaction) =>
              transaction.transactionDate === invoice.creationDate &&
              transaction.amount === invoice.amount &&
              transaction.referenceNumber === invoice.referenceNumber
          );

          return {
            ...invoice,
            status: matchedTransaction ? 'PAID' : 'UNPAID',
          };
        });

        setInvoices(updatedInvoices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Financial Dashboard</h1>
      {isLoading ? (
        <div className="spinner-overlay">
          <Spinner animation="border" variant="primary" className="centered-spinner" />
        </div>
      ) : (
        <div className="dashboard">
          <SummaryWidget invoicesLast30Days={invoicesLast30} transactions={transactions} />
          <InvoicesWidget invoices={invoices} setInvoices={setInvoices} transactions={transactions} />
        </div>
      )}
    </div>
  );
};

export default App;
