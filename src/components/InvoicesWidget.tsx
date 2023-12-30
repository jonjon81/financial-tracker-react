import React, { useEffect, useState } from 'react';
import { Invoice } from '../types/Invoice';
import { Transaction } from '../types/Transaction';
import { formatPrice } from '../utils/helpers';
import './InvoicesWidget.css';
import { FaChevronDown } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa';
import { FieldValues, useForm } from 'react-hook-form';
import { setInvoices, addInvoice, updateInvoice } from '../actions/invoiceActions';
import { useInvoice } from '../context/InvoiceContexts';
import TableHeader from './TableHeader';

interface InvoicesProps {
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

const InvoicesWidget: React.FC<InvoicesProps> = ({ transactions }) => {
  const { state, dispatch } = useInvoice();
  const { invoices } = state;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [isNewInvoice, setIsNewInvoice] = useState<boolean>(false);

  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };

  const openEditModal = (invoice: Invoice) => {
    setEditInvoice(invoice);
    setIsNewInvoice(false);

    if (invoice) {
      setValue('clientName', invoice.clientName);
      setValue('amount', invoice.amount);
      setValue('date', invoice.creationDate);
      setValue('referenceNumber', invoice.referenceNumber);
    }

    setShowModal(true);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

    dispatch(addInvoice(createdInvoice));

    setShowModal(false);
    reset();
  };

  const [sortConfig, setSortConfig] = useState<{ column: ColumnHeader | null; direction: SortDirection }>({
    column: null,
    direction: SortDirection.ASC,
  });

  const handleUpdateInvoice = (data: FormData) => {
    if (editInvoice) {
      const updatedEditedInvoice: Invoice = {
        ...editInvoice,
        clientName: data.clientName,
        amount: data.amount,
        creationDate: data.date,
        referenceNumber: data.referenceNumber,
      };

      const updatedInvoices = invoices.map((invoice) =>
        invoice.referenceNumber === editInvoice.referenceNumber ? updatedEditedInvoice : invoice
      );

      dispatch(setInvoices(updatedInvoices));
      dispatch(updateInvoice(updatedEditedInvoice));
      setShowModal(false);
      reset();
    } else {
      console.error('Invalid invoice data for update');
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
      dispatch(setInvoices(updatedInvoices));
    }
  }, [invoices, transactions, dispatch]);

  const [activeColumn, setActiveColumn] = useState<ColumnHeader | null>(null);

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

    dispatch(setInvoices(sortedInvoices));
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
        <button
          className="mb-2 btn btn-primary"
          onClick={() => {
            setIsNewInvoice(true);
            setShowModal(true);
          }}
        >
          Add New Invoice
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <TableHeader
              column="creationDate"
              activeColumn={activeColumn}
              sortTable={sortTable}
              renderSortIcon={renderSortIcon}
            >
              Creation Date
            </TableHeader>
            <TableHeader
              column="clientName"
              activeColumn={activeColumn}
              sortTable={sortTable}
              renderSortIcon={renderSortIcon}
            >
              Client Name
            </TableHeader>
            <TableHeader
              column="referenceNumber"
              activeColumn={activeColumn}
              sortTable={sortTable}
              renderSortIcon={renderSortIcon}
            >
              Reference Number
            </TableHeader>
            <TableHeader
              column="amount"
              activeColumn={activeColumn}
              sortTable={sortTable}
              renderSortIcon={renderSortIcon}
            >
              Amount
            </TableHeader>
            <TableHeader
              column="status"
              activeColumn={activeColumn}
              sortTable={sortTable}
              renderSortIcon={renderSortIcon}
            >
              Status
            </TableHeader>
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
            <h2 className="mb-4">{isNewInvoice ? 'Add New Invoice' : 'Update Invoice'}</h2>
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={isNewInvoice ? handleSubmit(onSubmit) : handleSubmit(handleUpdateInvoice)}
            >
              {isNewInvoice ? (
                <>
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
                </>
              ) : (
                <>
                  <label className="d-flex flex-column justify-content-between mb-2">
                    Client Name:
                    <div>
                      <input
                        className="w-100"
                        type="text"
                        id="editClientName"
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
                </>
              )}
              <button className="mt-2 w-100 btn btn-primary" type="submit">
                {isNewInvoice ? 'Create Invoice' : 'Update Invoice'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesWidget;
