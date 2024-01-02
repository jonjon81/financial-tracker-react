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

  const filterTransactionsByDynamicMonths = (monthsAgo: number): Transaction[] => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - monthsAgo, 1);

    return transactions.filter((transaction: Transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      return transactionDate >= startDate && transactionDate <= endDate && transaction.category === 'expense';
    });
  };

  const previous12MonthsTransactions = filterTransactionsByDynamicMonths(12);
  const previous24MonthsTransactions = filterTransactionsByDynamicMonths(24);

  const totalPrevious12Months = previous12MonthsTransactions.reduce(
    (total: number, transaction: Transaction) => total + transaction.amount,
    0
  );
  const totalPrevious24Months = previous24MonthsTransactions.reduce(
    (total: number, transaction: Transaction) => total + transaction.amount,
    0
  );

  const difference = totalPrevious12Months - totalPrevious24Months;
  const differencePercentage =
    totalPrevious24Months !== 0 ? ((difference / totalPrevious24Months) * 100).toFixed(2) : 'N/A';

  const absoluteTotal = Math.abs(totalPrevious12Months);

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Total Expenses</h2>
        <p className="card-text text-center fs-2">
          <span className="ms-1">
            <strong>{formatPriceWholeNumber(absoluteTotal)}</strong>
          </span>
          <br />
          <span className="ms-1 d-flex flex-column" style={{ fontSize: '12px' }}>
            {difference < 0 ? (
              <span className="text-success">{Math.abs(Number(differencePercentage))}%</span>
            ) : (
              <span className="text-danger">{Number(differencePercentage)}%</span>
            )}
            previous 12 months
          </span>
        </p>
      </div>
    </div>
  );
};

export default TotalExpenseSummary;
