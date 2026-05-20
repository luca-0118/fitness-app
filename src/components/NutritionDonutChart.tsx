import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';

const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();


export const NutritionDonutChart: React.FC = () => {
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

    const Rawseries = [1200, 45, 30, 25];
    const max = [2000, 60, 60, 60];
    const labels = ['Calories', 'Carbs', 'Proteins', 'Fats'];
    const colors = [themeColors.accentColor, themeColors.redColor, themeColors.blueColor, themeColors.greenColor];
    const units = ['kcal', 'g', 'g', 'g'];

    const series = Rawseries.map((value, i) =>
        Math.min((value / max[i]) * 100, 100)
    );

    const options: ApexOptions = {
        chart: {
            type: 'radialBar',
            background: 'transparent',
        },
        colors,
        plotOptions: {
            radialBar: {
                hollow: { size: '55%' },
                track: {
                    background: themeColors.borderColor,
                    margin: 6,
                    strokeWidth: '100%',
                },
                dataLabels: {
                    show: false,
                },
            },
        },
        stroke: { lineCap: 'round' },
        states: {
            hover: {
                filter: { type: 'none' },
            },
            active: {
                filter: { type: 'none' },
            },
        },
    }

    const bar: ApexOptions = {
        chart: {
            type: 'bar',
            background: 'transparent',
            toolbar: {
                show: false,
            },
            sparkline: {
                enabled: true,
            },
        },
        colors: [themeColors.accentColor],
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 10,
                barHeight: '100%',
                colors: {
                    backgroundBarColors: [themeColors.borderColor],
                    backgroundBarRadius: 10,
                },
            },
        },
        states: {
            hover: {
                filter: { type: 'none' },
            },
            active: {
                filter: { type: 'none' },
            },
        },
    };

    const legendData = labels.map((label, i) => ({
        label,
        value: Rawseries[i],
        color: colors[i],
        unit: units[i],
        max: max[i],
        series: series[i],
    }));

    return (
        <div style={{ width: '100%', textAlign: 'center', color: 'white'}}>
            <div style={{ marginTop: 16 }}>
                <div style={{ textAlign: 'left', marginBottom: 16 }}>
                    <span style={{ color: colors[0], fontSize: 24, fontWeight: 700, display: 'block'}}>{labels[0]}</span>
                    <div className="text-[28px] text-textcolor">
                        {Rawseries[0]}
                        <span className="text-lg text-muted">/{max[0]}{units[0]}</span>
                        <Chart
                            options={{
                                ...bar,
                                xaxis: {
                                    categories: ['Calories'],
                                    max: max[0],
                                    labels: { show: false },
                                    axisBorder: { show: false },
                                    axisTicks: { show: false },
                                },
                                yaxis: {
                                    labels: { show: false },
                                },
                                grid: {
                                    show: false,
                                },
                                tooltip: {
                                    enabled: false,
                                },
                                dataLabels: {
                                    enabled: false,
                                },
                                legend: {
                                    show: false,
                                },
                            }}
                            series={[
                                {
                                    data: [Rawseries[0]],
                                },
                            ]}
                            type="bar"
                            height={18}
                            width={'100%'}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 7,
                    }}
                >
                    {legendData.slice(1).map((item, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-2xl overflow-hidden h-35"
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    opacity: 100,
                                    pointerEvents: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Chart
                                    options={{
                                        ...options,
                                        colors: [item.color],
                                        chart: {
                                            ...options.chart,
                                        },
                                    }}
                                    series={[item.series]}
                                    type="radialBar"
                                    height={140}
                                    width={140}
                                />
                            </div>

                            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                            <span
                                style={{
                                    color: item.color,
                                    display: 'block',
                                }}
                                >
                                    {item.label}
                                </span>
                                <div>
                                    <span className="text-textcolor text-xl font-bold">
                                        {item.value}
                                    </span>
                                    <span className="text-[13px] text-muted">
                                        /{item.max}
                                        {item.unit}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};