import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { Card, Typography, DatePicker, Button, Spin } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Anda bisa mengonfigurasi ApexCharts di sini jika diperlukan
ApexCharts.exec('updateOptions', {
    chart: {
        toolbar: {
            show: false
        },
    }
});


export default function SalesOrderInvoiceChart({ onNavigate }) {
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [data, setData] = useState({
        salesOrder: 0,
        invoice: 0,
        delivery: 0,
    });

    useEffect(() => {
        // Set default month to current month and fetch data
        handleSubmit();
    }, []);

    const handleMonthChange = (date) => {
        setSelectedMonth(date ? date.toDate() : new Date());
    };

    const handleSubmit = async () => {
        setLoading(true);
        const month = selectedMonth.getMonth() + 1;
        const year = selectedMonth.getFullYear();

        try {
            const response = await axios.get(`http://localhost:3000/api/sales/so-invoice-delivery?month=${month}&year=${year}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Hentikan loading
        }
    };

    const getTitle = () => {
        if (selectedMonth) {
            return `SO, Invoice & Delivery (${selectedMonth.toLocaleString('default', { month: 'long' })} ${selectedMonth.getFullYear()})`;
        }
        return `SO, Invoice & Delivery (${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()})`;
    };

    const options = {
        chart: {
            type: 'bar',
            height: 300,
            events: {
                dataPointSelection: (event, chartContext, config) => {
                    // Menangani klik pada bar chart
                    const seriesIndex = config.seriesIndex;
                    if (seriesIndex === 0) { // Index 0 adalah Sales Order
                        if (onNavigate) {
                            onNavigate('4-4', {
                                initialMonth: selectedMonth.getMonth() + 1,
                                initialYear: selectedMonth.getFullYear()
                            }); // Kunci tab untuk Sales Order
                        }
                    }
                }
            }
        },
        xaxis: {
            categories: [selectedMonth ? selectedMonth.toLocaleString('default', { month: 'long' }) : new Date().toLocaleString('default', { month: 'long' })],
            title: {
                text: 'Month',
            },
        },
        yaxis: {
            title: {
                text: 'Count',
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val;
                },
            },
        },
    };

    const series = [
        {
            name: 'Sales Order',
            data: [data.salesOrder]
        },
        {
            name: 'Invoice',
            data: [data.invoice], // Data dari endpoint
        },
        {
            name: 'Delivery',
            data: [data.delivery], // Data dari endpoint
        },
    ];

    return (
        <Card
            style={{
                width: '100%',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: 0,
            }}
        >
            <Typography.Title level={4} style={{ margin: 5 }}>
                {getTitle()}
            </Typography.Title>
            <DatePicker
                onChange={handleMonthChange}
                picker="month"
                style={{ marginBottom: 16 }}
            />
            <Button type="primary" onClick={handleSubmit} style={{ marginBottom: 16 }}>
                Submit
            </Button>
            {loading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Chart options={options} series={series} type="bar" height={300} />
            )}
        </Card>
    );
}

SalesOrderInvoiceChart.propTypes = {
    onNavigate: PropTypes.func,
};
