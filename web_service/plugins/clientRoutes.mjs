async function clientRoutes(fastify, options) {

    fastify.get('/:route', async (request, reply) => {
        return reply.sendFile('index.html');
    });

    // jika akses route "/*"
    fastify.setNotFoundHandler(async (request, reply) => {
        return reply.sendFile('index.html');
    });
}

export default clientRoutes;