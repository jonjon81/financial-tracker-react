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
    console.log('Invoices changed:', invoices);
    if (chartRef && chartRef.current && invoices.length > 0) {
      // Confirm invoices exist
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Calculate monthly revenue from invoices data
        const monthlyRevenueData = Array.from({ length: 12 }, (_, monthIndex) => {
          return { month: getMonthName(monthIndex), revenue: 0 };
        });

        function getMonthName(index: number): string {
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
          return monthNames[index];
        }

        invoices.forEach((invoice) => {
          const monthIndex = new Date(invoice.creationDate).getMonth();
          monthlyRevenueData[monthIndex].revenue += invoice.amount;
        });

        const months = monthlyRevenueData.map(({ month }) => month);
        const revenues = monthlyRevenueData.map(({ revenue }) => revenue);

        const currentYear = new Date().getFullYear();

        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months.map((month) => `${month} ${currentYear}`),
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
