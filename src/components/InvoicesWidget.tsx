import React, { useState, useEffect } from 'react';
import { fetchInvoices, fetchTransactions } from '../services/mockBackend';
import { Invoice } from '../types/Invoice';
import { formatPrice } from '../utils/helpers';
import './InvoicesWidget.css';

interface InvoicesProps {
  sendDataToSibling: (data: number) => void;
}

const InvoicesWidget: React.FC<InvoicesProps> = ({ sendDataToSibling }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    clientName: '',
    creationDate: '',
    referenceNumber: '',
    amount: 0,
    status: 'UNPAID',
  });

  const [editInvoice, setEditInvoice] = useState<Partial<Invoice> | null>(null);
  ({
    clientName: '',
    creationDate: '',
    referenceNumber: '',
    amount: 0,
    status: '',
  });

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

    // Fetch mock invoices data
    const fetchInvoicesData = async () => {
      try {
        const data = await fetchInvoices();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching mock invoices:', error);
      }
    };

    fetchInvoicesData();
  }, []);

  const handleCreateInvoice = () => {
    setInvoices([...invoices, newInvoice as Invoice]);
    setShowModal(false);
    setNewInvoice({
      clientName: '',
      creationDate: '',
      referenceNumber: '',
      amount: 0,
      status: 'UNPAID',
    });
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
    const calculateInvoicesCreatedLast30Days = (): number => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Filter invoices created in the last 30 days
      const invoicesLast30Days = invoices.filter((invoice) => new Date(invoice.creationDate) >= thirtyDaysAgo);
      return invoicesLast30Days.length;
    };

    const invoicesLast30Days = calculateInvoicesCreatedLast30Days();
    sendDataToSibling(invoicesLast30Days);
  });

  const openEditModal = (invoice: Invoice) => {
    setEditInvoice(invoice);
  };

  return (
    <div className="p-4 bg-primary-subtle rounded">
      <div className="upper-container d-flex align-content-center justify-content-between">
        <h2>Invoices</h2>
        <button className="mb-2 btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Invoice
        </button>
      </div>
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
            <tr key={invoice.referenceNumber} onClick={() => openEditModal(invoice)}>
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
