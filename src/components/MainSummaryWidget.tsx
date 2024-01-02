import NetIncomeSummaryWidget from './NetIncomeSummaryWidget';
import ExpenseSummaryWidget from './ExpenseSummaryWidget';
import IncomeSummaryWidget from './IncomeSummaryWidget';
import SummaryWidget from './SummaryWidget';
import { useTransaction } from '../context/TransactionContexts';
import './MainSummaryWidget.css';

const MainSummaryWidget = () => {
  const { state: transactionState } = useTransaction();
  return (
    <div className="summary-main-container d-flex">
      <SummaryWidget transactions={transactionState.transactions} />
      <NetIncomeSummaryWidget />
      <ExpenseSummaryWidget />
      <IncomeSummaryWidget />
    </div>
  );
};

export default MainSummaryWidget;
