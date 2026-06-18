import React, {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import {ApexOptions} from 'apexcharts';

const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();

const WeightLineChart: React.FC<{ targetWeight?: string; weightData?: number[]; dates?: string[] }> = ({ targetWeight, weightData = [], dates = [] }) => {
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
        ...(weightData.length > 0 ? [{
            name: 'Weight (kg)',
            data: weightData,
        }] : []),
        ...(targetWeight ? [{
            name: 'Target Weight (kg)',
            data: Array(weightData.length || 7).fill(Number(targetWeight)),
        }] : []),
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
        colors: [themeColors.accentColor, themeColors.greenColor], // line colors
        xaxis: {
            categories: dates.length > 0 ? dates : [],
            labels: {
                style: {
                    colors: themeColors.textColor,
                },
            },
        },
        yaxis: {
            min: targetWeight ? Number(targetWeight) - 5 : undefined,
            max: targetWeight ? Number(targetWeight) + 5 : undefined,
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
    return <Chart options={options} series={series} type="line" height={300} width="100%" />;
};

export default WeightLineChart;