import React, { useState, useEffect } from 'react';
import { fetchInvoices, fetchTransactions } from '../services/mockBackend';
import { Invoice } from '../types/Invoice';
import { formatPrice } from '../utils/helpers';

const InvoicesWidget: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoicesData = await fetchInvoices();
        const transactionsData = await fetchTransactions();

        const updatedInvoices = invoicesData.map((invoice) => {
          const relatedTransactions = transactionsData.filter(
            (transaction) =>
              transaction.referenceNumber === invoice.referenceNumber && transaction.amount === invoice.amount
          );

          if (relatedTransactions.length > 0) {
            const latestTransaction = relatedTransactions.reduce((prev, current) => {
              return new Date(current.transactionDate) > new Date(prev.transactionDate) ? current : prev;
            });

            if (new Date(latestTransaction.transactionDate) > new Date(invoice.creationDate)) {
              return { ...invoice, status: 'PAID' };
            } else {
              return { ...invoice, status: 'UNPAID' };
            }
          } else {
            return { ...invoice, status: 'UNPAID' };
          }
        });

        setInvoices(updatedInvoices);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p- bg-primary-subtle rounded">
      <h2>Invoices</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Client Name</th>
            <th scope="col">Creation Date</th>
            <th scope="col">Reference Number</th>
            <th scope="col">Amount</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={invoice.referenceNumber}>
              <th scope="row">{index + 1}</th>
              <td>{invoice.clientName}</td>
              <td>{invoice.creationDate}</td>
              <td>{invoice.referenceNumber}</td>
              <td>{formatPrice(invoice.amount)}</td>
              <td>{invoice.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesWidget;
