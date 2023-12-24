import React from 'react';
import SummaryWidget from './components/SummaryWidget';
import InvoicesWidget from './components/InvoicesWidget';

const App: React.FC = () => {
  return (
    <div className="container">
      <div className="row">
        <h1>Financial Dashboard</h1>
        <div className="dashboard">
          <SummaryWidget />
          <InvoicesWidget />
        </div>
      </div>
    </div>
  );
};

export default App;
