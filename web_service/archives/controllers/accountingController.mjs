import accountingServices from '../services/accountingService.mjs';

const getGlJournal = async (fastify, request, reply) => {
    const { year, month } = request.query || {};

  // Get current date
  const currentDate = new Date();
  const defaultYear = currentDate.getFullYear();
  const defaultMonth = currentDate.getMonth() + 1; // Months are 0-based in JavaScript

  // Use default values if parameters are not provided
  const validYear = year ? parseInt(year, 10) : defaultYear;
  const validMonth = month ? parseInt(month, 10) : defaultMonth;

  // Validate the input
  if (isNaN(validYear) || isNaN(validMonth) || validMonth < 1 || validMonth > 12) {
    reply.status(400).send({ error: 'Invalid year or month' });
    return;
  }
  let dbClient;

  try {
    dbClient = await fastify.pg.connect(); // Ambil koneksi baru
    const rows = await accountingServices.getGlJournalData(dbClient, validYear, validMonth);
    return reply.send(rows);
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Failed to fetch GL Journal data' });
  } finally {
    if (dbClient) {
      dbClient.release(); 
    }
  }
};

export default {
  getGlJournal,
};
