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
                hollow: { size: '35%' },
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

    const legendData = labels.map((label, i) => ({
        label,
        value: Rawseries[i],
        color: colors[i],
        unit: units[i],
        max: max[i],
    }));

    return (
        <div style={{ width: '100%', textAlign: 'center', color: 'white'}}>
            <Chart
                options={options}
                series={series}
                type="radialBar"
                height={300}
            />

            <div style={{ marginTop: 16 }}>
                <div style={{ textAlign: 'left', marginBottom: 16 }}>
                    <span style={{ color: colors[0], fontSize: 24, fontWeight: 700, display: 'block'}}>{labels[0]}</span>
                    <div className="text-[28px] text-textcolor">
                        {Rawseries[0]}
                        <span className="text-lg text-muted">/{max[0]}{units[0]}</span>
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 20,
                    }}>
                    {legendData.slice(1).map((item, idx) => (
                        <div>
                            <div key={idx} style={{ display: 'block', justifyContent: 'center', width: '100%', borderColor: item.color}} className="border-2 rounded-xl p-3">
                                <span style={{color: item.color, display: 'block'}}>{item.label}</span>
                                <span className="text-textcolor">{item.value}</span>
                                <span className="text-[10px] text-muted">/{item.max}{item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};