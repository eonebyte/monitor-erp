import { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Input, Space, Spin, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { fetchDueDates } from '../../data/fetchData.mjs';

const { RangePicker } = DatePicker;

const VendorDueDate = () => {
  const [dueDates, setDueDates] = useState([]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const fecthDueDatesData = async () => {
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      const { month: startMonth, year: startYear } = formatDate(startDate);
      const { month: endMonth, year: endYear } = formatDate(endDate);
      const query = `startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`;

      setLoading(true);
      try {
        const fetchedDueDates = await fetchDueDates(query);
        const formattedData = fetchedDueDates.map((item, index) => ({
          ...item,
          key: index + 1,
        }));
        setDueDates(formattedData);
      } catch (error) {
        console.error('Error fetching due dates:', error);
        setDueDates([]);
      } finally {
        setLoading(false);
      }
    } else {
      setDueDates([]);
    }
  };

  useEffect(() => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setDateRange([startDate, endDate]);
        fecthDueDatesData(startDate, endDate);
}, []);

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

  const columns = [
    {
      title: 'Invoice No',
      dataIndex: 'document_no',
      key: 'document_no',
      width: '20%',
      ...getColumnSearchProps('document_no'),
    },
    {
      title: 'Date Received',
      dataIndex: 'date_received',
      key: 'date_received',
      width: '20%',
      ...getColumnSearchProps('date_received'),
    },
    {
      title: 'Payment Term',
      dataIndex: 'payment_term_name',
      key: 'payment_term_name',
      width: '30%',
      ...getColumnSearchProps('payment_term_name'),
    },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
      key: 'duedate',
      width: '20%',
      ...getColumnSearchProps('duedate'),
    },
    {
      title: 'Grand Total',
      dataIndex: 'grand_total',
      key: 'grand_total',
      width: '30%',
      ...getColumnSearchProps('grand_total'),
      render: (value) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value),
    },
  ];

  const formatDate = (date) => {
    const month = date.getMonth() + 1; // 0-based month
    const year = date.getFullYear();
    return {
        month: month < 10 ? `0${month}` : `${month}`,
        year,
    };
};

const handleDateRangeChange = (dates) => {
  if (dates && dates.length === 2) {
      setDateRange([dates[0].toDate(), dates[1].toDate()]);
  }
};

  return (
    <>
      <Space>
        <RangePicker picker="month" onChange={handleDateRangeChange} />
        <Button type="primary" onClick={fecthDueDatesData}>
          Cari
        </Button>
        {dateRange[0] && dateRange[1] ? (
          <div>
            <strong>Periode Penjualan:</strong> ({formatDate(dateRange[0]).year}-{formatDate(dateRange[0]).month} s/d {formatDate(dateRange[1]).year}-{formatDate(dateRange[1]).month})
          </div>
        ) : (
          <div><strong>Periode Penjualan:</strong> Belum dipilih</div>
        )}
      </Space>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      {loading ? (
        <div style={{ margin: '20px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={dueDates} />
      )}
    </>
  );
};
export default VendorDueDate;