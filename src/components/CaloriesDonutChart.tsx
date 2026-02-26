import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const CaloriesDonutChart: React.FC = () => {
    // Example: calories consumed vs remaining
    const series = [1200, 800]; // e.g., 1200 eaten, 800 remaining
    const options: ApexOptions = {
        chart: {
            type: 'donut',
        },
        labels: ['Consumed', 'Remaining'],
        colors: ['#F67631', '#E0E0E0'], // your custom orange + grey for remaining
        legend: {
            position: 'bottom',
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val.toFixed(0) + '%';
            },
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val + ' kcal';
                },
            },
        },
    };

    return <Chart options={options} series={series} type="donut" width="100%" height={250} />;
};

export default CaloriesDonutChart;