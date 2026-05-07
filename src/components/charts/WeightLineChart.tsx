import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const WeightLineChart: React.FC = () => {
    const series = [
        {
            name: 'Weight (kg)',
            data: [70, 69.8, 69.5, 69.3, 69.2, 69, 69.1],
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'line',
            height: 300,
            toolbar: { show: false },
        },
        stroke: {
            curve: 'straight',
            width: 3,
        },
        markers: {
            size: 4,
        },
        colors: ['#F67631'], // line color
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yaxis: {
            title: { text: 'kg' },
        },
        grid: {
            borderColor: '#414141',
        },
    };

    const seriesData = series;

    return <Chart options={options} series={seriesData} type="line" height={300} width="100%" />;
};

export default WeightLineChart;