import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const Chart = ({ answers }) => {
  const labels = answers.map(a => a.Block);
  const dataValues = answers.map(a => a.Score);

  const data = {
    labels,
    datasets: [
      {
        label: 'Оцінки',
        data: dataValues,
        backgroundColor: '#81C784'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 15
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default Chart;