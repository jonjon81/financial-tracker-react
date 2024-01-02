import { Invoice } from '../types/Invoice';
import { formatPriceWholeNumber } from '../utils/helpers';

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
  const currentNetIncome = incomeTotalPrevious12Months + expenseTotalPrevious12Months;
  const previousNetIncome = incomeTotalPrevious24Months + expenseTotalPrevious24Months;

  const difference = currentNetIncome - previousNetIncome;
  const differencePercentage = previousNetIncome !== 0 ? ((difference / previousNetIncome) * 100).toFixed(2) : 'N/A';

  const netIncomeClass = currentNetIncome >= 0 ? 'text-success' : 'text-danger';

  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-6 text-center">Net Income</h2>
        <p className="card-text text-center fs-2">
          <span className={`ms-1 ${netIncomeClass}`}>
            <strong>{formatPriceWholeNumber(currentNetIncome)}</strong>
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

export default NetIncomeSummary;
