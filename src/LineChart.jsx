import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const LineChart = ({name, dataWeather}) => {
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
        fill: false,
        data: dataWeather,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return <Line options={options} data={data} />;
}
export default LineChart

