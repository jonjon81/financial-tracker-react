import React from 'react';
import { Invoice } from '../types/Invoice';

interface NetIncomeSummaryProps {
  incomeTotalPrevious12Months: number;
  incomeTotalPrevious24Months: number;
  expenseTotalPrevious12Months: number;
  expenseTotalPrevious24Months: number;
  transactions: Invoice[];
}

const NetIncomeSummary: React.FC<NetIncomeSummaryProps> = ({
  incomeTotalPrevious12Months,
  incomeTotalPrevious24Months,
  expenseTotalPrevious12Months,
  expenseTotalPrevious24Months,
}) => {
  const difference = incomeTotalPrevious12Months - incomeTotalPrevious24Months;
  const differencePercentage =
    incomeTotalPrevious24Months !== 0 ? ((difference / incomeTotalPrevious24Months) * 100).toFixed(2) : 'N/A';
  return (
    <div className="net-income-summary">
      <h2>Net Income Summary</h2>
      <p>Income Total Previous 12 Months: {incomeTotalPrevious12Months}</p>
      <p>Income Total Previous 24 Months: {incomeTotalPrevious24Months}</p>
      <p>Difference % = {differencePercentage}</p>
      <p>Expense Total Previous 12 Months: {expenseTotalPrevious12Months}</p>
      <p>Expense Total Previous 24 Months: {expenseTotalPrevious24Months}</p>
      <p>Difference % = {differencePercentage}</p>
    </div>
  );
};

export default NetIncomeSummary;
