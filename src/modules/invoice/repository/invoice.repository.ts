import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice";
import Product from "../domain/entity/product.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import Address from "../value-object/address";
import { InvoiceModel } from "./invoice.model";
import { ProductInvoiceModel } from "./product-invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id: id },
      include: ["items"],
    });

    if (!invoice) {
      throw new Error("Invoice not found!");
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
        complement: invoice.complement,
      }),
      items: invoice.items.map((item) => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      }),
    });
  }

  async generate(invoice: Invoice): Promise<void> {
    const test = await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.getStreet(),
        number: invoice.address.getNumber(),
        city: invoice.address.getCity(),
        state: invoice.address.getState(),
        zipCode: invoice.address.getZipCode(),
        complement: invoice.address.getComplement(),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map((item) => {
          return {
            id: item.id.id,
            name: item.name,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        }),
      },
      {
        include: [{ model: ProductInvoiceModel }],
      }
    );
  }
}
