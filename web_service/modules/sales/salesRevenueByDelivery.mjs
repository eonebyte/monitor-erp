// plugins/sales.mjs
import { endOfMonth, format } from 'date-fns';

export default async function salesRevenueByDeliveryPlugin(fastify, options) {
  // Route for shipments
  fastify.get('/api/sales/revenue-by-delivery', async (request, reply) => {
    const dbClient = await fastify.pg.connect();
    try {
      const { startMonth, endMonth } = request.query;
      fastify.log.info(`Received startMonth: ${startMonth}, endMonth: ${endMonth}`);

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Bulan dalam format 'MM'

      // Tentukan startDate
      const startDate = startMonth ? `${startMonth}-01` : `${currentYear}-${currentMonth}-01`; 

      // Tentukan endDate dengan menghitung akhir bulan
      const endDateInput = endMonth ? `${endMonth}-01` : `${currentYear}-${currentMonth}-01`;
      const endDate = format(endOfMonth(new Date(endDateInput)), 'yyyy-MM-dd'); 

      
      const { rows: shipments } = await dbClient.query(`
        SELECT 
            TO_CHAR(io.MovementDate, 'YYYY') AS YearTrx,
            TO_CHAR(io.MovementDate, 'MM') AS MonthTrx,
            TO_CHAR(io.MovementDate, 'YYYY-MM-DD') AS MovementDate,
            io.DocumentNo,
            bp.Name AS Customer,
            p.Name AS ProductName,
            bpg.Name AS GroupName,
            o.PoReference AS POCustomer,
            SUM(ol.QtyEntered * col.PriceEntered) AS TotalSales
        FROM 
            M_InOutLine ol
        JOIN 
            M_InOut io ON ol.M_InOut_ID = io.M_InOut_ID
        JOIN 
            C_OrderLine col ON ol.C_OrderLine_ID = col.C_OrderLine_ID
        JOIN 
            C_Order o ON col.C_Order_ID = o.C_Order_ID
        JOIN 
            M_Product p ON ol.M_Product_ID = p.M_Product_ID
        JOIN 
            C_BPartner bp ON o.C_BPartner_ID = bp.C_BPartner_ID
        JOIN
            C_BP_Group bpg ON bp.C_BP_Group_ID = bpg.C_BP_Group_ID
        WHERE 
            io.MovementDate BETWEEN $1 AND $2
            AND o.DocStatus = 'CO' -- Only completed orders
            AND io.DocStatus = 'CO' -- Only completed movements
            AND bp.C_BP_Group_ID IN (1000006, 1000007)
        GROUP BY 
            TO_CHAR(io.MovementDate, 'YYYY-MM-DD'),
            TO_CHAR(io.MovementDate, 'YYYY'),
            TO_CHAR(io.MovementDate, 'MM'),
            io.DocumentNo,
            bp.Name,
            bpg.Name,
            p.Name,
            o.PoReference
        ORDER BY 
            YearTrx DESC,
            MonthTrx DESC,
            TotalSales`, [startDate, endDate]);
      return shipments;
    } catch (error) {
      fastify.log.error(error); // Use fastify's built-in logger
      reply.status(500).send({ error: 'Failed to fetch sales' });
    } finally {
      dbClient.release(); // Always release the client
    }
  });


}
