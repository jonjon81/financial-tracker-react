import CashBalance from './CashBalance';
import TotalIncomeSummary from './TotalIncomeSummary';
import TotalExpensesSummary from './TotalExpensesSummary';
import Last30Days from './Last30Days';
import { useTransaction } from '../context/TransactionContexts';
import './SummaryWidget.css';
import NetIncomeSummary from './NetIncomeSummary';
import { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContexts';
import { Invoice } from '../types/Invoice';

const SummaryWidget = () => {
  const { state: transactionState } = useTransaction();
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

  const incomeTotalPrevious12Months = previous12MonthsInvoices.reduce(
    (total: number, invoice: Invoice) => total + invoice.amount,
    0
  );
  const incomeTotalPrevious24Months = previous24MonthsInvoices.reduce(
    (total: number, invoice: Invoice) => total + invoice.amount,
    0
  );

  return (
    <div className="summary-main-container d-flex justify-content-between">
      <CashBalance transactions={[]} />
      <TotalIncomeSummary transactions={[]} />
      <TotalExpensesSummary transactions={[]} />
      <NetIncomeSummary
        incomeTotalPrevious12Months={incomeTotalPrevious12Months}
        incomeTotalPrevious24Months={incomeTotalPrevious24Months}
        transactions={[]}
      />
      <Last30Days transactions={transactionState.transactions} />
    </div>
  );
};

export default SummaryWidget;
