import React, { useState, useEffect } from 'react';
import { Transaction } from '../types/Transactions';
import { fetchTransactions } from '../services/mockBackend';
import { formatPrice } from '../utils/helpers';

interface SummaryProps {
  receivedData: number;
}

const SummaryWidget: React.FC<SummaryProps> = ({ receivedData }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

    fetchTransactionsData();
  }, []);

  const calculateTotalAmount = (): number => {
    // Calculate total amount from transactions
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const totalAmount = calculateTotalAmount();

  // Determine color based on total amount
  let totalAmountColor = 'black';
  let threshold = 5000;
  if (totalAmount > threshold) totalAmountColor = 'green';
  else if (totalAmount > 0) totalAmountColor = 'yellow';
  else if (totalAmount < 0) totalAmountColor = 'red';

  return (
    <>
      <div className="p-4 bg-primary-subtle d-inline-block rounded mb-4">
        <h2>Financial Summary</h2>
        <p>
          Total Amount:{' '}
          <span style={{ color: totalAmountColor }}>
            <strong>{formatPrice(totalAmount)}</strong>
          </span>
        </p>
        <p>
          Invoices Created in the Last 30 Days: <strong>{receivedData}</strong>
        </p>
      </div>
    </>
  );
};

export default SummaryWidget;
