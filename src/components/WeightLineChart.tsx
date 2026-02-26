import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const WeightLineChart: React.FC = () => {
    const series = [
        {
            name: 'Weight (kg)',
            data: [70, 69.8, 69.5, 69.3, 69.2, 69, 68.9], // Example weights
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'line',
            height: 300,
            toolbar: { show: false },
        },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        markers: {
            size: 4,
        },
        colors: ['#F67631'],
        yaxis: {
            title: { text: 'kg' },
            min: 0,
        },
        grid: {
            borderColor: '#414141',
        },
        tooltip: {
            y: {
                formatter: (val: number) => val + ' kg',
            },
        },
    };

    return <Chart options={options} series={series} type="line" width="100%" height={250} />;
};

export default WeightLineChart;