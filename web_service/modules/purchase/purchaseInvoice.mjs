// plugins/sales.mjs
export default async function purchaseInvoicePlugin(fastify, options) {
    // Route for sales invoices
    fastify.get('/api/purchase/invoice', async (request, reply) => {
        const dbClient = await fastify.pg.connect();
        try {
            const { startMonth, endMonth } = request.query;
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Bulan dalam format 'MM'
  
            const startDate = startMonth ? `${startMonth}-01` : `${currentYear}-${currentMonth}-01`; // Default start date
            const endDate = endMonth ? `${endMonth}-31` : `${currentYear}-${currentMonth}-31`; // Default end date
  
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
  