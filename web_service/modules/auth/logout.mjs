export default async function logoutPlugin(fastify, options) {
    fastify.get('/api/logout', (request, reply) => {
        // Destroy the session
        request.session.delete();
        reply.send({ success: true, message: 'Logged out successfully' });
      });
}