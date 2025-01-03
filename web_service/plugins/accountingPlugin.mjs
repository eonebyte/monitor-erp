import glJournal from "../modules/accounting/glJournal.mjs";
import summaryAccount from "../modules/accounting/summaryAccount.mjs";

async function accountingPlugin(fastify, options) {
    fastify.register(glJournal)
    fastify.register(summaryAccount)
}

export default accountingPlugin;

