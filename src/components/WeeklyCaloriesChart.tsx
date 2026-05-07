import React, {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();


interface WeeklyCaloriesChartProps {
    data?: number[]; // calories per day
    goal?: number;
}

const WeeklyCaloriesChart: React.FC<WeeklyCaloriesChartProps> = ({
      data = [1800, 2000, 1500, 2200, 1700, 1900, 2100], // default example
      goal = 2000,
      }) => {

    const [themeColors, setThemeColors] = useState({
        borderColor: '',
        textColor: '',
        accentColor: '',
        greenColor: '',
        redColor: '',
        blueColor: '',
    });

    useEffect(() => {
        const updateTheme = () => {
            setThemeColors({
                borderColor: getCSSVariable('--color-bordercolor'),
                textColor: getCSSVariable('--color-textcolor'),
                accentColor: getCSSVariable('--color-accent'),
                greenColor: getCSSVariable('--color-button-start'),
                redColor: getCSSVariable('--color-button-stop'),
                blueColor: getCSSVariable('--color-chart'),
            });
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => observer.disconnect();
    }, []);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

    const colors = data.map((_, i) =>
        i === todayIndex ? themeColors.accentColor : themeColors.borderColor
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
                    colors: themeColors.textColor,
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            title: {
                text: 'Calories',
                style: { color: themeColors.textColor },
            },
            labels: {
                style: { colors: themeColors.textColor },
            },
        },
        grid: {
            borderColor: themeColors.borderColor,
        },
        annotations: {
            yaxis: [
                {
                    y: goal,
                    borderColor: themeColors.greenColor,
                    label: {
                        text: `Goal: ${goal} Cal`,
                        style: {
                            background: themeColors.greenColor,
                        },
                    },
                },
            ],
        },
        legend: {
            show: false,
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