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
            y: {
                formatter: (val: number) => val + ' kcal',
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