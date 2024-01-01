import React, { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContexts';
import { TransactionContext } from '../context/TransactionContexts';
import { formatPrice } from '../utils/helpers';
import { Transaction } from '../types/Transaction';

interface SummaryProps {
  transactions: Transaction[];
}

const SummaryWidget: React.FC<SummaryProps> = () => {
  const { state: invoiceState } = useContext(InvoiceContext);
  const { state: transactionState } = useContext(TransactionContext);

  const { invoices } = invoiceState;
  const { transactions } = transactionState;

  const calculateTotalAmount = (): number => {
    return transactions.reduce((total: number, transaction: Transaction) => total + transaction.amount, 0);
  };

  const totalAmount = calculateTotalAmount();

  // Filter invoices within the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const invoicesLast30Days = invoices.filter((invoice) => new Date(invoice.creationDate) > thirtyDaysAgo).length;

  // Determine color based on total amount
  let totalAmountColor = 'black';
  let threshold = 5000;
  if (totalAmount > threshold) totalAmountColor = 'green';
  else if (totalAmount > 0) totalAmountColor = 'yellow';
  else if (totalAmount < 0) totalAmountColor = 'red';

  return (
    <div className="card d-inline-block bg-light mb-4">
      <div className="card-body">
        <h2 className="card-title fs-5">Financial Summary</h2>
        <p className="card-text">
          Total Amount:
          <span className="ms-1" style={{ color: totalAmountColor }}>
            <strong>{formatPrice(totalAmount)}</strong>
          </span>
        </p>
        <p className="card-text">
          Invoices in the last 30 days: <strong>{invoicesLast30Days}</strong>
        </p>
      </div>
    </div>
  );
};

export default SummaryWidget;
