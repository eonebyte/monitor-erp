async function summaryAccount(fastify, options) {
    fastify.get('/api/accounting/summary-account', async (request, reply) => {
        // Connect to the database
        const dbClient = await fastify.pg.connect();
        
        const { year, month } = request.query || {};
        
        const currentDate = new Date();
        const defaultYear = currentDate.getFullYear();
        const defaultMonth = currentDate.getMonth() + 1; 
        
        const validYear = year ? parseInt(year, 10) : defaultYear;
        const validMonth = month ? parseInt(month, 10) : defaultMonth;
        
        if (isNaN(validYear) || isNaN(validMonth) || validMonth < 1 || validMonth > 12) {
            dbClient.release(); 
            reply.status(400).send({ error: 'Invalid year or month' });
        }

        try {
            // SQL query with parameterized inputs
            const query = `
                WITH JournalData AS (
                    SELECT
                        acc.name AS account_name,
                        acc.value AS account_code,
                        gj.description AS description,
                        gj.documentno AS refno,
                        TO_CHAR(gj.datedoc, 'DD-MM-YYYY') AS transaction_date,
                        gjl.amtacctdr AS debit,
                        gjl.amtacctcr AS credit
                    FROM gl_journal gj
                    JOIN gl_journalline gjl ON gj.gl_journal_id = gjl.gl_journal_id
                    JOIN c_elementvalue acc ON gjl.account_id = acc.c_elementvalue_id
                    WHERE 
                        gj.ad_client_id = 1000000 
                        AND gj.ad_org_id = 1000020
                        AND gj.docstatus != 'RE'
                        AND EXTRACT(YEAR FROM gj.datedoc) = $1
                        AND EXTRACT(MONTH FROM gj.datedoc) = $2
                )
                SELECT
                    account_name,
                    account_code,
                    description,
                    refno,
                    transaction_date,
                    SUM(debit) AS total_debit,
                    SUM(credit) AS total_credit
                FROM JournalData
                GROUP BY account_name, account_code, description, refno, transaction_date
                ORDER BY account_name, transaction_date;
            `;
            
            // Execute the query with validated year and month
            const { rows } = await dbClient.query(query, [validYear, validMonth]);
            return reply.send(rows);

        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to fetch GL Journal data' });
        } finally {
            // Release the database client
            dbClient.release(); 
        }
    });
}

export default summaryAccount;
