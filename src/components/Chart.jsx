/**
 * ===================================
 * COMPONENT: CHART - BIỂU ĐỒ
 * ===================================
 * Component wrapper cho react-chartjs-2
 */

'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Đăng ký các thành phần Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

/**
 * Line Chart - Biểu đồ đường
 * @param {Object} props
 * @param {Array} props.labels - Nhãn trục X
 * @param {Array} props.datasets - Dữ liệu [{label, data, borderColor, backgroundColor}]
 * @param {string} props.title - Tiêu đề biểu đồ
 */
export function LineChart({ labels = [], datasets = [], title = '', height = 300 }) {
    const data = {
        labels,
        datasets: datasets.map(ds => ({
            label: ds.label,
            data: ds.data,
            borderColor: ds.color || '#22c55e',
            backgroundColor: ds.bgColor || 'rgba(34, 197, 94, 0.1)',
            fill: ds.fill !== false,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
        }))
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div style={{ height }}>
            <Line data={data} options={options} />
        </div>
    );
}

/**
 * Bar Chart - Biểu đồ cột
 * @param {Object} props
 * @param {Array} props.labels - Nhãn trục X
 * @param {Array} props.datasets - Dữ liệu [{label, data, backgroundColor}]
 * @param {string} props.title - Tiêu đề biểu đồ
 */
export function BarChart({ labels = [], datasets = [], title = '', height = 300 }) {
    const data = {
        labels,
        datasets: datasets.map(ds => ({
            label: ds.label,
            data: ds.data,
            backgroundColor: ds.color || '#22c55e',
            borderRadius: 8,
            maxBarThickness: 50
        }))
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };

    return (
        <div style={{ height }}>
            <Bar data={data} options={options} />
        </div>
    );
}

export default LineChart;
