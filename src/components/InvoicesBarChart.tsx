import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useInvoice } from '../context/InvoiceContexts';

const BarChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const {
    state: { invoices },
  } = useInvoice();

  useEffect(() => {
    if (chartRef.current && invoices.length > 0) {
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

        const monthlyRevenueData = last12Months.map(({ month, year }) => {
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

        const months = monthlyRevenueData.map(({ month, year }) => `${month} ${year}`);
        const revenues = monthlyRevenueData.map(({ revenue }) => revenue);

        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Monthly Revenue',
                data: revenues,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
                  text: 'Revenue',
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
  }, [invoices]);

  return (
    <div className="card mb-2 p-2" style={{ height: '200px' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default BarChart;
