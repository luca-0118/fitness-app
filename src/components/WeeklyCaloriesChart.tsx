import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface WeeklyCaloriesChartProps {
    data?: number[]; // calories per day
    goal?: number;
}

const WeeklyCaloriesChart: React.FC<WeeklyCaloriesChartProps> = ({
      data = [1800, 2000, 1500, 2200, 1700, 1900, 2100], // default example
      goal = 2000,
      }) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

    const colors = data.map((_, i) =>
        i === todayIndex ? "#F67631" : "#515151"
    );

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            zoom: { enabled: false },
            animations: {
                enabled: true,
            },
        },
        stroke: {
            show: false,
        },
        states: {
            active: {
                filter: {
                    type: "none"
                }
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '50%',
                distributed: true,
                borderRadiusApplication: "end",
            },
        },
        dataLabels: {
            enabled: false,
            formatter: (val: number) => val + ' kcal',
        },
        colors,
        xaxis: {
            categories: days,
            labels: {
                style: {
                    colors: "#9CA3AF",
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            title: { text: 'Calories' },
            labels: {
                style: { colors: "#9CA3AF" },
            },
        },
        grid: {
            borderColor: '#414141',
        },
        annotations: {
            yaxis: [
                {
                    y: goal,
                    borderColor: "#00E396",
                    label: {
                        text: `Goal: ${goal} Cal`,
                        style: {
                            background: "#00E396",
                        },
                    },
                },
            ],
        },
        legend: {
            show: false,
        },
        tooltip: {
            enabled: true,
            shared: false,
            intersect: true,
            style: {
                fontSize: "12px",
            },
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