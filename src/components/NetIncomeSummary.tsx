import React, { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContexts';
import { Invoice } from '../types/Invoice';
import { formatPriceWholeNumber } from '../utils/helpers';

interface SummaryProps {
  transactions: Invoice[];
}

const NetIncomeSummary: React.FC<SummaryProps> = () => {
  const { state: invoiceState } = useContext(InvoiceContext);
  const { invoices } = invoiceState;

  const filterInvoicesByDynamicMonths = (monthsAgo: number): Invoice[] => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - monthsAgo, 1);

    return invoices.filter((invoice: Invoice) => {
      const invoiceDate = new Date(invoice.creationDate);
      return invoiceDate >= startDate && invoiceDate <= endDate;
    });
  };

  const previous12MonthsInvoices = filterInvoicesByDynamicMonths(12);
  const previous24MonthsInvoices = filterInvoicesByDynamicMonths(24);

  const totalPrevious12Months = previous12MonthsInvoices.reduce(
    (total: number, invoice: Invoice) => total + invoice.amount,
    0
  );
  const totalPrevious24Months = previous24MonthsInvoices.reduce(
    (total: number, invoice: Invoice) => total + invoice.amount,
    0
  );

  const difference = totalPrevious12Months - totalPrevious24Months;
  const differencePercentage =
    totalPrevious24Months !== 0 ? ((difference / totalPrevious24Months) * 100).toFixed(2) : 'N/A';

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Net Income</h2>
        <p className="card-text text-center fs-2">
          <span className="ms-1">
            <strong>{formatPriceWholeNumber(totalPrevious12Months)}</strong>
          </span>
          <br />
          <span className="ms-1 d-flex flex-column" style={{ fontSize: '12px' }}>
            {difference < 0 ? (
              <span className="text-danger">-{Math.abs(Number(differencePercentage))}%</span>
            ) : (
              <span className="text-success">+{Number(differencePercentage)}%</span>
            )}
            previous 12 months
          </span>
        </p>
      </div>
    </div>
  );
};

export default NetIncomeSummary;
