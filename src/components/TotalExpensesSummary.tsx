import { Transaction } from '../types/Transaction';
import { formatPriceWholeNumber } from '../utils/helpers';

interface SummaryProps {
  transactions: Transaction[];
  expenseTotalPrevious12Months: number;
  expenseTotalPrevious24Months: number;
}

const TotalExpenseSummary: React.FC<SummaryProps> = ({
  expenseTotalPrevious12Months,
  expenseTotalPrevious24Months,
}) => {
  const lastYear = expenseTotalPrevious12Months;
  const secondLastYear = expenseTotalPrevious24Months - expenseTotalPrevious12Months;
  const difference = lastYear - secondLastYear;
  const differencePercentage = lastYear !== 0 ? ((difference / secondLastYear) * 100).toFixed(2) : 'N/A';

  if (expenseTotalPrevious12Months < 0) {
    expenseTotalPrevious12Months = Math.abs(expenseTotalPrevious12Months);
  }

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Total Expenses</h2>
        <p className="card-text text-center fs-2">
          <span className="ms-1">
            <strong>{formatPriceWholeNumber(expenseTotalPrevious12Months)}</strong>
          </span>
          <br />
          <span className="ms-1 d-flex flex-column" style={{ fontSize: '12px' }}>
            <span className={difference < 0 ? 'text-success' : 'text-danger'}>{Number(differencePercentage)}%</span>
            from previous 12 months
          </span>
        </p>
      </div>
    </div>
  );
};

export default TotalExpenseSummary;
