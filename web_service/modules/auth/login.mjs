export default async function loginPlugin(fastify, options) {
    fastify.post('/api/login', async (request, reply) => {
        const dbClient = await fastify.pg.connect();
        const { username, password } = request.body;
        try {
          const result = await dbClient.query(
            'SELECT * FROM AD_User WHERE Name = $1 AND Password = $2 AND IsActive = \'Y\'',
            [username, password]
          );
      
          if (result.rowCount > 0) {
            const user = result.rows[0];
            
            // Set session with user information
            request.session.set('user', {
              id: user.ad_user_id,
              name: user.name,
            });
      
            reply.send({ success: true, user: { id: user.ad_user_id, name: user.name } });
          } else {
            reply.code(401).send({ success: false, message: 'Invalid credentials' });
          }
        } catch (error) {
          fastify.log.error(error);
          reply.code(500).send({ success: false, message: 'Server error' });
        }
      });
}