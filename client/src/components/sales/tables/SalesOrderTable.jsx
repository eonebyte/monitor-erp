import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, DatePicker, Divider, Spin } from 'antd';
import Highlighter from 'react-highlight-words';

const { RangePicker } = DatePicker;

const SalesOrderTable = ({ initialMonth, initialYear }) => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [loading, setLoading] = useState(false);
    const searchInput = useRef(null);

    useEffect(() => {
        if (initialMonth && initialYear) {
            const startDate = new Date(initialYear, initialMonth - 1, 1);
            const endDate = new Date(initialYear, initialMonth, 0);
            setDateRange([startDate, endDate]);
            fetchSalesOrderData(startDate, endDate);
        } else {
            // Default date range to the current month
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setDateRange([startDate, endDate]);
            fetchSalesOrderData(startDate, endDate);
        }
    }, [initialMonth, initialYear]);

    const formatDate = (date) => {
        const month = date.getMonth() + 1; // 0-based month
        const year = date.getFullYear();
        return {
            month: month < 10 ? `0${month}` : `${month}`,
            year,
        };
    };

    // Fungsi untuk mengambil data pesanan penjualan
    const fetchSalesOrderData = async () => {
        const [startDate, endDate] = dateRange;
        if (startDate && endDate) {
            const { month: startMonth, year: startYear } = formatDate(startDate);
            const { month: endMonth, year: endYear } = formatDate(endDate);
            const query = `startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`;
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/sales/order?${query}`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching sales order data:', error);
                setData([]); // Set data ke array kosong jika terjadi error
            } finally {
                setLoading(false);
            }
        } else {
            setData([]); // Set data ke array kosong jika range tanggal tidak valid
        }
    };

    // Fungsi untuk menangani perubahan tanggal
    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setDateRange([dates[0].toDate(), dates[1].toDate()]);
        }
    };

    // Fungsi untuk menangani pencarian
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    // Fungsi untuk mereset pencarian
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    // Fungsi untuk mengkonfigurasi pencarian kolom
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{ padding: 8 }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys && selectedKeys[0] ? selectedKeys[0] : ''}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys && selectedKeys[0] ? selectedKeys[0] : '');
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    // Definisi kolom tabel
    const columns = [
        {
            title: 'Tanggal Order',
            dataIndex: 'tanggalorder',
            key: 'tanggalorder',
            ...getColumnSearchProps('tanggalorder'),
        },
        {
            title: 'Document No',
            dataIndex: 'documentno',
            key: 'documentno',
            ...getColumnSearchProps('documentno'),
        },
        {
            title: 'PO Ref',
            dataIndex: 'poref',
            key: 'poref',
            ...getColumnSearchProps('poref'),
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            ...getColumnSearchProps('customer'),
        },
    ];

    return (
        <div>
            <Space>
                <RangePicker picker="month" onChange={handleDateRangeChange} />
                <Button type="primary" onClick={fetchSalesOrderData}>
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
                <Table columns={columns} dataSource={data.map(item => ({ ...item, key: item.id }))} />
            )}
        </div>
    );
};

SalesOrderTable.propTypes = {
    initialMonth: PropTypes.number,
    initialYear: PropTypes.number,
};

export default SalesOrderTable;
