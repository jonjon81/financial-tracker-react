import { InvoiceState, InvoiceAction } from '../types/Invoice';

const invoiceReducer = (state: InvoiceState, action: InvoiceAction): InvoiceState => {
  switch (action.type) {
    case 'ADD_INVOICE':
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
      };
    case 'SET_INVOICES':
      return {
        ...state,
        invoices: action.payload,
      };
    case 'UPDATE_INVOICE':
      const updatedInvoices = state.invoices.map((invoice) => {
        if (invoice.referenceNumber === action.payload.referenceNumber) {
          return action.payload;
        }
        return invoice;
      });
      return {
        ...state,
        invoices: updatedInvoices,
      };
    case 'DELETE_INVOICE':
      const filteredInvoices = state.invoices.filter(
        (invoice) => invoice.referenceNumber !== action.payload.toString()
      );
      return {
        ...state,
        invoices: filteredInvoices,
      };
    default:
      return state;
  }
};

export default invoiceReducer;
