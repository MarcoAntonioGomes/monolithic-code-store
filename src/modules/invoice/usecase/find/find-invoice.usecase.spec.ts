import Invoice from "../../domain/entity/invoice";
import Product from "../../domain/entity/product.entity";
import Address from "../../value-object/address";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address({
  street: "Rua 1",
  number: "1",
  city: "Cidade 1",
  state: "Estado 1",
  zipCode: "12345678",
});

const prod1 = new Product({
  name: "Produto 1",
  price: 10,
});

const prod2 = new Product({
  name: "Produto 2",
  price: 15,
});

const items = [prod1, prod2];

const invoice = new Invoice({
  name: "Cliente 1",
  document: "123456789",
  address: address,
  items: items,
});

const mockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn(),
  };
};

describe("Find invoice usecase unit test", () => {
  it("should find an invoice", async () => {
    const invoiceRepository = mockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(result.id).toBe(invoice.id.id);
    expect(invoiceRepository.find).toBeCalledTimes(1);
    expect(result.name).toBe("Cliente 1");
    expect(result.document).toBe("123456789");
    expect(result.city).toBe(address.getCity());
    expect(result.items[0].id).toBe(items[0].id.id);
  });
});
