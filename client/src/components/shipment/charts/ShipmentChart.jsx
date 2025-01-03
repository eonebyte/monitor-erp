import { Card } from 'antd';
import { useState } from 'react';
import Chart from 'react-apexcharts';

const ShipmentChart = () => {
    const [chartData] = useState({
        series: [
            {
                name: 'Pengiriman 1',
                data: [300, 200, 600] // Data pengiriman 1 untuk SO 101, 102, 103
            },
            {
                name: 'Pengiriman 2',
                data: [400, 200, 500] // Data pengiriman 2 untuk SO 101, 102, 103
            },
            {
                name: 'Pengiriman 3',
                data: [200, 0, 0] // Data pengiriman 3 untuk SO 101, 102, 103 (SO 102, 103 tidak ada pengiriman 3)
            },
            {
                name: 'Sisa',
                data: [100, 100, 100] // Sisa untuk masing-masing SO
            }
        ],
        options: {
            chart: {
                type: 'bar',
                stacked: true, // Membuat chart ini stacked
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false, // Bar vertikal
                    columnWidth: '50%',
                },
            },
            xaxis: {
                categories: ['SO 101', 'SO 102', 'SO 103'], // Nomor SO sebagai kategori di sumbu X
            },
            yaxis: {
                title: {
                    text: 'Jumlah (unit)'
                }
            },
            legend: {
                position: 'top'
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: (val) => `${val} units` // Menampilkan units pada tooltip
                }
            }
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
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    height={350}
                />
            </Card>

        </div>
    );
};

export default ShipmentChart;
