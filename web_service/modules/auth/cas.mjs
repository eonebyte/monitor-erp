export default async function casPlugin(fastify, options) {
    fastify.get('/api/cAS', (request, reply) => {
        const user = request.session.get('user');
      
        if (user) {
          reply.send({ success: true, user });
        } else {
          reply.code(401).send({ success: false, message: 'Not authenticated' });
        }
      });
}