import { useEffect } from 'react';
import { useStore } from './store';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
function findByMatchingProperties(set, properties) {
    return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
            return entry[key] === properties[key];
        });
    });
}

function getChartData(entries, group) {
    let datasets = [];
    entries.forEach(function (user) {
        let weights = [];
        let steps = [];
        const filterGroup = findByMatchingProperties(group, { id: user[0] });

        [user[1]].forEach(rows => {
            rows.forEach(row => {
                if (row.weight === 0) {
                    weights = [...weights, null];
                } else {
                    weights = [...weights, row.weight];
                }
                if (row.steps === 0) {
                    steps = [...steps, null];
                } else {
                    steps = [...steps, row.steps];
                }
            });
        });
        let name = '';
        group.forEach(function (groupmember) {
            if (groupmember.id === user[0]) {
                name = [...name, groupmember.name];
            }
        });
        datasets = [
            ...datasets,
            {
                label: name + ' (weight)',
                data: weights,
                borderColor: `${filterGroup[0].color}`,
                borderWidth: 2,
                backgroundColor: `${filterGroup[0].color}`,
                yAxisID: 'y',
            },
        ];
        datasets = [
            ...datasets,
            {
                label: name + ' (steps)',
                data: steps,
                borderColor: `${filterGroup[0].color}20`,
                backgroundColor: `${filterGroup[0].color}30`,
                borderWidth: 2,
                yAxisID: 'y1',
            },
        ];
        //const color = JSON.stringify(grouped[0].color);
    });
    return datasets;
}

export default function Chart() {
    const entries = useStore(state => state.entries);
    const group = useStore(state => state.group);
    //const profile = useStore(state => state.group);

    const days = [];
    for (let x = 0; x <= 30; x++) {
        days.push(`Day ${x}`);
    }

    const datasets = getChartData(entries, group);

    const chartData = {
        labels: days,
        datasets: datasets,
    };

    return (
        <Line
            data={chartData}
            options={{
                maintainAspectRatio: true,
                height: '600px',
                cubicInterpolationMode: 'monotone',
                spanGaps: true,
                plugins: {
                    // legend: {
                    //     labels: {
                    //         filter: function (legendItem, data) {
                    //             let label =
                    //                 data.datasets[legendItem.datasetIndex]
                    //                     .label || '';
                    //             if (typeof label !== 'undefined') {
                    //                 if (legendItem.datasetIndex % 2) {
                    //                     return false;
                    //                 }
                    //             }
                    //             return label;
                    //         },
                    //     },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                if (context.dataset.yAxisID == 'y') {
                                    let label = ' ' + context.raw + 'kg';
                                    return label;
                                } else {
                                    let label = ' ' + context.raw + ' steps';
                                    return label;
                                }
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Weight (kg)',
                        },
                        type: 'linear',
                        display: true,
                        position: 'left',
                        suggestedMin: 70,
                        suggestedMax: 125,
                    },
                    y1: {
                        title: {
                            display: true,
                            text: 'Steps',
                        },
                        type: 'linear',
                        display: true,
                        position: 'right',
                        suggestedMin: 0,
                        suggestedMax: 12000,

                        // grid line settings
                        grid: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    },
                },
            }}
        />
    );
}
