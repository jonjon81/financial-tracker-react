import CashBalance from './CashBalance';
import TotalIncomeSummary from './TotalIncomeSummary';
import TotalExpensesSummary from './TotalExpensesSummary';
import InvoicesLast30 from './InvoicesLast30';
import BillsLast30 from './BillsLast30';
import { useBill } from '../context/BillContexts';
import './SummaryWidget.css';
import NetIncomeSummary from './NetIncomeSummary';
import { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContexts';
import { Invoice } from '../types/Invoice';
import { Bill } from '../types/Bill';

const SummaryWidget = () => {
  const { state: billState } = useBill();
  const { state: invoiceState } = useContext(InvoiceContext);
  const { bills } = billState;
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

  const filterBillsByDynamicMonths = (monthsAgo: number): Bill[] => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - monthsAgo, 1);

    return bills.filter((bill: Bill) => {
      const billDate = new Date(bill.creationDate);
      return billDate >= startDate && billDate <= endDate && bill.category === 'bill';
    });
  };

  const filterBills: (monthsAgo: number) => Bill[] = (monthsAgo) => filterBillsByDynamicMonths(monthsAgo);

  const previous12MonthsBills = filterBills(12);
  const previous24MonthsBills = filterBills(24);
  const expensesTotalPrevious12Months = previous12MonthsBills.reduce(
    (total: number, bill: Bill) => total + bill.amount,
    0
  );
  const expensesTotalPrevious24Months = previous24MonthsBills.reduce(
    (total: number, bill: Bill) => total + bill.amount,
    0
  );

  return (
    <>
      {' '}
      <div className="summary-main-container d-flex justify-content-between">
        <CashBalance transactions={[]} />
        <TotalIncomeSummary
          incomeTotalPrevious12Months={incomeTotalPrevious12Months}
          incomeTotalPrevious24Months={incomeTotalPrevious24Months}
          invoices={[]}
        />
        <TotalExpensesSummary
          expenseTotalPrevious12Months={expensesTotalPrevious12Months}
          expenseTotalPrevious24Months={expensesTotalPrevious24Months}
          bills={[]}
        />
        <NetIncomeSummary
          incomeTotalPrevious12Months={incomeTotalPrevious12Months}
          incomeTotalPrevious24Months={incomeTotalPrevious24Months}
          expenseTotalPrevious12Months={expensesTotalPrevious12Months}
          expenseTotalPrevious24Months={expensesTotalPrevious24Months}
          transactions={[]}
        />
      </div>
      <div className="row-2 d-flex">
        <InvoicesLast30 invoices={[]} />
        <BillsLast30 bills={[]} />
      </div>
    </>
  );
};

export default SummaryWidget;
