import { useState, useEffect } from "react";
import { Table, Typography, Space, Spin, Alert, Card, DatePicker, Button } from "antd";
import { CloudDownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
const { MonthPicker } = DatePicker;
import ExcelJS from 'exceljs';

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

const { Text } = Typography;

const GLJournal = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Default ke bulan saat ini
  const [monthYearText, setMonthYearText] = useState('');

  const fetchFilteredData = async (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth() + 1; // JavaScript months are 0-based

    setLoading(true); // Mulai loading saat fetch dimulai
    try {
      const response = await fetch(`http://localhost:3000/api/accounting/gl-journal?year=${year}&month=${monthIndex}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setJournals(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Set loading ke false di akhir fetch
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook(); // Membuat workbook baru
    const worksheet = workbook.addWorksheet("GL Journal"); // Menambahkan worksheet dengan nama "GL Journal"

    // Menambahkan header kolom dengan penjelasan
    worksheet.columns = [
      { header: "Journal Date", key: "Journal_Date", width: 15 }, // Kolom untuk tanggal jurnal
      { header: "Ref No", key: "Ref_No", width: 20 }, // Kolom untuk nomor referensi
      { header: "Description", key: "Description", width: 20 }, // Kolom untuk deskripsi jurnal
      { header: "Line No", key: "Line_No", width: 15 }, // Kolom untuk nomor baris
      { header: "Account Name", key: "Account_Name", width: 30 }, // Kolom untuk nama akun
      { header: "Sub Description", key: "Sub_Description", width: 30 }, // Kolom untuk deskripsi baris
      { header: "Debit", key: "AmtSourceDr", width: 20 }, // Kolom untuk jumlah debit
      { header: "Credit", key: "AmtSourceCr", width: 20 }, // Kolom untuk jumlah kredit
    ];

    // Menambahkan data ke worksheet
    journals.forEach(journal => {
      // Mengambil nilai jurnal yang hanya perlu diambil sekali
      const journalDate = journal.DateDoc; // Tanggal jurnal
      const refNo = journal.DocumentNo; // Nomor referensi
      const journalDescription = journal.Description; // Deskripsi jurnal

      // Menambahkan baris untuk deskripsi jurnal, hanya sekali
      worksheet.addRow({
        Journal_Date: journalDate, // Tanggal dokumen jurnal
        Ref_No: refNo, // Nomor referensi dokumen
        Description: journalDescription, // Tambahkan deskripsi jurnal
        Line_No: "", // Kosongkan nomor baris untuk baris deskripsi
        Account_Name: "", // Kosongkan nama akun untuk baris deskripsi
        Sub_Description: "", // Kosongkan untuk deskripsi sub
        AmtSourceDr: "", // Kosongkan debit untuk baris deskripsi
        AmtSourceCr: "", // Kosongkan kredit untuk baris deskripsi
      });

      // Tambahkan baris untuk setiap item di Lines
      journal.Lines.forEach(line => {
        worksheet.addRow({
          Journal_Date: "", // Kosongkan untuk menghindari pengulangan tanggal
          Ref_No: "", // Kosongkan untuk menghindari pengulangan nomor referensi
          Description: "", // Kosongkan untuk menghindari pengulangan deskripsi
          Line_No: line.Line_No, // Nomor baris untuk detail transaksi
          Account_Name: line.Account_Name, // Nama akun dari detail transaksi
          Sub_Description: line.Description, // Deskripsi dari detail transaksi
          AmtSourceDr: line.AmtSourceDr || 0, // Jumlah debit (default 0 jika undefined)
          AmtSourceCr: line.AmtSourceCr || 0, // Jumlah kredit (default 0 jika undefined)
        });
      });
    });

    // Mengatur format kolom untuk tampilan yang lebih baik
    worksheet.getColumn("AmtSourceDr").numFmt = '#,##0.00'; // Format angka untuk kolom debit
    worksheet.getColumn("AmtSourceCr").numFmt = '#,##0.00'; // Format angka untuk kolom kredit
    worksheet.getColumn("Journal_Date").numFmt = 'mm/dd/yyyy'; // Format tanggal untuk kolom tanggal jurnal

    // Mengunduh file Excel
    const buffer = await workbook.xlsx.writeBuffer(); // Menghasilkan buffer untuk file Excel
    const blob = new Blob([buffer], { type: "application/octet-stream" }); // Membuat Blob dari buffer
    const link = document.createElement("a"); // Membuat elemen link untuk unduhan
    link.href = URL.createObjectURL(blob); // Mengatur URL untuk Blob
    link.download = "GL_Journal.xlsx"; // Nama file untuk diunduh
    link.click(); // Simulasi klik untuk mengunduh file
  };




  useEffect(() => {
    fetchFilteredData(selectedMonth);
    setMonthYearText(`${selectedMonth.toLocaleString('default', { month: 'long' })} ${selectedMonth.getFullYear()}`);
  }, [selectedMonth]);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div style={{ paddingTop: "0px", marginTop: 0 }}>
      <MonthPicker
        onChange={(date) => {
          if (date) {
            setSelectedMonth(new Date(date.year(), date.month(), 1));
          }
        }}
        style={{ marginRight: '10px' }}
        format="YYYY-MM"
      />
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
      <h3 style={{ marginBottom: 1, marginTop: 1 }}>{monthYearText}</h3>
      <Space direction="vertical" style={{ width: "100%" }}>
        {journals.map((journal) => (
          <div key={journal.GL_Journal_ID} style={{ marginBottom: "30px" }}>
            <Card
              style={{ marginBottom: "20px" }}
              bordered={true}
              title={
                <>
                  <Text type="secondary">
                    Journal Date: {new Date(journal.DateDoc).toLocaleDateString()}
                  </Text>
                  <br />
                  <Space>
                    <Text strong style={{ fontSize: "16px" }}>
                      Ref No: {journal.DocumentNo}
                    </Text>
                    <Text>( {journal.Description} )</Text>
                  </Space>
                </>
              }
              extra={<InfoCircleOutlined />}
            >
              <Table
                dataSource={journal.Lines} // Menggunakan Lines dari respons
                rowKey="GL_JournalLine_ID"
                pagination={false}
                bordered
                style={{ marginTop: "10px" }}
                summary={(pageData) => {
                  let totalDr = 0;
                  let totalCr = 0;

                  pageData.forEach(({ AmtSourceDr, AmtSourceCr }) => {
                    totalDr += AmtSourceDr ? Number(AmtSourceDr) : 0; // Cek dan konversi ke angka
                    totalCr += AmtSourceCr ? Number(AmtSourceCr) : 0; // Cek dan konversi ke angka
                  });
                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={3} align="right">
                          <Text strong>Total:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text type="danger">{formatCurrency(totalDr)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text type="success">{formatCurrency(totalCr)}</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  );
                }}
              >
                <Table.Column title="Line No" dataIndex="Line_No" key="Line_No" />
                <Table.Column title="Account Name" dataIndex="Account_Name" key="Account_Name" />
                <Table.Column title="Description" dataIndex="Description" key="Description" />
                <Table.Column
                  title="Debit"
                  dataIndex="AmtSourceDr"
                  key="AmtSourceDr"
                  render={(amount) => <Text type="danger">{formatCurrency(amount)}</Text>}
                />
                <Table.Column
                  title="Credit"
                  dataIndex="AmtSourceCr"
                  key="AmtSourceCr"
                  render={(amount) => <Text type="success">{formatCurrency(amount)}</Text>}
                />
              </Table>
            </Card>
          </div>
        ))}
      </Space>
    </div>
  );
};

export default GLJournal;
