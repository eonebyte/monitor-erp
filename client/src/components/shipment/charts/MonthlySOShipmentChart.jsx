import { Card } from 'antd';
import { useState } from 'react';
import Chart from 'react-apexcharts';

const MonthlySOShipmentChart = () => {
    const [chartData] = useState({
        series: [
            {
                name: 'Total SO',
                type: 'column',
                data: [50, 60, 55] // Data total SO per bulan
            },
            {
                name: 'Total Pengiriman',
                type: 'column',
                data: [45, 50, 52] // Data total pengiriman per bulan
            },
            {
                name: 'Sisa',
                type: 'line',
                data: [5, 10, 3] // Data sisa per bulan
            }
        ],
        options: {
            chart: {
                height: '100%', // Mengatur tinggi chart
                type: 'line',
                zoom: {
                    enabled: true
                },
                toolbar: {
                    show: true
                }
            },
            stroke: {
                width: [0, 0, 2],
                curve: 'smooth'
            },
            title: {
                text: 'Rekapitulasi Bulanan SO, Pengiriman, dan Sisa'
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            dataLabels: {
                enabled: true,
                enabledOnSeries: [2]
            },
            labels: ['Januari', 'Februari', 'Maret'], // Label bulan
            xaxis: {
                type: 'category'
            },
            yaxis: [
                {
                    title: {
                        text: 'Jumlah SO dan Pengiriman'
                    }
                },
                {
                    opposite: true,
                    title: {
                        text: 'Sisa'
                    }
                }
            ],
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val) => `${val} orders`
                }
            },
            responsive: [
                {
                    breakpoint: 1000, // Atur breakpoint sesuai kebutuhan
                    options: {
                        chart: {
                            width: '100%'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            ]
        }
    });

    return (
        <div className="chart">
            <Card
                style={{
                    width: '100%',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: 0,
                }}
            >
                <div style={{ width: '100%' }}>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="line"
                        height={350}
                    />
                </div>
            </Card>
        </div>
    );
};

export default MonthlySOShipmentChart;
