export interface Invoice {
  clientName: string;
  creationDate: string;
  referenceNumber: string;
  amount: number;
  status: string;
  category: string;
}

export interface InvoiceState {
  invoices: Invoice[];
}

export type InvoiceAction =
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: number }
  | { type: 'SET_INVOICES'; payload: Invoice[] };
