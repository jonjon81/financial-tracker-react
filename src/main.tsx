import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.css';
import { InvoiceProvider } from './context/InvoiceContexts.tsx';
import { TransactionProvider } from './context/TransactionContexts.tsx';
import { BillProvider } from './context/BillContexts.tsx'; // Import the BillProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InvoiceProvider>
      <TransactionProvider>
        <BillProvider>
          <App />
        </BillProvider>
      </TransactionProvider>
    </InvoiceProvider>
  </React.StrictMode>
);
