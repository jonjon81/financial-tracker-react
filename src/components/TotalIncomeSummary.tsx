import React, { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContexts';
import { Invoice } from '../types/Invoice';
import { formatPriceWholeNumber } from '../utils/helpers';

interface SummaryProps {
  transactions: Invoice[];
}

const TotalIncomeSummary: React.FC<SummaryProps> = () => {
  const { state: invoiceState } = useContext(InvoiceContext);

  const { invoices } = invoiceState;

  const calculateTotalAmount = (): number => {
    return invoices.reduce((total: number, invoice: Invoice) => total + invoice.amount, 0);
  };

  const totalAmount = calculateTotalAmount();

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Total Income</h2>
        <p className="card-text text-center fs-2">
          <strong>{formatPriceWholeNumber(totalAmount)}</strong>
        </p>
      </div>
    </div>
  );
};

export default TotalIncomeSummary;
