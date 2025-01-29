export default async function purchaseInvoicePlugin(fastify, options) {
    // Route for sales invoices
    fastify.get('/api/purchase/invoice', async (request, reply) => {
        const dbClient = await fastify.pg.connect();
        try {
            const { startMonth, endMonth } = request.query;
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Bulan dalam format 'MM'

            // Memisahkan tahun dan bulan
            const startMonthParts = startMonth.split('-');
            const endMonthParts = endMonth.split('-');
            const startYear = startMonthParts[0];
            const startMonthNumber = parseInt(startMonthParts[1], 10); // Bulan dari startMonth (1-12)
            const endYear = endMonthParts[0];
            const endMonthNumber = parseInt(endMonthParts[1], 10); // Bulan dari endMonth (1-12)

            // Validasi bulan dan tahun
            if (isNaN(startMonthNumber) || startMonthNumber < 1 || startMonthNumber > 12) {
                return reply.status(400).send({ error: 'Invalid start month' });
            }
            if (isNaN(endMonthNumber) || endMonthNumber < 1 || endMonthNumber > 12) {
                return reply.status(400).send({ error: 'Invalid end month' });
            }

            // Menentukan tanggal mulai dan akhir
            const startDate = `${startYear}-${String(startMonthNumber).padStart(2, '0')}-01`; // Default start date

            // Menghitung jumlah hari di bulan akhir
            const lastDayOfMonth = new Date(endYear, endMonthNumber, 0).getDate(); // Mendapatkan jumlah hari di bulan tersebut
            const endDate = `${endYear}-${String(endMonthNumber).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`; // Default end date

            const { rows: sales_invoice } = await dbClient.query(`
                SELECT 
                    i.C_Invoice_ID AS id,
                    i.DateInvoiced AS TanggalInvoice, 
                    i.DocumentNo AS DocumentNo,
                    bp.Name AS Vendor,
                    i.GrandTotal AS TotalAmount
                FROM
                    C_Invoice i
                JOIN 
                    C_BPartner bp ON i.C_BPartner_ID = bp.C_BPartner_ID
                WHERE
                    i.AD_Client_ID = 1000000
                AND i.AD_Org_ID = 1000020
                AND i.IsSoTrx = 'N'
                AND i.DateInvoiced BETWEEN $1 AND $2
            `, [startDate, endDate]);
            return sales_invoice;
        } catch (error) {
            fastify.log.error(error); // Gunakan logger bawaan fastify
            reply.status(500).send({ error: 'Failed to fetch purchase invoices' });
        } finally {
            dbClient.release(); // Selalu release client
        }
    });
}
