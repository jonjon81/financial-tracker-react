import { Bill } from '../types/Bill';

export const ADD_BILL = 'ADD_BILL';
export const UPDATE_BILL = 'UPDATE_BILL';
export const DELETE_BILL = 'DELETE_BILL';
export const SET_BILLS = 'SET_BILLS';

export const addBill = (bill: Bill) => ({
  type: ADD_BILL as typeof ADD_BILL,
  payload: bill,
});

export const updateBill = (bill: Bill) => ({
  type: UPDATE_BILL as typeof UPDATE_BILL,
  payload: bill,
});

export const deleteBill = (billId: number) => ({
  type: DELETE_BILL as typeof DELETE_BILL,
  payload: billId,
});

export const setBills = (bills: Bill[]) => ({
  type: SET_BILLS as typeof SET_BILLS,
  payload: bills,
});
