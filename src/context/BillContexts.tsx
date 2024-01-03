import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { fetchBills } from '../services/mockBackend';
import { BillAction, BillState } from '../types/Bill';
import billReducer from '../reducers/billReducer';
import { setBills } from '../actions/billActions';

interface BillProviderProps {
  children: ReactNode;
}

const initialBillState: BillState = {
  bills: [],
};

export const BillContext = createContext<{
  state: BillState;
  dispatch: React.Dispatch<BillAction>;
}>({
  state: initialBillState,
  dispatch: () => null,
});

export const BillProvider: React.FC<BillProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(billReducer, initialBillState);

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const billsData = await fetchBills();
        if (!billsData || !Array.isArray(billsData)) {
          throw new Error('Invalid data received from fetchBills');
        }

        dispatch(setBills(billsData));
      } catch (error) {
        console.error('Error fetching or processing bills:', error);
      }
    };

    fetchBillData();
  }, []);

  return <BillContext.Provider value={{ state, dispatch }}>{children}</BillContext.Provider>;
};

export const useBill = () => useContext(BillContext);
