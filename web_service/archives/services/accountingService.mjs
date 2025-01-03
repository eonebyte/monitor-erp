  const getGlJournalData = async (dbClient, year, month) => {
    try {
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
  
    const { rows } = await dbClient.query(query, [year, month]);
    return rows;
    } catch (error) {
        throw new Error('Failed to fetch am_users');
    }
}
  
  
  export default {
    getGlJournalData,
  };
  