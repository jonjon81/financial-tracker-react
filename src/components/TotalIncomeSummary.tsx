import { Invoice } from '../types/Invoice';
import { formatPriceWholeNumber } from '../utils/helpers';

interface SummaryProps {
  incomeTotalPrevious12Months: number;
  incomeTotalPrevious24Months: number;
  invoices: Invoice[];
}

const TotalIncomeSummary: React.FC<SummaryProps> = ({ incomeTotalPrevious12Months, incomeTotalPrevious24Months }) => {
  const lastYear = incomeTotalPrevious12Months;
  const secondLastYear = incomeTotalPrevious24Months - incomeTotalPrevious12Months;
  const difference = lastYear - secondLastYear;
  const differencePercentage = lastYear !== 0 ? ((difference / secondLastYear) * 100).toFixed(2) : 'N/A';

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Total Income</h2>
        <p className="card-text text-center fs-2">
          <span className="ms-1">
            <strong>{formatPriceWholeNumber(incomeTotalPrevious12Months)}</strong>
          </span>
          <br />
          <span className="ms-1 d-flex flex-column" style={{ fontSize: '12px' }}>
            {difference < 0 ? (
              <span className="text-danger">-{Math.abs(Number(differencePercentage))}%</span>
            ) : (
              <span className="text-success">+{Number(differencePercentage)}%</span>
            )}{' '}
            from previous 12 months
          </span>
        </p>
      </div>
    </div>
  );
};

export default TotalIncomeSummary;
