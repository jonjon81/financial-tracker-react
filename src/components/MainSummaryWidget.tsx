import CashBalance from './CashBalance';
import TotalIncomeSummary from './TotalIncomeSummary';
import TotalExpensesSummary from './TotalExpensesSummary';
import Last30Days from './Last30Days';
import { useTransaction } from '../context/TransactionContexts';
import './MainSummaryWidget.css';

const MainSummaryWidget = () => {
  const { state: transactionState } = useTransaction();
  return (
    <div className="summary-main-container d-flex justify-content-between">
      <CashBalance transactions={[]} />
      <Last30Days transactions={transactionState.transactions} />
      <TotalIncomeSummary transactions={[]} />
      <TotalExpensesSummary transactions={[]} />
    </div>
  );
};

export default MainSummaryWidget;
