export interface Invoice {
  clientName: string;
  creationDate: string;
  referenceNumber: string;
  amount: number;
  status: string;
}

export type InvoiceAction =
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: number }
  | { type: 'SET_INVOICES'; payload: Invoice[] };

export type InvoiceState = {
  invoices: Invoice[];
};
