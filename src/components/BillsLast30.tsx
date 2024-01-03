import React, { useContext } from 'react';
import { BillContext } from '../context/BillContexts';
import { Bill } from '../types/Bill';

interface SummaryProps {
  bills: Bill[];
}

const BillsLast30: React.FC<SummaryProps> = () => {
  const { state: billState } = useContext(BillContext);

  const { bills } = billState;

  // Filter bills within the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const billsLast30Days = bills.filter((bill) => new Date(bill.creationDate) > thirtyDaysAgo).length;

  return (
    <div className="card d-inline-block bg-light mb-2 me-2 last-30-days">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">bills last 30 days</h2>
        <p className="card-text text-center fs-2">
          <strong>{billsLast30Days}</strong>
        </p>
      </div>
    </div>
  );
};

export default BillsLast30;
