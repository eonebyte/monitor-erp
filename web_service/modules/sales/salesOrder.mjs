export default async function salesOrderPlugin(fastify, options) {
  fastify.get('/api/sales/order', async (request, reply) => {
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

      const { rows: sales_order } = await dbClient.query(
        `
        SELECT 
            o.C_Order_ID AS id,
            TO_CHAR(o.DateOrdered, 'DD-MM-YYYY') AS TanggalOrder, 
            o.DocumentNo AS DocumentNo, 
            o.PoReference AS PORef,
            bp.Name AS Customer
        FROM
            C_Order o
        JOIN 
            C_BPartner bp ON o.C_BPartner_ID = bp.C_BPartner_ID
        WHERE
            o.AD_Client_ID = 1000000 
        AND o.AD_Org_ID = 1000020
        AND o.IsSoTrx = 'Y'
        AND o.DateOrdered BETWEEN $1 AND $2
      `,
        [startDate, formattedEndDate]
      );
      return sales_order;
    } catch (error) {
      fastify.log.error(error); // Gunakan logger bawaan Fastify
      reply.status(500).send({ error: 'Gagal mengambil data sales order' });
    } finally {
      dbClient.release(); // Pastikan client selalu dilepas
    }
  });
}
