import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const BarChart = ({name, dataWeather}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
        text: name,
      },
    },
  };

  let labels =[]
  for (var i = 0; i <=23; i++) {
    if(i < 9){
      labels.push(`0${i}:00`);
    } else{
      labels.push(`${i}:00`);
    }
  }
  const data = {
    labels,
    datasets: [
      {
        label: name,
        data: dataWeather,
        backgroundColor: 'rgba(0, 99, 200, 0.5)',
      },
    ],
  };
  return (
    <Bar options={options} data={data} />
  )
}
export default BarChart