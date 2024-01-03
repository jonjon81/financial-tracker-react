import { BillState, BillAction } from '../types/Bill';

const billReducer = (state: BillState, action: BillAction): BillState => {
  switch (action.type) {
    case 'ADD_BILL':
      return {
        ...state,
        bills: [...state.bills, action.payload],
      };
    case 'SET_BILLS':
      return {
        ...state,
        bills: action.payload,
      };
    case 'UPDATE_BILL':
      const updatedBills = state.bills.map((bill) => {
        if (bill.referenceNumber === action.payload.referenceNumber) {
          return action.payload;
        }
        return bill;
      });
      return {
        ...state,
        bills: updatedBills,
      };
    case 'DELETE_BILL':
      const filteredBills = state.bills.filter((bill) => bill.referenceNumber !== action.payload.toString());
      return {
        ...state,
        bills: filteredBills,
      };
    default:
      return state;
  }
};

export default billReducer;
