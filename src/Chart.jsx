import { useEntriesStore } from './Store';
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

export default function Chart() {
    const entries = useEntriesStore(state => state.entries);
    const weights = [];
    const steps = [];
    const days = [];
    for (let x = 0; x <= 30; x++) {
        days.push(`Day ${x}`);
    }
    entries.map(row => {
        if (row.weight === 0) {
            weights.push(null);
        } else {
            weights.push(row.weight);
        }
        if (row.steps === 0) {
            steps.push(null);
        } else {
            steps.push(row.steps);
        }
    });

    const chartData = {
        labels: days,
        datasets: [
            {
                label: 'Weight',
                data: weights,
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Steps',
                data: steps,
                borderColor: 'rgb(66, 99, 255)',
                borderWidth: 2,
                yAxisID: 'y1',
            },
        ],
    };

    return (
        <Line
            data={chartData}
            options={{
                maintainAspectRatio: true,
                height: '400px',
                cubicInterpolationMode: 'monotone',
                spanGaps: true,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        suggestedMin: 82,
                        suggestedMax: 105,
                    },
                    y1: {
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
