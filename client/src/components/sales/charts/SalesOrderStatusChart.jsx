import Chart from 'react-apexcharts';
import { Card, Typography } from 'antd';

const statusData = [
  { id: 0, value: 120, label: 'Completed' },
  { id: 1, value: 80, label: 'Draft' },
  { id: 2, value: 20, label: 'Reverse' },
];

export function SalesOrderStatusChart() {
    const data = {
        series: statusData.map(item => item.value),
        labels: statusData.map(item => item.label),
    };

    const options = {
        chart: {
            type: 'pie',
            height: 200,
        },
        labels: data.labels,
        legend: {
            position: 'bottom',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                },
            },
        },
        dataLabels: {
            enabled: true,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return `${val} units`;
                },
            },
        },
    };

    return (
        <Card
            style={{
                width: '100%',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '0px',
            }}
        >
            <Typography.Title level={4} style={{margin: 5}}>Sales Order Status</Typography.Title>
            <Chart options={options} series={data.series} type="pie" height={200} />
        </Card>
    );
}
