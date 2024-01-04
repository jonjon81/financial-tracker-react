import { Bill } from '../types/Bill';
import { formatPriceWholeNumber } from '../utils/helpers';
import { FaLongArrowAltUp } from 'react-icons/fa';
import { FaLongArrowAltDown } from 'react-icons/fa';

interface SummaryProps {
  bills: Bill[];
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
          <span className="ms-1 d-flex flex-column perecent-change-block pt-2" style={{ fontSize: '12px' }}>
            {difference < 0 ? (
              <span className="pb-2">
                <FaLongArrowAltDown className="text-danger" />
                {Math.abs(Number(differencePercentage))}%
              </span>
            ) : (
              <span className="pb-2">
                <FaLongArrowAltUp className="text-success" />
                {Number(differencePercentage)}%
              </span>
            )}{' '}
            from previous 12 months
          </span>
        </p>
      </div>
    </div>
  );
};

export default TotalExpenseSummary;
