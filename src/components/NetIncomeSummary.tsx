import { Invoice } from '../types/Invoice';
import { formatPriceWholeNumber } from '../utils/helpers';
import { FaLongArrowAltUp } from 'react-icons/fa';
import { FaLongArrowAltDown } from 'react-icons/fa';

interface SummaryProps {
  transactions: Invoice[];
  incomeTotalPrevious12Months: number;
  incomeTotalPrevious24Months: number;
  expenseTotalPrevious12Months: number;
  expenseTotalPrevious24Months: number;
}

const NetIncomeSummary: React.FC<SummaryProps> = ({
  incomeTotalPrevious12Months,
  incomeTotalPrevious24Months,
  expenseTotalPrevious12Months,
  expenseTotalPrevious24Months,
}) => {
  const lastYear = incomeTotalPrevious12Months - expenseTotalPrevious12Months;
  const secondLastYear = incomeTotalPrevious24Months - expenseTotalPrevious24Months;
  const difference = lastYear - secondLastYear;
  const differencePercentage = lastYear !== 0 ? ((difference / secondLastYear) * 100).toFixed(2) : 'N/A';

  const netIncomeClass = lastYear >= 0 ? 'text-success' : 'text-danger';

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Net Income</h2>
        <p className="card-text text-center fs-2">
          <span className={`ms-1 ${netIncomeClass}`}>
            <strong>{formatPriceWholeNumber(lastYear)}</strong>
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

export default NetIncomeSummary;
