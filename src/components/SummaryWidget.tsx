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
import { Transaction } from '../types/Transaction';

const SummaryWidget = () => {
  const { state: transactionState } = useTransaction();
  const { state: invoiceState } = useContext(InvoiceContext);
  const { transactions } = transactionState;
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

  const filterTransactionsByDynamicMonths = (monthsAgo: number): Transaction[] => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - monthsAgo, 1);

    return transactions.filter((transaction: Transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      return transactionDate >= startDate && transactionDate <= endDate && transaction.category === 'expense';
    });
  };

  const filterTransactions: (monthsAgo: number) => Transaction[] = (monthsAgo) =>
    filterTransactionsByDynamicMonths(monthsAgo);

  const previous12MonthsTransactions = filterTransactions(12);
  const previous24MonthsTransactions = filterTransactions(24);

  const expensesTotalPrevious12Months = previous12MonthsTransactions.reduce(
    (total: number, transaction: Transaction) => total + transaction.amount,
    0
  );
  const expensesTotalPrevious24Months = previous24MonthsTransactions.reduce(
    (total: number, transaction: Transaction) => total + transaction.amount,
    0
  );

  return (
    <div className="summary-main-container d-flex justify-content-between">
      <CashBalance transactions={[]} />
      <TotalIncomeSummary
        incomeTotalPrevious12Months={incomeTotalPrevious12Months}
        incomeTotalPrevious24Months={incomeTotalPrevious24Months}
        transactions={[]}
      />
      <TotalExpensesSummary
        expenseTotalPrevious12Months={expensesTotalPrevious12Months}
        expenseTotalPrevious24Months={expensesTotalPrevious24Months}
        transactions={[]}
      />
      <NetIncomeSummary
        incomeTotalPrevious12Months={incomeTotalPrevious12Months}
        incomeTotalPrevious24Months={incomeTotalPrevious24Months}
        expenseTotalPrevious12Months={expensesTotalPrevious12Months}
        expenseTotalPrevious24Months={expensesTotalPrevious24Months}
        transactions={[]}
      />
      <Last30Days transactions={transactionState.transactions} />
    </div>
  );
};

export default SummaryWidget;
