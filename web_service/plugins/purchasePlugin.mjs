import PurchaseInvoicePlugin from "../modules/purchase/purchaseInvoice.mjs";
import VendorDueDate from "../modules/purchase/vendorDueDate.mjs";
async function invoicePlugin(fastify, opts) {
    fastify.register(VendorDueDate);
    fastify.register(PurchaseInvoicePlugin);
};

export default invoicePlugin;