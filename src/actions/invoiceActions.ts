import { Invoice } from '../types/Invoice';

export const ADD_INVOICE = 'ADD_INVOICE';
export const UPDATE_INVOICE = 'UPDATE_INVOICE';
export const DELETE_INVOICE = 'DELETE_INVOICE';
export const SET_INVOICES = 'SET_INVOICES';

export const addInvoice = (invoice: Invoice) => ({
  type: ADD_INVOICE as typeof ADD_INVOICE,
  payload: invoice,
});

export const updateInvoice = (invoice: Partial<Invoice>) => ({
  type: UPDATE_INVOICE as typeof UPDATE_INVOICE,
  payload: invoice,
});

export const deleteInvoice = (invoiceId: number) => ({
  type: DELETE_INVOICE as typeof DELETE_INVOICE,
  payload: invoiceId,
});

export const setInvoices = (invoices: Invoice[]) => ({
  type: SET_INVOICES as typeof SET_INVOICES,
  payload: invoices,
});
