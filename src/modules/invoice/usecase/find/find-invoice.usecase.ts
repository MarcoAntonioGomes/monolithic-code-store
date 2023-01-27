import UseCaseInterface from "../../../@shared/domain/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    let result = await this.invoiceRepository.find(input.id);

    let total = result.calcularTotal();

    let items = result.items.map((item) => {
      return {
        id: item.id.id,
        name: item.name,
        price: item.price,
      };
    });

    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      address: {
        street: result.address.getStreet(),
        number: result.address.getNumber(),
        city: result.address.getCity(),
        state: result.address.getState(),
        zipCode: result.address.getZipCode(),
        complement: result.address.getComplement(),
      },
      createdAt: result.createdAt,
      items: items,
      total: total,
    };
  }
}
