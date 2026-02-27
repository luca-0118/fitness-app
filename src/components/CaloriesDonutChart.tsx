import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const CaloriesDonutChart: React.FC = () => {
    const series = [1200, 800];
    const labels = ['Consumed', 'Remaining'];
    const colors = ['#F67631', '#E0E0E0'];

    const options: ApexOptions = {
        chart: {
            type: 'donut',
            background: 'transparent',
        },
        labels,
        colors,
        stroke: {
            width: 0, // removes white outline
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '78%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            color: '#ffffff',
                            fontSize: '14px',
                        },
                        value: {
                            show: true,
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: 600,
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#ffffff',
                            fontSize: '14px',
                            formatter: () => {
                                const total = series.reduce((a, b) => a + b, 0);
                                return total + ' cal';
                            },
                        },
                    },
                },
            },
        },
        legend: {
            position: 'bottom',
            labels: {
                colors: '#ffffff',
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: false,
            fillSeriesColor: false,
            custom: ({ series, seriesIndex, w }) => {
                const value = series[seriesIndex];
                const color = w.config.colors[seriesIndex];
                const label = w.config.labels[seriesIndex];
                return `
          <div style="
            padding: 8px 12px; 
            background: #1E1E1E; 
            border-radius: 8px; 
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
          ">
            <span style="
              width: 12px;
              height: 12px;
              background: ${color};
              border-radius: 50%;
            "></span>
            <strong>${label}:</strong> ${value} calories
          </div>
        `;
            },
        },
    };

    return (
        <Chart
            options={options}
            series={series}
            type="donut"
            width="100%"
            height={250}
        />
    );
};

export default CaloriesDonutChart;