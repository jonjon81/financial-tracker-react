import { InvoiceState, InvoiceAction } from '../types/Invoice';

const invoiceReducer = (state: InvoiceState, action: InvoiceAction): InvoiceState => {
  switch (action.type) {
    case 'ADD_INVOICE':
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
      };
    default:
      return state;
  }
};

export default invoiceReducer;
