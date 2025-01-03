async function glJournal(fastify, options) {
    fastify.get('/api/accounting/gl-journal', async (request, reply) => {
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
                SELECT 
                    gj.GL_Journal_ID,
                    gj.DocumentNo AS Journal_DocumentNo,
                    gj.DateDoc AS Journal_DateDoc,
                    gj.Description AS Journal_Description,
                    gj.C_Currency_ID AS Journal_Currency,
                    gj.TotalDr AS Journal_TotalDr,
                    gj.TotalCr AS Journal_TotalCr,
                    gjl.GL_JournalLine_ID,
                    gjl.Line AS Line_No,
                    gjl.Description AS Line_Description,
                    gjl.Account_ID AS Line_Account,
                    acc.name AS Account_Name,
                    gjl.AmtSourceDr AS Line_AmtSourceDr,
                    gjl.AmtSourceCr AS Line_AmtSourceCr,
                    gjl.AmtAcctDr AS Line_AmtAcctDr,
                    gjl.AmtAcctCr AS Line_AmtAcctCr
                FROM 
                    GL_Journal gj
                JOIN 
                    GL_JournalLine gjl ON gj.GL_Journal_ID = gjl.GL_Journal_ID
                JOIN 
                    c_elementvalue acc ON gjl.account_id = acc.c_elementvalue_id
                WHERE 
                    gj.AD_Client_ID = 1000000
                    AND gj.AD_Org_ID = 1000020
                    AND EXTRACT(YEAR FROM gj.DateDoc) = $1
                    AND EXTRACT(MONTH FROM gj.DateDoc) = $2
                ORDER BY 
                    gj.GL_Journal_ID, 
                    gjl.Line;
            `;

            const { rows } = await dbClient.query(query, [validYear, validMonth]);
            
            // Process data to group journal lines by journal
            const journals = {};
            rows.forEach(row => {
                const journalId = row.gl_journal_id;

                if (!journals[journalId]) {
                    // Initialize the journal object if it doesn't exist
                    journals[journalId] = {
                        GL_Journal_ID: journalId,
                        DocumentNo: row.journal_documentno,
                        DateDoc: row.journal_datedoc,
                        Description: row.journal_description,
                        C_Currency_ID: row.journal_currency,
                        TotalDr: row.journal_totaldr,
                        TotalCr: row.journal_totalcr,
                        Lines: []  // Array to hold all journal lines for this journal
                    };
                }

                // Push the journal line into the Lines array
                journals[journalId].Lines.push({
                    GL_JournalLine_ID: row.gl_journalline_id,
                    Line_No: row.line_no,
                    Description: row.line_description,
                    Account_ID: row.line_account,
                    Account_Name: row.account_name,
                    AmtSourceDr: row.line_amtsourcedr,
                    AmtSourceCr: row.line_amtsourcecr,
                    AmtAcctDr: row.line_amtacctdr,
                    AmtAcctCr: row.line_amtacctcr
                });
            });

            // Convert the journals object to an array
            const result = Object.values(journals);
            return reply.send(result);

        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to fetch GL Journal data' });
        } finally {
            // Release the database client
            dbClient.release(); 
        }
    });
}

export default glJournal;
