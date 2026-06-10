import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();

interface macronutrients {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
}

export const NutritionDonutChart: React.FC = () => {
    const navigate = useNavigate();
    const [macros, setMacros] = useState<macronutrients>({
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0,
    });

    const [themeColors, setThemeColors] = useState({
        borderColor: '',
        textColor: '',
        accentColor: '',
        greenColor: '',
        redColor: '',
        blueColor: '',
        warningColor: '',
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
                warningColor: getCSSVariable('--color-warning'),
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

    const Rawseries = [
        Math.round(macros.calories),
        Math.round(macros.carbs),
        Math.round(macros.protein),
        Math.round(macros.fats)
    ];

    let valuesArray: number[] = [];
    const retrievedData = localStorage.getItem("nutrientGoals");

    if (retrievedData) {
        const parsedData = JSON.parse(retrievedData);
        valuesArray = Object.values(parsedData).map(Number);
    }

    const max = valuesArray;
    const labels = ['Calories', 'Carbs', 'Proteins', 'Fats'];
    const colors = [themeColors.accentColor, themeColors.redColor, themeColors.blueColor, themeColors.greenColor];
    const units = ['kcal', 'g', 'g', 'g'];

    const series = Rawseries.map((value, i) =>
        Math.min((value / max[i]) * 100, 100)
    );

    const clampedCalories = Math.min(Rawseries[0], max[0]);
    const barColor = Rawseries[0] > max[0] ? themeColors.warningColor : themeColors.accentColor;

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
            hover: { filter: { type: 'none' } },
            active: { filter: { type: 'none' } },
        },
    };

    const bar: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            sparkline: { enabled: true },
        },
        colors: [barColor],
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadiusApplication: 'around',
                borderRadius: 10,
                barHeight: '100%',
                colors: {
                    backgroundBarColors: [themeColors.borderColor],
                    backgroundBarRadius: 10,
                },
            },
        },
        tooltip: { enabled: false },
        states: {
            hover: { filter: { type: 'none' } },
            active: { filter: { type: 'none' } },
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

    useEffect(() => {
        fetchMacros();
    }, []);

    const fetchMacros = async () => {
        try {
            const result = await invoke<macronutrients[]>("get_food_by_date", {
                date: new Date(),
            });
            const totals = result.reduce(
                (acc, item) => ({
                    calories: acc.calories + item.calories,
                    carbs: acc.carbs + item.carbs,
                    protein: acc.protein + item.protein,
                    fats: acc.fats + item.fats,
                }),
                { calories: 0, carbs: 0, protein: 0, fats: 0 }
            );
            setMacros(totals);
        } catch (err) {
            console.error("Error fetching macros:", err);
        }
    };

    return (
        <div style={{ width: '100%', textAlign: 'center', color: 'white' }}>
            <div style={{ marginTop: 16 }}>
                <button
                    style={{ textAlign: 'left', marginBottom: 16 }}
                    onClick={() => {
                        navigate("/kcal-tracker", { state: { selectedNutrient: labels[0] } });
                    }}
                >
                    <span style={{ color: colors[0], fontSize: 24, fontWeight: 700, display: 'block' }}>{labels[0]}</span>
                    <div className="text-[28px] text-textcolor">
                        {Rawseries[0]}
                        <span className="text-lg text-muted">/{max[0]}{units[0]}</span>
                        <Chart
                            options={{
                                ...bar,
                                xaxis: {
                                    categories: ['Calories'],
                                    min: 0,
                                    max: max[0],
                                    labels: { show: false },
                                    axisBorder: { show: false },
                                    axisTicks: { show: false },
                                },
                            }}
                            series={[{ data: [clampedCalories] }]}
                            type="bar"
                            height={18}
                            width={'100%'}
                        />
                    </div>
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 7 }}>
                    {legendData.slice(1).map((item, idx) => (
                        <button
                            key={idx}
                            className="relative rounded-2xl h-35"
                            onClick={() => {
                                navigate("/kcal-tracker", { state: { selectedNutrient: item.label } });
                            }}
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
                                    options={{ ...options, colors: [item.color] }}
                                    series={[item.series]}
                                    type="radialBar"
                                    height={140}
                                    width={140}
                                />
                            </div>
                            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                                <span style={{ color: item.color, display: 'block' }}>{item.label}</span>
                                <div>
                                    <span className="text-textcolor text-xl font-bold">{item.value}</span>
                                    <span className="text-[13px] text-muted">/{item.max}{item.unit}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};