import React, { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContexts';
import { TransactionContext } from '../context/TransactionContexts';
import { formatPrice } from '../utils/helpers';
import { Transaction } from '../types/Transaction';

interface SummaryProps {
  invoicesLast30Days: number;
  transactions: Transaction[];
}

const SummaryWidget: React.FC<SummaryProps> = () => {
  const { state: invoiceState } = useContext(InvoiceContext);
  const { state: transactionState } = useContext(TransactionContext);

  const { invoices } = invoiceState;
  const { transactions } = transactionState;

  console.log('transactions from summary widget: ', transactions);
  console.log('invoices from summary widget: ', invoices);

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
          Invoices Count: <strong>{invoices.length}</strong>
        </p>
      </div>
    </div>
  );
};

export default SummaryWidget;
