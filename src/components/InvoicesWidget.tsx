import React, { useEffect, useState } from 'react';
import { Invoice } from '../types/Invoice';
import { Transaction } from '../types/Transaction';
import { formatPrice } from '../utils/helpers';
import './InvoicesWidget.css';

interface InvoicesProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  transactions: Transaction[];
}

enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

type ColumnHeader = keyof Invoice;

const InvoicesWidget: React.FC<InvoicesProps> = ({ invoices, setInvoices, transactions }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    clientName: '',
    creationDate: '',
    referenceNumber: '',
    amount: 0,
    status: 'UNPAID',
  });

  const [sortConfig, setSortConfig] = useState<{ column: ColumnHeader | null; direction: SortDirection }>({
    column: null,
    direction: SortDirection.ASC,
  });

  const openEditModal = (invoice: Invoice) => {
    setEditInvoice(invoice);
  };

  const [editInvoice, setEditInvoice] = useState<Partial<Invoice> | null>(null);

  const handleCreateInvoice = () => {
    if (newInvoice.clientName && newInvoice.creationDate && newInvoice.referenceNumber && newInvoice.amount) {
      const createdInvoice: Invoice = {
        clientName: newInvoice.clientName,
        creationDate: newInvoice.creationDate,
        referenceNumber: newInvoice.referenceNumber,
        amount: newInvoice.amount,
        status: 'UNPAID',
      };

      const updatedInvoices = [...invoices, createdInvoice];
      setInvoices(updatedInvoices);

      setShowModal(false);
      setNewInvoice({
        clientName: '',
        creationDate: '',
        referenceNumber: '',
        amount: 0,
        status: 'UNPAID',
      });
    }
  };

  const handleUpdateInvoice = () => {
    if (editInvoice) {
      const updatedInvoices = invoices.map((invoice) =>
        invoice.referenceNumber === editInvoice.referenceNumber ? { ...invoice, ...editInvoice } : invoice
      );

      setInvoices(updatedInvoices);
      setEditInvoice(null);
    }
  };

  useEffect(() => {
    const updatedInvoices = invoices.map((invoice) => {
      const matchedTransaction = transactions.find(
        (transaction) =>
          new Date(transaction.transactionDate) > new Date(invoice.creationDate) &&
          transaction.amount === invoice.amount &&
          transaction.referenceNumber === invoice.referenceNumber
      );

      return {
        ...invoice,
        status: matchedTransaction ? 'PAID' : 'UNPAID',
      };
    });

    const statusesChanged = updatedInvoices.some((invoice, index) => invoice.status !== invoices[index].status);

    if (statusesChanged) {
      setInvoices(updatedInvoices);
    }
  }, [invoices, transactions, setInvoices]);

  const sortTable = (column: ColumnHeader) => {
    const direction =
      sortConfig.column === column && sortConfig.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    setSortConfig({ column, direction });

    const sortedInvoices = [...invoices].sort((a, b) => {
      if (a[column] < b[column]) {
        return direction === SortDirection.ASC ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return direction === SortDirection.ASC ? 1 : -1;
      }
      return 0;
    });

    setInvoices(sortedInvoices);
  };

  return (
    <div className="p-4 bg-primary-subtle rounded">
      <div className="upper-container d-flex align-content-center justify-content-between">
        <h2>Invoices</h2>
        <button className="mb-2 btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Invoice
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th scope="col" onClick={() => sortTable('clientName')}>
              Client Name
            </th>
            <th scope="col" onClick={() => sortTable('creationDate')}>
              Creation Date
            </th>
            <th scope="col" onClick={() => sortTable('referenceNumber')}>
              Reference Number
            </th>
            <th scope="col" onClick={() => sortTable('amount')}>
              Amount
            </th>
            <th scope="col" onClick={() => sortTable('status')}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr className="table-row" key={invoice.referenceNumber} onClick={() => openEditModal(invoice)}>
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
      {showModal && (
        <div className="modal bg-dark-subtle d-flex justify-content-center align-items-center">
          <div className="modal-content" style={{ width: '400px', height: 'auto', padding: '1rem' }}>
            <div className="button-container d-flex justify-content-end">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <h2 className="mb-4">Add New Invoice</h2>
            <form onClick={(e) => e.stopPropagation()} onSubmit={handleCreateInvoice}>
              <label className="d-flex justify-content-between mb-2">
                Client Name:
                <input
                  className="w-50"
                  type="text"
                  required
                  value={newInvoice.clientName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
                />
              </label>
              <label className="d-flex justify-content-between mb-2">
                Amount
                <input
                  className="w-50"
                  type="number"
                  required
                  value={newInvoice.amount}
                  step="0.01"
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: parseFloat(e.target.value) })}
                />
              </label>
              <label className="d-flex justify-content-between mb-2">
                Date
                <input
                  className="w-50"
                  type="date"
                  required
                  value={newInvoice.creationDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, creationDate: e.target.value })}
                />
              </label>
              <label className="d-flex justify-content-between mb-2">
                Reference Number
                <input
                  className="w-50"
                  type="text"
                  required
                  value={newInvoice.referenceNumber}
                  onChange={(e) => setNewInvoice({ ...newInvoice, referenceNumber: e.target.value })}
                />
              </label>
              <button className="mt-2 w-100 btn btn-primary" type="submit">
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      )}
      {editInvoice && (
        <div className="modal bg-dark-subtle d-flex justify-content-center align-items-center">
          <div className="modal-content" style={{ width: '400px', height: 'auto', padding: '1rem' }}>
            <div className="button-container d-flex justify-content-end">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setEditInvoice(null)}
              ></button>
            </div>
            <h2 className="mb-4">Update Invoice</h2>
            <form onClick={(e) => e.stopPropagation()} onSubmit={handleUpdateInvoice}>
              <label className="d-flex justify-content-between mb-2">
                Client Name:
                <input
                  className="w-50"
                  type="text"
                  required
                  value={editInvoice.clientName}
                  onChange={(e) => setEditInvoice({ ...editInvoice, clientName: e.target.value })}
                />
              </label>
              <label className="d-flex justify-content-between mb-2">
                Creation Date:
                <input
                  className="w-50"
                  type="date"
                  required
                  value={editInvoice.creationDate}
                  onChange={(e) => setEditInvoice({ ...editInvoice, creationDate: e.target.value })}
                />
              </label>
              <label className="d-flex justify-content-between mb-2">
                Amount:
                <input
                  className="w-50"
                  type="number"
                  required
                  value={editInvoice.amount}
                  step="0.01"
                  onChange={(e) => setEditInvoice({ ...editInvoice, amount: parseFloat(e.target.value) })}
                />
              </label>
              <button className="mt-2 w-100 btn btn-primary" type="submit">
                Update Invoice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesWidget;
