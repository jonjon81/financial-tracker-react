import React, { useEffect, useState } from 'react';
import { Invoice } from '../types/Invoice';
import { Transaction } from '../types/Transaction';
import { formatPrice } from '../utils/helpers';
import './InvoicesWidget.css';
import { FaChevronDown } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa';
import { FieldValues, useForm } from 'react-hook-form';

interface InvoicesProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  transactions: Transaction[];
}

interface FormData {
  clientName: string;
  amount: number;
  date: string;
  referenceNumber: string;
}

enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

type ColumnHeader = keyof Invoice;

const InvoicesWidget: React.FC<InvoicesProps> = ({ invoices, setInvoices, transactions }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FieldValues) => {
    const { clientName, amount, date, referenceNumber } = data;

    const createdInvoice: Invoice = {
      clientName,
      creationDate: date,
      referenceNumber,
      amount,
      status: 'UNPAID',
    };

    const updatedInvoices = [...invoices, createdInvoice];
    setInvoices(updatedInvoices);

    setShowModal(false);
    reset();
  };

  const [sortConfig, setSortConfig] = useState<{ column: ColumnHeader | null; direction: SortDirection }>({
    column: null,
    direction: SortDirection.ASC,
  });

  const openEditModal = (invoice: Invoice) => {
    setEditInvoice(invoice);
  };

  const [editInvoice, setEditInvoice] = useState<Partial<Invoice> | null>(null);

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

  const [activeColumn, setActiveColumn] = useState<ColumnHeader | null>(null);

  // Function to handle sorting
  const sortTable = (column: ColumnHeader) => {
    const direction =
      sortConfig.column === column && sortConfig.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    setSortConfig({ column, direction });
    setActiveColumn(column);

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

  const renderSortIcon = (column: ColumnHeader) => {
    if (activeColumn === column) {
      return sortConfig.direction === SortDirection.ASC ? <FaChevronUp /> : <FaChevronDown />;
    }
    return null;
  };

  return (
    <div className="p-4 card">
      <div className="upper-container d-flex align-content-center justify-content-between">
        <h2>Latest Transactions</h2>
        <button className="mb-2 btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Invoice
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th scope="col" className={activeColumn === 'creationDate' ? 'active' : ''}>
              <button className="btn btn-primary" onClick={() => sortTable('creationDate')}>
                Creation Date {activeColumn === 'creationDate' && renderSortIcon('creationDate')}
              </button>
            </th>
            <th scope="col" className={activeColumn === 'clientName' ? 'active' : ''}>
              <button className="btn btn-primary" onClick={() => sortTable('clientName')}>
                Client Name {activeColumn === 'clientName' && renderSortIcon('clientName')}
              </button>
            </th>
            <th scope="col" className={activeColumn === 'referenceNumber' ? 'active' : ''}>
              <button className="btn btn-primary" onClick={() => sortTable('referenceNumber')}>
                Reference Number {activeColumn === 'referenceNumber' && renderSortIcon('referenceNumber')}
              </button>
            </th>
            <th scope="col" className={activeColumn === 'amount' ? 'active' : ''}>
              <button className="btn btn-primary" onClick={() => sortTable('amount')}>
                Amount {activeColumn === 'amount' && renderSortIcon('amount')}
              </button>
            </th>
            <th scope="col" className={activeColumn === 'status' ? 'active' : ''}>
              <button className="btn btn-primary" onClick={() => sortTable('status')}>
                Status {activeColumn === 'status' && renderSortIcon('status')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr
              className="table-row"
              key={invoice.referenceNumber}
              onClick={() => openEditModal(invoice)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  openEditModal(invoice);
                }
              }}
              tabIndex={0}
              aria-label={`Edit invoice ${index + 1}`}
              role="button"
            >
              <th scope="row">{index + 1}</th>
              <td>{invoice.creationDate}</td>
              <td>{invoice.clientName}</td>
              <td>{invoice.referenceNumber}</td>
              <td>{formatPrice(invoice.amount)}</td>
              <td>{invoice.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal d-flex justify-content-center align-items-center" onClick={() => handleCloseModal()}>
          <div className="modal-content" style={{ width: '400px', height: 'auto', padding: '1rem' }}>
            <div className="button-container d-flex justify-content-end">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => handleCloseModal()}
              ></button>
            </div>
            <h2 className="mb-4">Add New Invoice</h2>
            <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit(onSubmit)}>
              <label className="d-flex flex-column justify-content-between mb-2">
                Client Name:
                <div>
                  <input
                    className="w-100"
                    type="text"
                    id="clientName"
                    {...register('clientName', { required: true, minLength: 3 })}
                  />
                  {errors.clientName?.type === 'required' && (
                    <p className="text-danger">The client name field is required.</p>
                  )}
                  {errors.clientName?.type === 'minLength' && (
                    <p className="text-danger">The client name must be at least 3 characters.</p>
                  )}
                </div>
              </label>
              <label className="d-flex flex-column justify-content-between mb-2">
                Amount
                <div>
                  <input
                    className="w-100"
                    type="number"
                    step="0.01"
                    id="amount"
                    {...register('amount', { required: true })}
                  />
                  {errors.amount?.type === 'required' && <p className="text-danger">The amount is required.</p>}
                </div>
              </label>
              <label className="d-flex flex-column justify-content-between mb-2">
                Date
                <div>
                  <input className="w-100" type="date" id="date" {...register('date', { required: true })} />
                  {errors.date?.type === 'required' && <p className="text-danger">The date is required.</p>}
                </div>
              </label>
              <label className="d-flex flex-column justify-content-between mb-2">
                Reference Number
                <div>
                  <input
                    className="w-100"
                    type="text"
                    id="referenceNumber"
                    {...register('referenceNumber', { required: true })}
                  />
                  {errors.referenceNumber?.type === 'required' && (
                    <p className="text-danger">The reference number is required.</p>
                  )}
                </div>
              </label>
              <button className="mt-2 w-100 btn btn-primary" type="submit">
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      )}
      {editInvoice && (
        <div className="modal d-flex justify-content-center align-items-center" onClick={() => setEditInvoice(null)}>
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
