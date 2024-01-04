import React, { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContexts';
import { Invoice } from '../types/Invoice';

interface SummaryProps {
  invoices: Invoice[];
}

const InvoicesLast30: React.FC<SummaryProps> = () => {
  const { state: invoiceState } = useContext(InvoiceContext);

  const { invoices } = invoiceState;

  // Filter invoices within the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const invoicesLast30Days = invoices.filter((invoice) => new Date(invoice.creationDate) > thirtyDaysAgo).length;

  return (
    <div className="card bg-light w-100 mb-2 me-2 last-30-days">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Invoices last 30 days</h2>
        <p className="card-text text-center fs-2">
          <strong>{invoicesLast30Days}</strong>
        </p>
      </div>
    </div>
  );
};

export default InvoicesLast30;
