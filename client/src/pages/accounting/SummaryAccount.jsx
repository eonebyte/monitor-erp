import { useEffect, useState } from 'react';
import { Table, Typography, Spin, Layout, List, Input, DatePicker, Button, Space } from 'antd';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { CloudDownloadOutlined } from '@ant-design/icons';


const { Text } = Typography;
const { Sider, Content } = Layout;
const { Search } = Input;
const { MonthPicker } = DatePicker;

const SummaryAccount = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [monthYearText, setMonthYearText] = useState('');


    // Fetch data based on selected month
    const fetchFilteredData = async (month) => {
        setLoading(true);
        const year = month.getFullYear();
        const monthIndex = month.getMonth() + 1; // JavaScript months are 0-based

        try {
            const response = await fetch(`http://localhost:3000/api/accounting/summary-account?year=${year}&month=${monthIndex}`);
            const data = await response.json();
            setData(data);
            setLoading(false);

            // Set default selected account if data is not empty
            if (data.length > 0) {
                setSelectedAccount(data[0].account_name);
            } else {
                setSelectedAccount(null); // Clear selectedAccount if no data
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleFilter = () => {
        setMonthYearText(`${selectedMonth.toLocaleString('default', { month: 'long' })} ${selectedMonth.getFullYear()}`);
        fetchFilteredData(selectedMonth);
    };

    const handleExport = async () => {
        if (data.length === 0) {
            alert('Tidak ada data untuk diekspor');
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('GL Journal');

        // Add headers
        worksheet.columns = [
            { header: 'Akun', key: 'account_name', width: 20 },
            { header: 'Tanggal', key: 'transaction_date', width: 15 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Ref. No', key: 'refno', width: 10 },
            { header: 'Debit', key: 'total_debit', width: 15 },
            { header: 'Credit', key: 'total_credit', width: 15 },
            { header: 'Saldo', key: 'balance', width: 15 }
        ];

        // Group data by account
        const groupedData = data.reduce((acc, item) => {
            if (!acc[item.account_name]) {
                acc[item.account_name] = [];
            }
            acc[item.account_name].push(item);
            return acc;
        }, {});

        // Add rows
        // Add rows for each account and their total saldo
        for (const [accountName, entries] of Object.entries(groupedData)) {
            let accountTotalSaldo = 0;

            entries.forEach(item => {
                const balance = (item.total_debit || 0) - (item.total_credit || 0);
                worksheet.addRow({
                    account_name: item.account_name,
                    transaction_date: item.transaction_date,
                    description: item.description,
                    refno: item.refno,
                    total_debit: Number(item.total_debit).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
                    total_credit: Number(item.total_credit).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
                    balance: balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                });
                accountTotalSaldo += balance;
            });

            // Add total saldo row for the account
            worksheet.addRow([]);
            worksheet.addRow([
                `Total ${accountName}`, // Account total label
                '', // Empty cell for 'Tanggal'
                '', // Empty cell for 'Description'
                '', // Empty cell for 'Ref. No'
                '', // Empty cell for 'Debit'
                '', // Empty cell for 'Credit'
                accountTotalSaldo.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) // Total saldo
            ]).font = { bold: true };

            // Add an empty row for spacing
            worksheet.addRow([]);
        }

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'GL_Journal_All_Accounts.xlsx');
    };

    // Grouping data by account_name
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.account_name]) {
            acc[item.account_name] = [];
        }
        acc[item.account_name].push(item);
        return acc;
    }, {});

    // Filter accounts by search term
    const filteredAccounts = Object.keys(groupedData).filter(accountName =>
        accountName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const now = new Date();
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        setSelectedMonth(currentMonth);
        fetchFilteredData(currentMonth);
    }, []);

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    }
    return (
        <>
            <div style={{ marginBottom: '5px' }}>
                <MonthPicker
                    onChange={(date) => {
                        if (date) {
                            setSelectedMonth(new Date(date.year(), date.month(), 1));
                        }
                    }}
                    style={{ marginRight: '10px' }}
                    format="YYYY-MM"
                />
                <Space>
                <Button
                    type="primary"
                    onClick={handleFilter}
                    style={{
                        marginBottom: '5px',
                    }}
                >
                    Filter
                </Button>
                <Button
                    type="primary"
                    onClick={handleExport}
                    style={{
                        backgroundColor: 'green', // Green button
                        borderColor: 'green', // Optional: match border color
                    }}
                    icon={<CloudDownloadOutlined />}
                >
                </Button>
                </Space>
                {monthYearText && (
                    <Text style={{ marginLeft: '20px', fontSize: '16px' }}>
                        {monthYearText}
                    </Text>
                )}
            </div>
            <hr style={{ marginTop: 0, marginBottom: 0 }} />
            <Layout style={{ padding: '10px', backgroundColor: '#fff' }}>
                <Sider width="30%" style={{ backgroundColor: '#fff', paddingRight: '20px' }}>
                    <Search
                        placeholder="Cari akun"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginBottom: '20px' }} />
                    <div style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                        <List
                            header={<Text strong style={{ fontSize: '16px' }}>Daftar Akun</Text>}
                            bordered
                            dataSource={filteredAccounts}
                            renderItem={accountName => {
                                const accountData = groupedData[accountName] || [];
                                const accountCode = accountData[0]?.account_code || 'N/A';
                                const summarySaldo = accountData.reduce((acc, record) => {
                                    const balance = (record.total_debit || 0) - (record.total_credit || 0);
                                    return acc + balance;
                                }, 0).toLocaleString();

                                return (
                                    <List.Item
                                        style={{
                                            cursor: 'pointer',
                                            padding: '10px 20px',
                                            backgroundColor: selectedAccount === accountName ? '#e6f7ff' : '#fff',
                                            borderLeft: selectedAccount === accountName ? '4px solid #1890ff' : '4px solid transparent'
                                        }}
                                        onClick={() => setSelectedAccount(accountName)}
                                    >
                                        <div>
                                            <Text>{accountName} ({accountCode})</Text>
                                            <br />
                                            <Text type="secondary">Saldo: {summarySaldo}</Text>
                                        </div>
                                    </List.Item>
                                );
                            }} />
                    </div>
                </Sider>
                <Content style={{ padding: '0 20px', backgroundColor: '#fff' }}>
                    {selectedAccount && (
                        <div>
                            <Text strong style={{ fontSize: '16px' }}>{groupedData[selectedAccount]?.[0]?.account_name || 'N/A'}</Text>
                            <Table
                                columns={[
                                    { title: 'Tanggal', key: 'transaction_date', render: (text, record) => record.transaction_date || '-' }, // Format Indonesia
                                    { title: 'Description', dataIndex: 'description', key: 'description' },
                                    { title: 'Ref. No', dataIndex: 'refno', key: 'refno' },
                                    {
                                        title: 'Debit', dataIndex: 'total_debit', key: 'total_debit',
                                        render: (value) => {
                                            const debitValue = Number(value);  // Konversi ke number
                                            return debitValue ? debitValue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '-';
                                        }
                                    },
                                    {
                                        title: 'Credit', dataIndex: 'total_credit', key: 'total_credit',
                                        render: (value) => {
                                            const creditValue = Number(value);  // Konversi ke number
                                            return creditValue ? creditValue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '-';
                                        }
                                    },
                                    {
                                        title: 'Saldo', key: 'balance', render: (_, record) => {
                                            const balance = (record.total_debit || 0) - (record.total_credit || 0);
                                            return balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
                                        }
                                    }
                                ]}
                                dataSource={groupedData[selectedAccount] || []}
                                pagination={false}
                                bordered
                                rowKey={(record) => record.transaction_date + record.description}
                                style={{ marginTop: '20px' }}
                                footer={() => {
                                    let totalSaldo = 0;
                                    (groupedData[selectedAccount] || []).forEach(({ total_debit, total_credit }) => {
                                        const balance = (total_debit || 0) - (total_credit || 0);
                                        totalSaldo += balance;
                                    });

                                    return (
                                        <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <Text strong>Total Saldo: {totalSaldo.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Text>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    )}
                </Content>
            </Layout>
        </>
    );
};

export default SummaryAccount;
