import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface WeeklyCaloriesChartProps {
    data?: number[]; // calories per day
}

const WeeklyCaloriesChart: React.FC<WeeklyCaloriesChartProps> = ({
                                                                     data = [1800, 2000, 1500, 2200, 1700, 1900, 2100], // default example
                                                                 }) => {
    const options: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            height: 350,
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '50%',
            },
        },
        dataLabels: {
            enabled: false,
            formatter: (val: number) => val + ' kcal',
        },
        colors: ['#F67631'], // your custom orange color
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yaxis: {
            title: { text: 'Calories' },
        },
        grid: {
            borderColor: '#414141',
        },
        tooltip: {
            enabled: true,
            fillSeriesColor: false, // marker color is custom
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                const value = series[seriesIndex][dataPointIndex];
                const color = w.config.colors[dataPointIndex] || '#F67631';
                const day = w.config.xaxis.categories[dataPointIndex];
                return `
          <div style="
            padding: 8px 12px; 
            background: #1E1E1E; 
            border-radius: 8px; 
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <span style="
              display: inline-block;
              width: 12px;
              height: 12px;
              background: ${color};
              border-radius: 50%;
            "></span>
            <strong>${day}:</strong> ${value} kcal
          </div>
        `;
            },
        },
    };

    const series = [
        {
            name: 'Calories',
            data,
        },
    ];

    return <Chart options={options} series={series} type="bar" height={300} width="100%" />;
};

export default WeeklyCaloriesChart;