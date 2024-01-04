import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useInvoice } from '../context/InvoiceContexts';
import { useBill } from '../context/BillContexts';

const BarChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const {
    state: { invoices },
  } = useInvoice();

  const {
    state: { bills },
  } = useBill();

  useEffect(() => {
    if (chartRef.current && invoices.length > 0 && bills.length > 0) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        const last12Months = Array.from({ length: 12 }, (_, index) => {
          const month = currentMonth - index;
          const year = currentYear - (month < 0 ? 1 : 0);
          const adjustedMonth = ((month % 12) + 12) % 12;
          return { month: adjustedMonth, year };
        }).reverse();

        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        const monthlyInvoiceData = last12Months.map(({ month, year }) => {
          const filteredInvoices = invoices.filter(
            (invoice) =>
              new Date(invoice.creationDate).getFullYear() === year &&
              new Date(invoice.creationDate).getMonth() === month
          );

          const revenue = filteredInvoices.reduce((total, invoice) => total + invoice.amount, 0);

          return {
            month: monthNames[month],
            year,
            revenue,
          };
        });

        const monthlyBillData = last12Months.map(({ month, year }) => {
          const filteredBills = bills.filter(
            (bill) =>
              new Date(bill.creationDate).getFullYear() === year && new Date(bill.creationDate).getMonth() === month
          );

          const billTotal = filteredBills.reduce((total, bill) => total + bill.amount, 0);

          return {
            month: monthNames[month],
            year,
            bill: billTotal,
          };
        });

        const months = monthlyInvoiceData.map(({ month, year }) => `${month} ${year}`);
        const revenues = monthlyInvoiceData.map(({ revenue }) => revenue);
        const billsData = monthlyBillData.map(({ bill }) => bill);

        const netIncome = revenues.map((revenue, index) => revenue - billsData[index]);

        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Revenue',
                data: revenues,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
              {
                label: 'Expenses',
                data: billsData,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
              {
                label: 'Net Income',
                data: netIncome,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Amount',
                },
              },
              x: {
                title: {
                  display: false,
                  text: 'Month',
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [invoices, bills]);

  return (
    <div className="card p-2" style={{ height: '300px' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default BarChart;
