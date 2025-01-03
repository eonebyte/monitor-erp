import authService from "../services/authService.mjs";

const cas = async (request, reply) => {
    const user = request.session.get('user');

    if (user) {
        reply.send({ success: true, user });
    } else {
        reply.code(401).send({ success: false, message: 'Not Authenticated' });
    }
}

const login = async (fastify, request, reply) => {
    const { username, password } = request.body;
    let dbClient;
    try {
        dbClient = await fastify.pg.connect();
        const result = await authService.login(dbClient, username, password);
        if (result.rowCount > 0) {
            const user = result.rows[0];

            request.session.set('user', {
                id: user.ad_user_id,
                name: user.name
            });

            reply.send({ success: true, user: { id: user.ad_user_id, name: user.name } })
        } else {
            reply.code(401).send({ success: false, message: 'Invalid Credentials' });
        }
    } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Failed to Auth' });
    } finally {
        if (dbClient) {
          dbClient.release(); 
        }
      }
}

const logout = async (request, reply) => {
    request.session.delete();
    reply.send({ success: true, message: 'Logged out successfully' });
}

export default {
    cas,
    login,
    logout
}