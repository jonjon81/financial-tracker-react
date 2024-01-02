import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContexts';
import { formatPriceWholeNumber } from '../utils/helpers';
import { Transaction } from '../types/Transaction';

interface SummaryProps {
  transactions: Transaction[];
}

const CashBalance: React.FC<SummaryProps> = () => {
  const { state: transactionState } = useContext(TransactionContext);

  const { transactions } = transactionState;

  const calculateTotalAmount = (): number => {
    return transactions.reduce((total: number, transaction: Transaction) => total + transaction.amount, 0);
  };

  const totalAmount = calculateTotalAmount();

  // Determine color based on total amount
  let totalAmountColor = 'black';
  let threshold = 5000;
  if (totalAmount > threshold) totalAmountColor = 'green';
  else if (totalAmount > 0) totalAmountColor = 'yellow';
  else if (totalAmount < 0) totalAmountColor = 'red';

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Cash Balance</h2>
        <p className="card-text text-center fs-2">
          <span className="ms-1" style={{ color: totalAmountColor }}>
            <strong>{formatPriceWholeNumber(totalAmount)}</strong>
          </span>
        </p>
      </div>
    </div>
  );
};

export default CashBalance;
