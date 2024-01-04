import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContexts';
import { formatPriceWholeNumber } from '../utils/helpers';
import { Transaction } from '../types/Transaction';
import { FaLongArrowAltUp } from 'react-icons/fa';
import { FaLongArrowAltDown } from 'react-icons/fa';

interface SummaryProps {
  transactions: Transaction[];
}

const CashBalance: React.FC<SummaryProps> = () => {
  const { state: transactionState } = useContext(TransactionContext);
  const { transactions } = transactionState;

  const calculateTotalAmount = (filteredTransactions: Transaction[]): number => {
    return filteredTransactions.reduce((total: number, transaction: Transaction) => total + transaction.amount, 0);
  };

  const filterTransactionsByDynamicMonths = (monthsAgo: number): Transaction[] => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - monthsAgo, 1);

    return transactions.filter((transaction: Transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const previous12MonthsTransactions = filterTransactionsByDynamicMonths(12);
  const previous24MonthsTransactions = filterTransactionsByDynamicMonths(24);

  const totalPrevious12Months = calculateTotalAmount(previous12MonthsTransactions);
  const totalPrevious24Months = calculateTotalAmount(previous24MonthsTransactions);

  const difference = totalPrevious12Months - totalPrevious24Months;
  const differencePercentage =
    totalPrevious24Months !== 0 ? ((difference / totalPrevious24Months) * 100).toFixed(2) : 'N/A';

  let totalAmountColor = 'text-dark';
  let differenceColor = 'text-dark';

  if (totalPrevious12Months > 5000) totalAmountColor = 'text-success';
  else if (totalPrevious12Months > 0) totalAmountColor = 'text-warning';
  else if (totalPrevious12Months < 0) totalAmountColor = 'text-danger';

  if (difference < 0) {
    differenceColor = 'text-danger';
  } else if (difference > 0) {
    differenceColor = 'text-success';
  }

  let differenceText: React.ReactNode = '';

  if (differenceColor === 'text-danger') {
    differenceText = (
      <>
        <span className="d-flex justify-content-center">
          <span>
            <FaLongArrowAltDown className={differenceColor} />
            {Math.abs(Number(differencePercentage))}%
          </span>
        </span>
        <span className="pt-2"> from previous 12 months</span>
      </>
    );
  } else if (differenceColor === 'text-success') {
    differenceText = (
      <>
        <span className="d-flex justify-content-center">
          <span>
            <FaLongArrowAltUp className={differenceColor} />
            {Number(differencePercentage)}%
          </span>
        </span>
        <span className="pt-2"> from previous 12 months</span>
      </>
    );
  } else {
    differenceText = 'No change from previous 12 months';
  }

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Cash Balance</h2>
        <p className="card-text text-center fs-2">
          <span className={`ms-1 ${totalAmountColor}`}>
            <strong>{formatPriceWholeNumber(totalPrevious12Months)}</strong>
          </span>
          <br />
          <span className="ms-1 d-flex flex-column perecent-change-block pt-2" style={{ fontSize: '12px' }}>
            {differenceText}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CashBalance;
