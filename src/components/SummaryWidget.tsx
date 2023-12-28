import React from 'react';
import { Transaction } from '../types/Transaction';
import { formatPrice } from '../utils/helpers';

interface SummaryProps {
  invoicesLast30Days: number;
  transactions: Transaction[];
}

const SummaryWidget: React.FC<SummaryProps> = ({ invoicesLast30Days, transactions }) => {
  const calculateTotalAmount = (): number => {
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
    <div className="card d-inline-block bg-light mb-4">
      <div className="card-body">
        <h2 className="card-title">Financial Summary</h2>
        <p className="card-text">
          Total Amount:{' '}
          <span style={{ color: totalAmountColor }}>
            <strong>{formatPrice(totalAmount)}</strong>
          </span>
        </p>
        <p className="card-text">
          Invoices Created in the Last 30 Days: <strong>{invoicesLast30Days}</strong>
        </p>
      </div>
    </div>
  );
};

export default SummaryWidget;
