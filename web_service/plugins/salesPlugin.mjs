import salesInvoicePlugin from "../modules/sales/salesInvoice.mjs";
import salesOrderPlugin from "../modules/sales/salesOrder.mjs";
import salesOrderInvoiceDeliveryPlugin from "../modules/sales/salesOrderInvoiceDelivery.mjs";
import salesRevenuePlugin from "../modules/sales/salesRevenue.mjs";
import salesRevenueByDeliveryPlugin from "../modules/sales/salesRevenueByDelivery.mjs";

export default async function salesPlugin(app, opts) {
  app.register(salesOrderPlugin);
  app.register(salesInvoicePlugin);
  app.register(salesRevenuePlugin);
  app.register(salesOrderInvoiceDeliveryPlugin);
  app.register(salesRevenueByDeliveryPlugin);
}