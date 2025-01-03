import { useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import 'react-pivottable/pivottable.css';
import Plot from "react-plotly.js";
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import TableRenderers from 'react-pivottable/TableRenderers';
import { DatePicker, Space, Button, Divider, Spin } from "antd";

const { RangePicker } = DatePicker;
const PlotlyRenderers = createPlotlyRenderers(Plot);

export function SalesRevenue() {
  const [pivotState, setPivotState] = useState({});
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (dateRange[0] && dateRange[1]) {
      const [startDate, endDate] = dateRange;
      const startDateStr = startDate.format('YYYY-MM');
      const endDateStr = endDate.format('YYYY-MM');

      // Menyiapkan query dengan format 'YYYY-MM'
      const query = `startMonth=${startDateStr}&endMonth=${endDateStr}`;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/sales/revenue?${query}`);
        const result = await response.json();
        setData(result);
        setPivotState({}); // Reset pivot state untuk update dengan data baru
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setData([]);
    }
  };


  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    } else {
      setDateRange([null, null]);
    }
  };

  return (
    <div>
      <Space>
      <RangePicker picker="month" onChange={handleDateRangeChange} />
      <Button type="primary" onClick={fetchData} disabled={!dateRange[0] || !dateRange[1]}>
          Cari
        </Button>
      {dateRange[0] && dateRange[1] ? (
          <div>
            <strong>Sales Periode:</strong> ({dateRange[0].format('YYYY-MM')} s/d {dateRange[1].format('YYYY-MM')})
          </div>
        ) : (
          <div><strong>Sales Periode:</strong> Belum dipilih</div>
        )}
      </Space>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      {loading ? (
        <div style={{ margin: '20px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <PivotTableUI
          data={data}
          onChange={setPivotState}
          renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
          {...pivotState}
        />
      )}
    </div>
  );
}
