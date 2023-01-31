import UseCaseInterface from "../../../@shared/domain/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    // buscar o client. Caso não encontre -> client not found

    const client = await this._clientFacade.find({ id: input.clientId });

    if (!client) {
      throw new Error("Client not found");
    }

    await this.validateProducts(input);

    //recuperar os produtos

    //criar o objeto do client

    //criar o objeto do order (client, products)

    //processpayment ->paymentfacade.process (orderId, amout)

    //caso pagamento seja aprovado -> Gerar invoice

    // mudar o status da minha order para approved

    // retornar dto

    return {
      id: "1",
      invoiceId: "1",
      status: "pending",
      total: 0,
      products: [],
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(`Product ${p.productId} is not available in stock`);
      }
    }
  }
}
