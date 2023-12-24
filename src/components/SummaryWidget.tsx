import React, { useState, useEffect } from 'react';
import { Transaction } from '../types/Transactions';
import { fetchTransactions } from '../services/mockBackend';
import { fetchInvoices } from '../services/mockBackend';
import { Invoice } from '../types/Invoice';
import { formatPrice } from '../utils/helpers';

const SummaryWidget: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Fetch mock transactions data
    const fetchTransactionsData = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching mock transactions:', error);
      }
    };

    // Fetch mock invoices data
    const fetchInvoicesData = async () => {
      try {
        const data = await fetchInvoices();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching mock invoices:', error);
      }
    };

    fetchTransactionsData();
    fetchInvoicesData();
  }, []);

  const calculateTotalAmount = (): number => {
    // Calculate total amount from transactions
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const calculateInvoicesCreatedLast30Days = (): number => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Filter invoices created in the last 30 days
    const invoicesLast30Days = invoices.filter((invoice) => new Date(invoice.creationDate) >= thirtyDaysAgo);

    return invoicesLast30Days.length;
  };

  const totalAmount = calculateTotalAmount();
  const invoicesLast30Days = calculateInvoicesCreatedLast30Days();

  // Determine color based on total amount
  let totalAmountColor = 'black';
  let threshold = 5000;
  if (totalAmount > threshold) totalAmountColor = 'green';
  else if (totalAmount > 0) totalAmountColor = 'yellow';
  else if (totalAmount < 0) totalAmountColor = 'red';

  return (
    <div className="p-4 bg-primary-subtle d-inline-block rounded mb-4">
      <h2>Financial Summary</h2>
      <p>
        Total Amount:{' '}
        <span style={{ color: totalAmountColor }}>
          <strong>{formatPrice(totalAmount)}</strong>
        </span>
      </p>
      <p>
        Invoices Created in the Last 30 Days: <strong>{invoicesLast30Days}</strong>
      </p>
    </div>
  );
};

export default SummaryWidget;
