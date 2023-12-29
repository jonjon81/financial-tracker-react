import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.css';
import { InvoiceProvider } from './context/InvoiceContexts.tsx';
import { TransactionProvider } from './context/TransactionContexts.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InvoiceProvider>
      <TransactionProvider>
        <App />
      </TransactionProvider>
    </InvoiceProvider>
  </React.StrictMode>
);
