import { Transaction } from '../types/Transaction';
import { Invoice } from '../types/Invoice';
import { Bill } from '../types/Bill';

const transactionsURL = '../../mockData/transactions.json';
const invoicesURL = '../../mockData/invoices.json';
const billsURL = '../../mockData/bills.json';

// Simulated delay
const mockFetchDelay = 500;

// Function to fetch mock transactions data
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(transactionsURL);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    const transactionsData: Transaction[] = await response.json();
    return new Promise<Transaction[]>((resolve) => {
      setTimeout(() => {
        resolve(transactionsData);
      }, mockFetchDelay);
    });
  } catch (error) {
    throw new Error(`Error fetching transactions:`);
  }
};

// Function to fetch mock invoices data
export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await fetch(invoicesURL);
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    const invoicesData: Invoice[] = await response.json();
    return new Promise<Invoice[]>((resolve) => {
      setTimeout(() => {
        resolve(invoicesData);
      }, mockFetchDelay);
    });
  } catch (error) {
    throw new Error(`Error fetching invoices:`);
  }
};

export const fetchBills = async (): Promise<Bill[]> => {
  try {
    const response = await fetch(billsURL);
    if (!response.ok) {
      throw new Error('Failed to fetch bills');
    }
    const billsData: Bill[] = await response.json();
    return new Promise<Bill[]>((resolve) => {
      setTimeout(() => {
        resolve(billsData);
      }, mockFetchDelay);
    });
  } catch (error) {
    throw new Error(`Error fetching bills:`);
  }
};
