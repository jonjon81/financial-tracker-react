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
  const absoluteTotal = Math.abs(expenseTotalPrevious12Months);
  const difference = Math.abs(expenseTotalPrevious12Months - expenseTotalPrevious24Months);
  const differencePercentage =
    expenseTotalPrevious24Months !== 0 ? ((difference / expenseTotalPrevious24Months) * 100).toFixed(2) : 'N/A';

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Total Expenses</h2>
        <p className="card-text text-center fs-2">
          <span className="ms-1">
            <strong>{formatPriceWholeNumber(absoluteTotal)}</strong>
          </span>
          <br />
          <span className="ms-1 d-flex flex-column" style={{ fontSize: '12px' }}>
            <span className={difference < 0 ? 'text-success' : 'text-danger'}>
              {Math.abs(Number(differencePercentage))}%
            </span>
            previous 12 months
          </span>
        </p>
      </div>
    </div>
  );
};

export default TotalExpenseSummary;
