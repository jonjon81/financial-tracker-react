import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContexts';
import { Transaction } from '../types/Transaction';
import { formatPriceWholeNumber } from '../utils/helpers';

interface SummaryProps {
  transactions: Transaction[];
}

const TotalExpenseSummary: React.FC<SummaryProps> = () => {
  const { state: transactionState } = useContext(TransactionContext);

  const { transactions } = transactionState;

  const calculateTotalExpenseAmount = (): number => {
    const totalAmount = transactions.reduce((total: number, transaction: Transaction) => {
      if (transaction.category === 'expense') {
        return total + transaction.amount;
      }
      return total;
    }, 0);

    return Math.abs(totalAmount);
  };

  const totalAmount = calculateTotalExpenseAmount();

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Total Expenses</h2>
        <p className="card-text text-center fs-2">
          <strong>{formatPriceWholeNumber(totalAmount)}</strong>
        </p>
      </div>
    </div>
  );
};

export default TotalExpenseSummary;
