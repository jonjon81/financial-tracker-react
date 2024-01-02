import React, { useEffect, useState, useMemo } from 'react';
import { Invoice } from '../types/Invoice';
import { Transaction } from '../types/Transaction';
import { formatPrice } from '../utils/helpers';
import './InvoicesWidget.css';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { IoAddCircle } from 'react-icons/io5';
import { RxReset } from 'react-icons/rx';
import { FieldValues, useForm } from 'react-hook-form';
import { setInvoices, addInvoice, updateInvoice, deleteInvoice } from '../actions/invoiceActions';
import { useInvoice } from '../context/InvoiceContexts';
import TableHeader from './TableHeader';

interface InvoicesProps {
  transactions: Transaction[];
}

interface FormData {
  clientName: string;
  amount: string;
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
  const [referenceNumberError, setReferenceNumberError] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [filteredResultsLength, setFilteredResultsLength] = useState<number>(0);
  const [tableUpdateCounter, setTableUpdateCounter] = useState<number>(0);
  const [sortConfig, setSortConfig] = useState<{ column: ColumnHeader | null; direction: SortDirection }>({
    column: null,
    direction: SortDirection.ASC,
  });

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setStartDate('');
    setEndDate('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    reset();
    setReferenceNumberError('');
  };

  const openEditModal = (invoice: Invoice) => {
    setEditInvoice(invoice);
    setIsNewInvoice(false);

    if (invoice) {
      setValue('clientName', invoice.clientName);
      const amountAsString = invoice.amount.toFixed(2);
      setValue('amount', amountAsString);

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
    const isReferenceNumberExists = invoices.some((invoice) => invoice.referenceNumber === referenceNumber);
    const parsedAmount = parseFloat(amount);

    if (isReferenceNumberExists) {
      setReferenceNumberError('The invoice number already exists');
      return;
    }

    setReferenceNumberError('');

    const createdInvoice: Invoice = {
      clientName,
      creationDate: date,
      referenceNumber,
      amount: parsedAmount,
      status: 'UNPAID',
    };

    dispatch(addInvoice(createdInvoice));

    setShowModal(false);
    reset();
    setReferenceNumberError('');
  };

  const handleUpdateInvoice = (data: FormData) => {
    if (editInvoice) {
      const { referenceNumber, amount } = data;
      const isReferenceNumberExists = invoices.some(
        (invoice) =>
          invoice.referenceNumber.toLowerCase() === referenceNumber.toLowerCase() &&
          invoice.referenceNumber.toLowerCase() !== editInvoice.referenceNumber.toLowerCase()
      );

      if (isReferenceNumberExists) {
        setReferenceNumberError('The invoice number already exists');
        return;
      }

      setReferenceNumberError('');

      const parsedAmount = parseFloat(String(amount));

      if (isNaN(parsedAmount)) {
        console.error('Invalid amount');
        return;
      }

      const updatedEditedInvoice: Invoice = {
        ...editInvoice,
        clientName: data.clientName,
        amount: parsedAmount,
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
      setReferenceNumberError('');
      setTableUpdateCounter((prevCounter) => prevCounter + 1);
    } else {
      console.error('Invalid invoice data for update');
    }
  };

  const handleDeleteInvoice = (referenceNumberToDelete: string) => {
    dispatch(deleteInvoice(Number(referenceNumberToDelete)));
    const updatedInvoices = invoices.filter((invoice) => invoice.referenceNumber !== referenceNumberToDelete);
    dispatch(setInvoices(updatedInvoices));
    setShowModal(false);
    reset();
    setReferenceNumberError('');
    setTableUpdateCounter((prevCounter) => prevCounter + 1);
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
    console.log('Invoices or transactions updated');
  }, [invoices, transactions, dispatch, tableUpdateCounter]);

  const [activeColumn, setActiveColumn] = useState<ColumnHeader | null>(null);

  const sortTable = (column: ColumnHeader) => {
    const direction =
      sortConfig.column === column && sortConfig.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    setSortConfig({ column, direction });
    setActiveColumn(column);
  };

  const renderSortIcon = (column: ColumnHeader) => {
    if (activeColumn === column) {
      return sortConfig.direction === SortDirection.ASC ? <FaChevronUp /> : <FaChevronDown />;
    }
    return null;
  };

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const sortedInvoices = useMemo(() => {
    if (sortConfig.column !== null) {
      return [...invoices].sort((a, b) => {
        if (a[sortConfig.column!] < b[sortConfig.column!]) {
          return sortConfig.direction === SortDirection.DESC ? -1 : 1;
        }
        if (a[sortConfig.column!] > b[sortConfig.column!]) {
          return sortConfig.direction === SortDirection.DESC ? 1 : -1;
        }
        return 0;
      });
    }
    return invoices;
  }, [invoices, sortConfig]);

  const filteredInvoices = sortedInvoices.filter((invoice) => {
    const matchesSearchText =
      invoice.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      invoice.referenceNumber.toLowerCase().includes(searchText.toLowerCase());

    const isInDateRange =
      (!startDate || new Date(invoice.creationDate) >= new Date(startDate)) &&
      (!endDate || new Date(invoice.creationDate) <= new Date(endDate));

    if (searchText) {
      return matchesSearchText && isInDateRange;
    } else {
      return isInDateRange;
    }
  });

  useEffect(() => {
    setFilteredResultsLength(filteredInvoices.length);
    console.log('Filtered invoices updated');
  }, [filteredInvoices]);

  return (
    <div className="p-2 p-md-4 card">
      <div className="upper-container d-flex align-content-center justify-content-between flex-column flex-lg-row">
        <h2 className="mb-2 d-flex align-items-end">Invoices</h2>
        <div className="mb-2 d-flex align-items-end position-relative search-bar w-100 mx-lg-2">
          <FaSearch className="fa-search position-absolute fs-5" />
          <input
            className="form-control"
            type="text"
            placeholder="Search by Client or ID"
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </div>
        <div className="form-filter-container d-flex justify-content-between flex-wrap flex-md-nowrap">
          <div className="form-date-controls d-flex">
            <div className="mb-2">
              <label>Start Date:</label>
              <input
                className="form-control"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="mb-2 mx-2">
              <label>End Date:</label>
              <input
                className="form-control"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-button-controls d-flex align-items-end">
            <button className="btn btn-outline-secondary mb-2" onClick={handleResetFilters}>
              <RxReset className="fs-2" />
            </button>
            <button
              className="btn btn-outline-danger ms-2 mb-2"
              onClick={() => {
                setIsNewInvoice(true);
                setShowModal(true);
              }}
            >
              <IoAddCircle className="fs-2" />
            </button>
          </div>
        </div>
      </div>
      <div className="table-container overflow-auto">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>/ {filteredResultsLength}</th>
              <TableHeader
                column="creationDate"
                activeColumn={activeColumn}
                sortTable={sortTable}
                renderSortIcon={renderSortIcon}
              >
                Date
              </TableHeader>
              <TableHeader
                column="clientName"
                activeColumn={activeColumn}
                sortTable={sortTable}
                renderSortIcon={renderSortIcon}
              >
                Client
              </TableHeader>
              <TableHeader
                column="referenceNumber"
                activeColumn={activeColumn}
                sortTable={sortTable}
                renderSortIcon={renderSortIcon}
              >
                ID
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
        </table>
      </div>

      <div className="table-body">
        {filteredInvoices.length > 0 ? (
          <table className="table table-striped">
            <tbody>
              {filteredInvoices
                .slice()
                .reverse()
                .map((invoice, index) => (
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
                    <td className="text-capitalize">{invoice.clientName}</td>
                    <td className="text-uppercase">{invoice.referenceNumber}</td>
                    <td>{formatPrice(invoice.amount)}</td>
                    <td>{invoice.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="no-search-results">No search results found.</div>
        )}
      </div>
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
                        className="w-100 form-control"
                        type="text"
                        id="clientName"
                        {...register('clientName', { required: true, minLength: 3 })}
                      />
                      {errors.clientName?.type === 'required' && (
                        <p className="text-danger m-0">The client name field is required.</p>
                      )}
                      {errors.clientName?.type === 'minLength' && (
                        <p className="text-danger m-0">The client name must be at least 3 characters.</p>
                      )}
                    </div>
                  </label>
                  <label className="d-flex flex-column justify-content-between mb-2">
                    Amount
                    <div>
                      <input
                        className="w-100 form-control"
                        type="number"
                        step="0.01"
                        id="amount"
                        {...register('amount', { required: true })}
                      />
                      {errors.amount?.type === 'required' && <p className="text-danger m-0">The amount is required.</p>}
                    </div>
                  </label>
                  <label className="d-flex flex-column justify-content-between mb-2">
                    Date
                    <div>
                      <input
                        className="w-100 form-control"
                        type="date"
                        id="date"
                        {...register('date', { required: true })}
                      />
                      {errors.date?.type === 'required' && <p className="text-danger m-0">The date is required.</p>}
                    </div>
                  </label>
                  <label className="d-flex flex-column justify-content-between mb-2">
                    Reference Number
                    <div>
                      <input
                        className="w-100 form-control text-uppercase"
                        type="text"
                        id="referenceNumber"
                        placeholder="INV-####"
                        {...register('referenceNumber', { required: true })}
                      />
                      {errors.referenceNumber?.type === 'required' && (
                        <p className="text-danger m-0">This reference number is required.</p>
                      )}
                      {referenceNumberError && <p className="text-danger m-0">{referenceNumberError}</p>}
                    </div>
                  </label>
                </>
              ) : (
                <>
                  <label className="d-flex flex-column justify-content-between mb-2">
                    Client Name:
                    <div>
                      <input
                        className="w-100 form-control"
                        type="text"
                        id="editClientName"
                        {...register('clientName', { required: true, minLength: 3 })}
                      />
                      {errors.clientName?.type === 'required' && (
                        <p className="text-danger m-0">The client name field is required.</p>
                      )}
                      {errors.clientName?.type === 'minLength' && (
                        <p className="text-danger m-0">The client name must be at least 3 characters.</p>
                      )}
                    </div>
                  </label>
                  <label className="d-flex flex-column justify-content-between mb-2">
                    Amount
                    <div>
                      <input
                        className="w-100 form-control"
                        type="number"
                        step="0.01"
                        id="amount"
                        {...register('amount', { required: true })}
                      />
                      {errors.amount?.type === 'required' && <p className="text-danger m-0">The amount is required.</p>}
                    </div>
                  </label>
                  <label className="d-flex flex-column justify-content-between mb-2">
                    Date
                    <div>
                      <input
                        className="w-100 form-control"
                        type="date"
                        id="date"
                        {...register('date', { required: true })}
                      />
                      {errors.date?.type === 'required' && <p className="text-danger m-0">The date is required.</p>}
                    </div>
                  </label>
                  <label className="d-flex flex-column justify-content-between mb-2">
                    Reference Number
                    <div>
                      <input
                        className="w-100 text-uppercase form-control"
                        type="text"
                        id="referenceNumber"
                        placeholder="INV-####"
                        {...register('referenceNumber', { required: true })}
                      />
                      {errors.referenceNumber?.type === 'required' && (
                        <p className="text-danger m-0">This reference number is required.</p>
                      )}
                      {referenceNumberError && <p className="text-danger m-0">{referenceNumberError}</p>}
                    </div>
                  </label>
                </>
              )}

              <button className="mt-2 w-100 btn btn-primary" type="submit">
                {isNewInvoice ? 'Create Invoice' : 'Update Invoice'}
              </button>
              {!isNewInvoice && editInvoice && (
                <button
                  className="btn btn-danger mt-2 w-100"
                  onClick={() => handleDeleteInvoice(editInvoice.referenceNumber)}
                >
                  Delete Invoice
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesWidget;
