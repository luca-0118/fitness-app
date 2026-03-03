import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export const NutritionDonutChart: React.FC = () => {
    const series = [
        60, 40,          // Outer ring (Consumed, Remaining)
        30, 30, 30      // Inner ring (Macros)
    ];

    const options: ApexOptions = {
        chart: {
            type: 'radialBar',
            background: 'transparent',
            toolbar: { show: false },
        },
        labels: [
            'Consumed',
            'Remaining',
            'Carbs',
            'Fats',
            'Proteins',
        ],
        colors: [
            '#F67631',
            '#E0E0E0',
            '#DC143C',
            '#4DA3FF',
            '#32CD32',
        ],
        plotOptions: {
            radialBar: {
                inverseOrder: false,
                hollow: {
                    size: '35%',
                },
                track: {
                    background: '#1E1E1E',
                    margin: 4,
                },
                dataLabels: {
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
                        formatter: (val: number) => `${val}%`,
                    },
                    total: {
                        show: false,
                        formatter: (w) => {
                            const total = w.globals.seriesTotals.reduce(
                                (a: number, b: number) => a + b,
                                0
                            );
                            return total + ' cal';
                        },
                    },
                },
            },
        },
        stroke: {
            lineCap: 'round',
        },
        legend: {
            show: false,
        },
        tooltip: {
            enabled: false,
            custom: ({ series, seriesIndex, w }) => {
                const value = series[seriesIndex];
                const color = w.config.colors?.[seriesIndex];
                const label = w.config.labels?.[seriesIndex];

                return `
          <div style="
            padding:8px 12px;
            background:#1E1E1E;
            border-radius:8px;
            font-size:14px;
            display:flex;
            align-items:center;
            gap:8px;
            color:white;">
            <span style="
              width:12px;
              height:12px;
              background:${color};
              border-radius:50%;">
            </span>
            <strong>${label}:</strong> ${value}%
          </div>
        `;
            },
        },
    };

    const legendItems = options.labels?.map((label, i) => ({
        label,
        color: options.colors?.[i] as string,
    }));

    return (
        <div style={{ width: '100%', textAlign: 'center' , color: 'white'}}>
            <Chart
                options={options}
                series={series}
                type="radialBar"
                height={300}
            />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginTop: 16,
                    gap: 12,
                }}
            >
                {legendItems?.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
            <span
                style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    background: item.color,
                    borderRadius: '50%',
                }}
            />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};