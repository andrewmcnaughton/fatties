import { useEntriesStore, useUsersStore } from './store';
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
import { useMemo } from 'react';
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
    entries.map(function (user) {
        let weights = [];
        let steps = [];
        const results = findByMatchingProperties(group, { id: user[0] });
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
        let name = [];
        group.forEach(function (groupmember) {
            if (groupmember.id === user[0]) {
                name = [...name, groupmember.name];
            }
        });
        datasets = [
            ...datasets,
            {
                label: name,
                data: weights,
                borderColor: `${results[0].color}`,
                borderWidth: 2,
                backgroundColor: `${results[0].color}`,
                yAxisID: 'y',
            },
        ];
        datasets = [
            ...datasets,
            {
                label: name,
                data: steps,
                borderColor: `${results[0].color}`,
                backgroundColor: `${results[0].color}`,
                borderWidth: 2,
                yAxisID: 'y1',
            },
        ];
    });
    return datasets;
}

export default function Chart() {
    const entries = useEntriesStore(state => state.entries);
    const group = useUsersStore(state => state.group);

    const days = [];
    for (let x = 0; x <= 30; x++) {
        days.push(`Day ${x}`);
    }

    const datasets = useMemo(
        function () {
            return getChartData(entries, group);
        },
        [getChartData, entries, group]
    );

    const chartData = {
        labels: days,
        datasets: datasets,
    };

    console.log('lolz');
    return (
        <Line
            data={chartData}
            options={{
                maintainAspectRatio: true,
                height: '400px',
                cubicInterpolationMode: 'monotone',
                spanGaps: true,
                plugins: {
                    legend: {
                        labels: {
                            filter: function (legendItem, data) {
                                let label =
                                    data.datasets[legendItem.datasetIndex]
                                        .label || '';
                                if (typeof label !== 'undefined') {
                                    if (legendItem.datasetIndex % 2) {
                                        return false;
                                    }
                                }
                                return label;
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Weight (kg)  ',
                        },
                        type: 'linear',
                        display: true,
                        position: 'left',
                        suggestedMin: 82,
                        suggestedMax: 105,
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
