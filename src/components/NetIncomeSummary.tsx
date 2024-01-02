import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContexts';
import { InvoiceContext } from '../context/InvoiceContexts';
import { Transaction } from '../types/Transaction';
import { Invoice } from '../types/Invoice';
import { formatPriceWholeNumber } from '../utils/helpers';

interface SummaryProps {
  transactions: Transaction[];
}

const NetIncomeSummary: React.FC<SummaryProps> = () => {
  const { state: transactionState } = useContext(TransactionContext);
  const { state: invoiceState } = useContext(InvoiceContext);

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

  const totalExpenseAmount = calculateTotalExpenseAmount();

  const { invoices } = invoiceState;

  const calculateTotalIncomeAmount = (): number => {
    return invoices.reduce((total: number, invoice: Invoice) => total + invoice.amount, 0);
  };

  const totalIncomeAmount = calculateTotalIncomeAmount();
  const totalNetIncome = totalIncomeAmount - totalExpenseAmount;

  // Determine color based on total amount
  let totalAmountColor = 'black';
  let threshold = 5000;
  if (totalNetIncome > threshold) totalAmountColor = 'green';
  else if (totalNetIncome > 0) totalAmountColor = 'yellow';
  else if (totalNetIncome < 0) totalAmountColor = 'red';

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Net Income</h2>
        <p className="card-text text-center fs-2" style={{ color: totalAmountColor }}>
          <strong>{formatPriceWholeNumber(totalNetIncome)}</strong>
        </p>
      </div>
    </div>
  );
};

export default NetIncomeSummary;
