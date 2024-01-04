import React, { useEffect, useState, useMemo } from 'react';
import { Invoice } from '../types/Invoice';
import { Bill } from '../types/Bill';
import { Transaction } from '../types/Transaction';
import { formatPrice } from '../utils/helpers';
import './InvoicesWidget.css';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { IoAddCircle } from 'react-icons/io5';
import { RxReset } from 'react-icons/rx';
import { FieldValues, useForm } from 'react-hook-form';
import { setInvoices, addInvoice, updateInvoice, deleteInvoice } from '../actions/invoiceActions';
import { setBills, addBill, updateBill, deleteBill } from '../actions/billActions';
import { useInvoice } from '../context/InvoiceContexts';
import { useBill } from '../context/BillContexts';
import TableHeaderInvoice from './TableHeaderInvoice';
import TableHeaderBill from './TableHeaderBill';

interface InvoicesProps {
  transactions: Transaction[];
}

interface FormData {
  vendor: string;
  clientName: string;
  amount: string;
  date: string;
  referenceNumber: string;
}

enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

const InvoicesWidget: React.FC<InvoicesProps> = ({ transactions }) => {
  const [activeDataType, setActiveDataType] = useState<'invoices' | 'bills'>('invoices');
  const { dispatch: invoiceDispatch } = useInvoice();
  const { dispatch: billDispatch } = useBill();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [editBill, setEditBill] = useState<Bill | null>(null);
  const [isNewInvoice, setIsNewInvoice] = useState<boolean>(false);
  const [isNewBill, setIsNewBill] = useState<boolean>(false);
  const [referenceNumberError, setReferenceNumberError] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [filteredInvoiceResultsLength, setFilteredInvoiceResultsLength] = useState<number>(0);
  const [filteredBillResultsLength, setFilteredBillResultsLength] = useState<number>(0);
  const [tableUpdateCounter, setTableUpdateCounter] = useState<number>(0);

  type ColumnHeaderInvoice = keyof Invoice;
  type ColumnHeaderBill = keyof Bill;
  const [sortInvoiceConfig, setSortInvoiceConfig] = useState<{
    column: ColumnHeaderInvoice | null;
    direction: SortDirection;
  }>({
    column: null,
    direction: SortDirection.ASC,
  });

  const [sortBillConfig, setSortBillConfig] = useState<{ column: ColumnHeaderBill | null; direction: SortDirection }>({
    column: null,
    direction: SortDirection.ASC,
  });

  const { state: invoiceState } = useInvoice();
  const { invoices } = invoiceState;

  const { state: billState } = useBill();
  const { bills } = billState;
  const MIN_SEARCH_LENGTH = 3;

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
    setEditBill(null);
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

  const openBillEditModal = (bill: Bill) => {
    setEditInvoice(null);
    setEditBill(bill);
    setIsNewBill(false);

    if (bill) {
      setValue('clientName', bill.vendor);
      const amountAsString = bill.amount.toFixed(2);
      setValue('amount', amountAsString);

      setValue('date', bill.creationDate);
      setValue('referenceNumber', bill.referenceNumber);
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
      category: 'invoice',
    };

    invoiceDispatch(addInvoice(createdInvoice));

    setShowModal(false);
    reset();
    setReferenceNumberError('');
  };

  const onSubmitBill = (data: FieldValues) => {
    const { vendor, amount, date, referenceNumber } = data;
    const isReferenceNumberExists = bills.some((bill) => bill.referenceNumber === referenceNumber);
    const parsedAmount = parseFloat(amount);

    if (isReferenceNumberExists) {
      setReferenceNumberError('The bill number already exists');
      return;
    }

    setReferenceNumberError('');

    const createdBill: Bill = {
      vendor,
      creationDate: date,
      referenceNumber,
      amount: parsedAmount,
      status: 'UNPAID',
      category: 'expense',
    };

    billDispatch(addBill(createdBill));

    setShowModal(false);
    reset();
    setReferenceNumberError('');
  };

  const handleToggleInvoiceData = () => {
    setActiveDataType('invoices');
    console.log('INVOICES');
    console.log('editBill', editBill);
    console.log('editInvoice', editInvoice);
    console.log('isNewInvoice', isNewInvoice);
    console.log('isNewBill', isNewBill);
  };

  const handleToggleBillData = () => {
    setActiveDataType('bills');
    console.log('BILLS');
    console.log('editBill', editBill);
    console.log('editInvoice', editInvoice);
    console.log('isNewInvoice', isNewInvoice);
    console.log('isNewBill', isNewBill);
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

      invoiceDispatch(setInvoices(updatedInvoices));
      invoiceDispatch(updateInvoice(updatedEditedInvoice));
      setShowModal(false);
      reset();
      setReferenceNumberError('');
      setTableUpdateCounter((prevCounter) => prevCounter + 1);
    } else {
      console.error('Invalid invoice data for update');
    }
  };

  const handleUpdateBill = (data: FormData) => {
    if (editBill) {
      const { referenceNumber, amount } = data;
      const isReferenceNumberExists = bills.some(
        (bill) =>
          bill.referenceNumber.toLowerCase() === referenceNumber.toLowerCase() &&
          bill.referenceNumber.toLowerCase() !== editBill.referenceNumber.toLowerCase()
      );

      if (isReferenceNumberExists) {
        setReferenceNumberError('The bill number already exists');
        return;
      }

      setReferenceNumberError('');

      const parsedAmount = parseFloat(String(amount));

      if (isNaN(parsedAmount)) {
        console.error('Invalid amount');
        return;
      }

      const updatedEditedBill: Bill = {
        ...editBill,
        vendor: data.vendor,
        amount: parsedAmount,
        creationDate: data.date,
        referenceNumber: data.referenceNumber,
      };

      const updatedBills = bills.map((bill) =>
        bill.referenceNumber === editBill.referenceNumber ? updatedEditedBill : bill
      );

      billDispatch(setBills(updatedBills));
      billDispatch(updateBill(updatedEditedBill));
      setShowModal(false);
      reset();
      setReferenceNumberError('');
      setTableUpdateCounter((prevCounter) => prevCounter + 1);
    } else {
      console.error('Invalid bill data for update');
    }
  };

  const handleDeleteInvoice = (referenceNumberToDelete: string) => {
    invoiceDispatch(deleteInvoice(Number(referenceNumberToDelete)));
    const updatedInvoices = invoices.filter((invoice) => invoice.referenceNumber !== referenceNumberToDelete);
    invoiceDispatch(setInvoices(updatedInvoices));
    setShowModal(false);
    reset();
    setReferenceNumberError('');
    setTableUpdateCounter((prevCounter) => prevCounter + 1);
  };

  const handleDeleteBill = (referenceNumberToDelete: string) => {
    billDispatch(deleteBill(Number(referenceNumberToDelete)));
    const updatedBills = bills.filter((invoice) => invoice.referenceNumber !== referenceNumberToDelete);
    billDispatch(setBills(updatedBills));
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
      invoiceDispatch(setInvoices(updatedInvoices));
    }
  }, [invoices, transactions, invoiceDispatch, tableUpdateCounter]);

  const [activeInvoiceColumn, setActiveInvoiceColumn] = useState<ColumnHeaderInvoice | null>(null);
  const [activeBillColumn, setActiveBillColumn] = useState<ColumnHeaderBill | null>(null);

  const sortInvoiceTable = (column: ColumnHeaderInvoice) => {
    const direction =
      sortInvoiceConfig.column === column && sortInvoiceConfig.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    setSortInvoiceConfig({ column, direction });
    setActiveInvoiceColumn(column);
  };

  const sortBillTable = (column: ColumnHeaderBill) => {
    console.log('sortBillTable');
    const direction =
      sortBillConfig.column === column && sortBillConfig.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    setSortBillConfig({ column, direction });
    setActiveBillColumn(column);

    console.log('direction', direction);
    console.log('column', column);
  };

  const renderSortInvoiceIcon = (column: ColumnHeaderInvoice) => {
    if (activeInvoiceColumn === column) {
      return sortInvoiceConfig.direction === SortDirection.ASC ? <FaChevronUp /> : <FaChevronDown />;
    }
    return null;
  };

  const renderSortBillIcon = (column: ColumnHeaderBill) => {
    if (activeInvoiceColumn === column) {
      return sortBillConfig.direction === SortDirection.ASC ? <FaChevronUp /> : <FaChevronDown />;
    }
    return null;
  };

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const sortedInvoices = useMemo(() => {
    if (sortInvoiceConfig.column !== null) {
      return [...invoices].sort((a, b) => {
        if (a[sortInvoiceConfig.column!] < b[sortInvoiceConfig.column!]) {
          return sortInvoiceConfig.direction === SortDirection.DESC ? -1 : 1;
        }
        if (a[sortInvoiceConfig.column!] > b[sortInvoiceConfig.column!]) {
          return sortInvoiceConfig.direction === SortDirection.DESC ? 1 : -1;
        }
        return 0;
      });
    }
    return invoices;
  }, [invoices, sortInvoiceConfig]);

  const sortedBills = useMemo(() => {
    console.log('sortedBills in useMemo');
    if (sortBillConfig.column !== null) {
      return [...bills].sort((a, b) => {
        if (a[sortBillConfig.column!] < b[sortBillConfig.column!]) {
          return sortBillConfig.direction === SortDirection.DESC ? -1 : 1;
        }
        if (a[sortBillConfig.column!] > b[sortBillConfig.column!]) {
          return sortBillConfig.direction === SortDirection.DESC ? 1 : -1;
        }
        return 0;
      });
    }
    return bills;
    console.log('bills', bills);
  }, [bills, sortBillConfig]);

  const filteredInvoices = sortedInvoices.filter((invoice) => {
    const matchesSearchText =
      invoice.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      invoice.referenceNumber.toLowerCase().includes(searchText.toLowerCase());

    const isInDateRange =
      (!startDate || new Date(invoice.creationDate) >= new Date(startDate)) &&
      (!endDate || new Date(invoice.creationDate) <= new Date(endDate));

    if (searchText.length >= MIN_SEARCH_LENGTH) {
      return matchesSearchText && isInDateRange;
    } else {
      return isInDateRange;
    }
  });

  const filteredBills = sortedBills.filter((bill) => {
    const matchesSearchText =
      bill.vendor.toLowerCase().includes(searchText.toLowerCase()) ||
      bill.referenceNumber.toLowerCase().includes(searchText.toLowerCase());

    const isInDateRange =
      (!startDate || new Date(bill.creationDate) >= new Date(startDate)) &&
      (!endDate || new Date(bill.creationDate) <= new Date(endDate));

    if (searchText.length >= MIN_SEARCH_LENGTH) {
      return matchesSearchText && isInDateRange;
    } else {
      return isInDateRange;
    }
  });

  useEffect(() => {
    if (searchText.length >= MIN_SEARCH_LENGTH) {
      setFilteredInvoiceResultsLength(filteredInvoices.length);
    } else {
      setFilteredInvoiceResultsLength(invoices.length);
    }
  }, [filteredInvoices, invoices, searchText]);

  useEffect(() => {
    if (searchText.length >= MIN_SEARCH_LENGTH) {
      setFilteredBillResultsLength(filteredBills.length);
    } else {
      setFilteredBillResultsLength(bills.length);
    }
  }, [filteredBills, bills, searchText]);

  return (
    <div className="p-2 mb-2 p-md-4 card">
      <div className="upper-container d-flex align-content-center justify-content-between flex-column flex-lg-row">
        <div className="data-toggle-container mb-2 d-flex align-items-end">
          <button
            className={`btn btn-outline-primary w-50 me-2 ${activeDataType === 'bills' ? 'active' : ''}`}
            onClick={handleToggleBillData}
            style={{ minWidth: '100px' }}
          >
            Bills
          </button>
          <button
            className={`btn btn-outline-primary w-50 ${activeDataType === 'invoices' ? 'active' : ''}`}
            onClick={handleToggleInvoiceData}
            style={{ minWidth: '100px' }}
          >
            Invoices
          </button>
        </div>
        <div className="mb-2 d-flex align-items-end position-relative search-bar w-100 mx-lg-2">
          <FaSearch className="fa-search position-absolute fs-5" />
          <input
            className="form-control bg-body-secondary"
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="form-filter-container d-flex justify-content-between flex-wrap flex-md-nowrap">
          <div className="form-date-controls d-flex">
            <div className="mb-2">
              <label>Start Date:</label>
              <input
                className="form-control bg-body-secondary"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="mb-2 mx-2">
              <label>End Date:</label>
              <input
                className="form-control bg-body-secondary"
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
                console.log('activeDataType', activeDataType);
                if (activeDataType === 'invoices') {
                  setIsNewInvoice(true);
                  setIsNewBill(false);
                }
                if (activeDataType === 'bills') {
                  setIsNewInvoice(false);
                  setIsNewBill(true);
                }
                setEditBill(null);
                setEditInvoice(null);
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
              {activeDataType === 'invoices' && (
                <>
                  <th>/ {filteredInvoiceResultsLength}</th>
                  <TableHeaderInvoice
                    column="creationDate"
                    activeColumn={activeInvoiceColumn}
                    sortTable={sortInvoiceTable}
                    renderSortIcon={renderSortInvoiceIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    Date
                  </TableHeaderInvoice>
                  <TableHeaderInvoice
                    column="clientName"
                    activeColumn={activeInvoiceColumn}
                    sortTable={sortInvoiceTable}
                    renderSortIcon={renderSortInvoiceIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    Client
                  </TableHeaderInvoice>
                  <TableHeaderInvoice
                    column="referenceNumber"
                    activeColumn={activeInvoiceColumn}
                    sortTable={sortInvoiceTable}
                    renderSortIcon={renderSortInvoiceIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    ID
                  </TableHeaderInvoice>
                  <TableHeaderInvoice
                    column="amount"
                    activeColumn={activeInvoiceColumn}
                    sortTable={sortInvoiceTable}
                    renderSortIcon={renderSortInvoiceIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    Amount
                  </TableHeaderInvoice>
                  <TableHeaderInvoice
                    column="status"
                    activeColumn={activeInvoiceColumn}
                    sortTable={sortInvoiceTable}
                    renderSortIcon={renderSortInvoiceIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    Status
                  </TableHeaderInvoice>
                </>
              )}
              {activeDataType === 'bills' && (
                <>
                  <th>/ {filteredBillResultsLength}</th>
                  <TableHeaderBill
                    column="creationDate"
                    activeColumn={activeBillColumn}
                    sortTable={sortBillTable}
                    renderSortIcon={renderSortBillIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    Date
                  </TableHeaderBill>
                  <TableHeaderBill
                    column="vendor"
                    activeColumn={activeBillColumn}
                    sortTable={sortBillTable}
                    renderSortIcon={renderSortBillIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    Vendor
                  </TableHeaderBill>
                  <TableHeaderBill
                    column="referenceNumber"
                    activeColumn={activeBillColumn}
                    sortTable={sortBillTable}
                    renderSortIcon={renderSortBillIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    ID
                  </TableHeaderBill>
                  <TableHeaderBill
                    column="amount"
                    activeColumn={activeBillColumn}
                    sortTable={sortBillTable}
                    renderSortIcon={renderSortBillIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    Amount
                  </TableHeaderBill>
                  <TableHeaderBill
                    column="status"
                    activeColumn={activeBillColumn}
                    sortTable={sortBillTable}
                    renderSortIcon={renderSortBillIcon}
                    setShouldUpdateChart={function (): void {}}
                  >
                    Status
                  </TableHeaderBill>
                </>
              )}
            </tr>
          </thead>
        </table>
      </div>

      <div className="table-body">
        {activeDataType === 'invoices' && (
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
        )}

        {activeDataType === 'bills' && (
          <table className="table table-striped">
            <tbody>
              {filteredBills
                .slice()
                .reverse()
                .map((bill, index) => (
                  <tr
                    className="table-row"
                    key={bill.referenceNumber}
                    onClick={() => openBillEditModal(bill)}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        openBillEditModal(bill);
                      }
                    }}
                    tabIndex={0}
                    aria-label={`Edit bill ${index + 1}`}
                    role="button"
                  >
                    <th scope="row">{index + 1}</th>
                    <td>{bill.creationDate}</td>
                    <td className="text-capitalize">{bill.vendor}</td>
                    <td className="text-uppercase">{bill.referenceNumber}</td>
                    <td>{formatPrice(bill.amount)}</td>
                    <td>{bill.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
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
            <h2 className="mb-4">
              {isNewInvoice
                ? 'Add New Invoice'
                : isNewBill
                ? 'Add New Bill'
                : editBill
                ? 'Update Bill'
                : editInvoice
                ? 'Update Invoice'
                : ''}
            </h2>
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={
                isNewInvoice
                  ? handleSubmit(onSubmit)
                  : isNewBill
                  ? handleSubmit(onSubmitBill)
                  : editInvoice
                  ? handleSubmit(handleUpdateInvoice)
                  : handleSubmit(handleUpdateBill)
              }
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
                        placeholder={activeDataType === 'invoices' ? 'INV-####' : 'BILL-####'}
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
                    Client Name - do check here for bill vs invoice
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
                        placeholder={activeDataType === 'invoices' ? 'INV-####' : 'BILL-####'}
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
                {isNewInvoice
                  ? 'Create Invoice'
                  : isNewBill
                  ? 'Create New Bill'
                  : editBill
                  ? 'Update Bill'
                  : editInvoice
                  ? 'Update Invoice'
                  : ''}
              </button>
              {editInvoice && activeDataType === 'invoices' && (
                <button
                  className="btn btn-danger mt-2 w-100"
                  onClick={() => handleDeleteInvoice(editInvoice.referenceNumber)}
                >
                  Delete Invoice
                </button>
              )}
              {editBill && activeDataType === 'bills' && (
                <button
                  className="btn btn-danger mt-2 w-100"
                  onClick={() => handleDeleteBill(editBill.referenceNumber)}
                >
                  Delete Bill
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
