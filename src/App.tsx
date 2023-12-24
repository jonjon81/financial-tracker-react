import React from 'react';
import SummaryWidget from './components/SummaryWidget';
import InvoicesWidget from './components/InvoicesWidget';
import { useState } from 'react';

const App: React.FC = () => {
  const [dataToSend, setDataToSend] = useState(0);

  const sendDataToSibling = (data: number) => {
    setDataToSend(data);
  };
  return (
    <div className="container">
      <div className="row">
        <h1>Financial Dashboard</h1>
        <div className="dashboard">
          <SummaryWidget receivedData={dataToSend} />
          <InvoicesWidget sendDataToSibling={sendDataToSibling} />
        </div>
      </div>
    </div>
  );
};

export default App;
