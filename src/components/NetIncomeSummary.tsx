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
  const differenceIncome = incomeTotalPrevious12Months - incomeTotalPrevious24Months;
  const differencePercentageIncome =
    incomeTotalPrevious24Months !== 0 ? ((differenceIncome / incomeTotalPrevious24Months) * 100).toFixed(2) : 'N/A';
  const differenceExpense = expenseTotalPrevious12Months - expenseTotalPrevious24Months;
  const differencePercentageExpense =
    expenseTotalPrevious24Months !== 0 ? ((differenceExpense / expenseTotalPrevious24Months) * 100).toFixed(2) : 'N/A';
  return (
    <div className="net-income-summary">
      <h2>Net Income Summary</h2>
      <p>Income Total Previous 12 Months: {incomeTotalPrevious12Months}</p>
      <p>Income Total Previous 24 Months: {incomeTotalPrevious24Months}</p>
      <p>Difference % = {differencePercentageIncome}</p>
      <p>Expense Total Previous 12 Months: {expenseTotalPrevious12Months}</p>
      <p>Expense Total Previous 24 Months: {expenseTotalPrevious24Months}</p>
      <p>Difference % = {differencePercentageExpense}</p>
    </div>
  );
};

export default NetIncomeSummary;
