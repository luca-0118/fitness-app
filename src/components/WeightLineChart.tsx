import React, {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();

const WeightLineChart: React.FC = () => {
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
        colors: [themeColors.accentColor], // line color
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            labels: {
                style: {
                    colors: themeColors.textColor,
                },
            },
        },
        yaxis: {
            title: {
                text: 'kg',
                style: { color: themeColors.textColor },
            },
            labels: {
                style: { colors: themeColors.textColor },
            },
        },
        grid: {
            borderColor: themeColors.borderColor,
        },
    };

    const seriesData = series;

    return <Chart options={options} series={seriesData} type="line" height={300} width="100%" />;
};

export default WeightLineChart;