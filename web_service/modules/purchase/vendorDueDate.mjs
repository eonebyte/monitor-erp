async function VendorDueDate(fastify, opts) {
    fastify.get('/api/purchase/vendor-due-dates', async (request, reply) => {
      const dbClient = await fastify.pg.connect();
        try {
          const { startMonth, startYear, endMonth, endYear } = request.query;

      // Validasi parameter query
      if (!startMonth || !startYear || !endMonth || !endYear) {
        return reply.status(400).send({ error: 'Semua parameter startMonth, startYear, endMonth, dan endYear harus diisi.' });
      }

      // Bangun startDate dan endDate
      const startDate = `${startYear}-${('0' + startMonth).slice(-2)}-01`; // Tanggal pertama bulan
      const endDate = new Date(endYear, endMonth, 0); // Tanggal terakhir bulan dengan tahun akhir
      const formattedEndDate = `${endDate.getFullYear()}-${('0' + (endDate.getMonth() + 1)).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;
          const query = `
            SELECT 
                i.c_invoice_id,
                i.documentno, 
                i.grandtotal,
                TO_CHAR(i.dateinvoiced, 'DD-MM-YYYY') AS dateinvoiced, 
                TO_CHAR(i.datereceived, 'DD-MM-YYYY') AS datereceived,
                i.c_paymentterm_id, 
                pt.Name AS paymenttermname,
                TO_CHAR(PaymentTermDueDate(i.c_paymentterm_id, i.dateinvoiced), 'DD-MM-YYYY') AS duedate
            FROM 
                c_invoice i
            JOIN c_paymentterm pt 
            ON 
                i.c_paymentterm_id = pt.c_paymentterm_id 
            WHERE 
                i.datereceived IS NOT NULL 
                AND i.isactive = 'Y'
                AND i.ispaid = 'N'
                AND i.issotrx = 'N'
                AND i.c_paymentterm_id IS NOT NULL
                AND i.dateinvoiced BETWEEN $1 AND $2
          `;
      
          const result = await dbClient.query(query, [startDate, formattedEndDate]);
      
          if (result.rows.length === 0) {
            return reply.code(404).send({ message: 'No invoices found with complete data' });
          }
      
          // Mengembalikan semua data hasil query
          return reply.code(200).send(result.rows);
        } catch (err) {
          fastify.log.error(err);
          return reply.code(500).send({ message: 'Internal Server Error' });
        } finally {
          dbClient.release(); // Always release the client
        }
      });
}

export default VendorDueDate;