// plugins/sales.mjs
export default async function salesOrderInvoiceDeliveryPlugin(fastify, options) {
    // Route for shipments
    fastify.get('/api/sales/so-invoice-delivery', async (request, reply) => {
        const dbClient = await fastify.pg.connect();
        const { month, year } = request.query;
        try {
            const { rows: salesOrderCount } = await dbClient.query(`
                SELECT COUNT(DISTINCT o.c_order_id) AS sales_order_count
                FROM c_order o
                WHERE o.issotrx = 'Y'
                AND EXTRACT(MONTH FROM o.dateordered) = $1
                AND EXTRACT(YEAR FROM o.dateordered) = $2
            `, [month, year]);

            const { rows: invoiceCount } = await dbClient.query(`
                SELECT COUNT(DISTINCT i.c_invoice_id) AS invoice_count
                FROM C_Invoice i
                WHERE EXTRACT(MONTH FROM i.dateinvoiced) = $1
                AND EXTRACT(YEAR FROM i.dateinvoiced) = $2
            `, [month, year]);

            const { rows: deliveryCount } = await dbClient.query(`
                SELECT COUNT(DISTINCT io.m_inout_id) AS delivery_count
                FROM M_InOut io
                WHERE EXTRACT(MONTH FROM io.movementdate) = $1
                AND EXTRACT(YEAR FROM io.movementdate) = $2
            `, [month, year]);

            return {
                salesOrder: salesOrderCount[0]?.sales_order_count || 0,
                invoice: invoiceCount[0]?.invoice_count || 0,
                delivery: deliveryCount[0]?.delivery_count || 0,
            };

        } catch (error) {
            fastify.log.error(error); // Use fastify's built-in logger
            reply.status(500).send({ error: 'Failed to fetch sales order, invoice, and delivery counts' });
        } finally {
            dbClient.release(); // Always release the client
        }
    });


}
