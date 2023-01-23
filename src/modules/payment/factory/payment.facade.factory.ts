import PaymentFacadeInterface from "../facade/facade.interface";
import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repoitory";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";

export default class PaymentFacadeFactory {
  static create(): PaymentFacadeInterface {
    const repoitory = new TransactionRepository();
    const usecase = new ProcessPaymentUseCase(repoitory);
    const facade = new PaymentFacade(usecase);
    return facade;
  }
}
