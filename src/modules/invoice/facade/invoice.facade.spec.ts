import { InvoiceModel } from "../repository/invoice.model";
import { ProductInvoiceModel } from "../repository/product-invoice.model";
import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate/generate-invoice.usecase";
import FindInvoiceUseCase from "../usecase/find/find-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.factory";

describe("Invoice Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductInvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "2",
      name: "Invoice 2",
      document: "123456789",
      street: "Street 1",
      number: "1",
      complement: "Casa 1",
      zipCode: "12345678",
      city: "São Paulo",
      state: "SP",
      items: [
        {
          id: "3",
          name: "Product 3",
          price: 10,
        },
        {
          id: "4",
          name: "Product 4",
          price: 20,
        },
      ],
    };

    await facade.generate(input);

    const invoice = await InvoiceModel.findOne({
      where: { id: input.id },
      include: ["items"],
    });

    console.log(invoice);
    expect(invoice).not.toBeNull();
    expect(invoice.id).toBe("2");
    expect(invoice.name).toBe("Invoice 2");
    expect(invoice.document).toBe("123456789");
    expect(invoice.street).toBe("Street 1");
    expect(invoice.number).toBe("1");
    expect(invoice.complement).toBe("Casa 1");
    expect(invoice.zipCode).toBe("12345678");
    expect(invoice.city).toBe("São Paulo");
    expect(invoice.state).toBe("SP");
    expect(invoice.items.length).toBe(2);
  });

  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
      name: "Invoice 1",
      document: "123456789",
      street: "Street 1",
      number: "1",
      complement: "Casa 1",
      zipCode: "12345678",
      city: "São Paulo",
      state: "SP",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
        },
        {
          id: "2",
          name: "Product 2",
          price: 20,
        },
      ],
    };

    await facade.generate(input);

    const result = await facade.find({ id: "1" });

    expect(result.id).toEqual("1");
    expect(result.name).toEqual("Invoice 1");
    expect(result.document).toEqual("1234567890");
    expect(result.street).toEqual("street 1");
    expect(result.complement).toEqual("Next to drugstore");
    expect(result.number).toEqual("123");
    expect(result.city).toEqual("City 1");
    expect(result.state).toEqual("SO");
    expect(result.zipCode).toEqual("123654987");

    expect(result.items.length).toBe(2);

    expect(result.items[0].id).toEqual("1");
    expect(result.items[0].name).toEqual("Product 1");
    expect(result.items[0].price).toEqual(20);

    expect(result.items[1].id).toEqual("2");
    expect(result.items[1].name).toEqual("Product 2");
    expect(result.items[1].price).toEqual(30);

    expect(result.total).toBe(50);
  });
});
