import { useState, useRef } from "react";
import { DatePicker, Space, Button, Divider, Spin, Table, Input } from "antd";
import { CloudDownloadOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ExcelJS from 'exceljs';  // Import exceljs

const { RangePicker } = DatePicker;

export function SalesRevenueByDelivery() {
  const [data, setData] = useState([]); // Untuk menyimpan data dari API
  const [dateRange, setDateRange] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null); // Reference untuk input pencarian

  const fetchData = async () => {
    if (dateRange[0] && dateRange[1]) {
      const [startDate, endDate] = dateRange;
      const startDateStr = startDate.format('YYYY-MM');
      const endDateStr = endDate.format('YYYY-MM');

      const query = `startMonth=${startDateStr}&endMonth=${endDateStr}`;
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/sales/revenue-by-delivery?${query}`
        );
        const result = await response.json();
        console.log(result);
        setData(result);
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // Kolom untuk Ant Design Table
  const columns = [
    {
      title: "Tanggal",
      dataIndex: "movementdate",
      key: "movementdate",
      ...getColumnSearchProps("movementdate"),
    },
    {
      title: "No. Surat Jalan",
      dataIndex: "documentno",
      key: "documentno",
      ...getColumnSearchProps("documentno"),
    },
    {
      title: "PO Customer",
      dataIndex: "pocustomer",
      key: "pocustomer",
      render: (text) => text || "-", // Menampilkan "-" jika null
      ...getColumnSearchProps("pocustomer"),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      ...getColumnSearchProps("customer"),
    },
    {
      title: "Org/Group",
      dataIndex: "groupname",
      key: "groupname",
      ...getColumnSearchProps("groupname"),
    },
    {
      title: "Total Sales",
      dataIndex: "totalsales",
      key: "totalsales",
      ...getColumnSearchProps("totalsales"),
      render: (value) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value),
    },
  ];

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Revenue');
  
    // Set the headers
    worksheet.columns = columns.map(col => ({
      header: col.title,
      key: col.dataIndex,
      width: 20,
    }));
  
    // Filter data based on the current searchText and searchedColumn
    let filteredData = data;
  
    if (searchText && searchedColumn) {
      filteredData = data.filter(item => 
        item[searchedColumn] && item[searchedColumn].toString().toLowerCase().includes(searchText.toLowerCase())
      );
    }
  
    // Add rows (either filtered or all data)
    filteredData.forEach(item => {
      worksheet.addRow(item);
    });
  
    // Save the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'sales_revenue.xlsx';
      link.click();
    });
  };
  
  
  return (
    <div>
      <Space>
        <RangePicker picker="month" onChange={handleDateRangeChange} />
        <Button
          type="primary"
          onClick={fetchData}
          disabled={!dateRange[0] || !dateRange[1]}
        >
          Cari
        </Button>
        {dateRange[0] && dateRange[1] ? (
          <div>
            <Space>
              <Button
                type="primary"
                onClick={exportToExcel}
                style={{
                  backgroundColor: 'green', // Green button
                  borderColor: 'green', // Optional: match border color
                }}
                icon={<CloudDownloadOutlined />}
              >
              </Button>
              <strong>Sales Periode:</strong> ({dateRange[0].format('YYYY-MM')} s/d{" "}
              {dateRange[1].format('YYYY-MM')})
            </Space>
          </div>
        ) : (
          <div>
            <strong>Sales Periode:</strong> Belum dipilih
          </div>
        )}
      </Space>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      {loading ? (
        <div style={{ margin: "20px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey={(record) => record.id || record.customer} // Gunakan id unik
          bordered
        />
      )}
    </div>
  );
}
