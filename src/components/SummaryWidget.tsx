import CashBalance from './CashBalance';
import TotalIncomeSummary from './TotalIncomeSummary';
import TotalExpensesSummary from './TotalExpensesSummary';
import Last30Days from './Last30Days';
import { useTransaction } from '../context/TransactionContexts';
import './SummaryWidget.css';
import NetIncomeSummary from './NetIncomeSummary';

const SummaryWidget = () => {
  const { state: transactionState } = useTransaction();
  return (
    <div className="summary-main-container d-flex justify-content-between">
      <CashBalance transactions={[]} />
      <TotalIncomeSummary transactions={[]} />
      <TotalExpensesSummary transactions={[]} />
      <NetIncomeSummary transactions={[]} />
      <Last30Days transactions={transactionState.transactions} />
    </div>
  );
};

export default SummaryWidget;
