import { Injectable } from '@angular/core';
import { BigNumber, providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
// const CHAIN_ID = 5;
const FLASHBOTS_GOERLI_ENDPOINT = "https://relay-goerli.flashbots.net/";
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n
// const GWEI = BigInt(BigNumber.from(10).pow(9))
// const ETHER = BigInt(BigNumber.from(10).pow(18))


@Injectable({
  providedIn: 'root'
})
export class FlashbotsService {
  loading = false;
  errorAlert = false;
  successModal = false;
  txHashArr:any=[];
  infoMessage: String = "Error, please retry again";
  selectedNetwork:any;
  bundleWaitMessage:any =["Submitting bundle to block number: 300001"];

  constructor() { }

  async submitFlashbotsBundle(transactionBundle:any) {
    console.log("Selected Network: "+ this.selectedNetwork.id +"Transaction bundle: ",transactionBundle);
    console.log(transactionBundle.transactionArray);

    const provider = new providers.InfuraProvider(this.selectedNetwork.id);
    this.loading = true;
    const WALLET = new Wallet(transactionBundle.transactionArray[0].privateKey,provider);

    // Standard json rpc provider directly from ethers.js (NOT Flashbots)
    const flashbotsProvider = await FlashbotsBundleProvider.create(provider,Wallet.createRandom(),FLASHBOTS_GOERLI_ENDPOINT);
    var __this = this;
    let submittedTransactionArray:any = [];

    for(let i=0;i<transactionBundle.transactionArray.length;i++){
      let transaction:any = {};
      console.log("Looping through transactionBundle, iteration: ",i," for transaction: ",transaction);
      transaction.chainId = this.selectedNetwork.id;
      transaction.type = Number(transactionBundle.transactionArray[i].transactionType);
      transaction.value = ETHER / 100n * BigInt(transactionBundle.transactionArray[i].value);
      transaction.data = transactionBundle.transactionArray[i].data;
      transaction.maxFeePerGas = GWEI * BigInt(transactionBundle.transactionArray[i].maxFeePerGas);
      transaction.maxPriorityFeePerGas = GWEI * BigInt(transactionBundle.transactionArray[i].maxPriorityFeePerGas);
      transaction.to = transactionBundle.transactionArray[i].to;

      // transaction.gasLimit = 50000000;
      submittedTransactionArray.push({transaction:transaction, signer:WALLET})
    }

    return new Promise((resolve, reject) => {
      console.log(provider);
      provider.on('block', async(blockNumber) => {
        console.log("Blocknumber: " + blockNumber);
        console.log("submittedTransactionArray: ",submittedTransactionArray);

        __this.bundleWaitMessage.push("Submitting bundle to block number: " + blockNumber)

        const bundleSubmitResponse :any = await flashbotsProvider.sendBundle(
          submittedTransactionArray,blockNumber + 1)
          .catch((err) => {
                  console.log("Error on submitFlashbotsBundle: ",err);
                  __this.errorAlert = true;
                  __this.loading = false;
                  __this.infoMessage = err.code;
                  provider.off( 'block' )
                  throw new Error('Throwing error on submitFlashbotsBundle');
           });
          let bsr = await bundleSubmitResponse.wait();
          console.log("bundleSubmitResponse",bsr);

          if(!bsr){
            console.log("Successful Falshbots Bundle sent in block: " + (blockNumber + 1));
            __this.loading = false;

            console.log(bundleSubmitResponse);
            console.log(bundleSubmitResponse.bundleTransactions);
            console.log(bundleSubmitResponse.bundleTransactions.length);

            for(let j=0;j<bundleSubmitResponse.bundleTransactions.length;j++){
              if (__this.selectedNetwork.id == 1) {
                __this.txHashArr.push("https://etherscan.io/tx/"+bundleSubmitResponse.bundleTransactions[j].hash);

              }else{
                __this.txHashArr.push("https://goerli.etherscan.io/tx/"+bundleSubmitResponse.bundleTransactions[j].hash);
              }
            }
            console.log("bundleSubmitResponse: ",bundleSubmitResponse);
            console.log("txHashArr: ",__this.txHashArr);
            __this.successModal = true;
            provider.off('block');
          } else{
            __this.bundleWaitMessage = [];

          }
        })
      })
  }
}
