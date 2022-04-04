import { Injectable } from '@angular/core';
import { BigNumber, providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
// const CHAIN_ID = 5;
const FLASHBOTS_GOERLI_ENDPOINT = "https://relay-goerli.flashbots.net/";
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n


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
  bundleWaitMessage:any =[];
  provider:any;

  constructor() { }


  async simulateFlashbotBundle(transactionBundle:any){
    // console.log("SIMULATING - Selected Network: "+ this.selectedNetwork.id +"Transaction bundle: ",transactionBundle);
    this.provider = new providers.InfuraProvider(this.selectedNetwork.id);
    this.loading = true;
    let WALLET:any;

    try {
      WALLET = new Wallet(transactionBundle.transactionArray[0].privateKey,this.provider)
    } catch (err) {
      console.log("Error on simulating creating Wallet: ",err);
      this.errorAlert = true;
      this.loading = false;
      this.infoMessage = err.code;
      throw new Error('Throwing error simulating creating Wallet');
    }

    // Standard json rpc provider directly from ethers.js (NOT Flashbots)
    const flashbotsProvider = await FlashbotsBundleProvider.create(this.provider,Wallet.createRandom(),FLASHBOTS_GOERLI_ENDPOINT).catch((err) => {
        console.log("Error on creating flashbot provider: ",err);
        __this.errorAlert = true;
        __this.loading = false;
        __this.infoMessage = err.code;
        __this.provider.off( 'block' )
        throw new Error('Throwing error on creating flashbot provider');
     });
    var __this = this;
    let submittedTransactionArray:any = [];
    for(let i=0;i<transactionBundle.transactionArray.length;i++){
      let transaction:any = {};
      // console.log("Looping through transactionBundle, iteration: ",i," for transaction: ",transaction);
      transaction.chainId = this.selectedNetwork.id;
      transaction.type = Number(transactionBundle.transactionArray[i].transactionType);
      transaction.value = BigInt(transactionBundle.transactionArray[i].value);
      transaction.data = transactionBundle.transactionArray[i].data;
      transaction.gasLimit = BigInt(transactionBundle.transactionArray[i].gasLimit);
      transaction.maxFeePerGas = BigInt(transactionBundle.transactionArray[i].maxFeePerGas);
      transaction.maxPriorityFeePerGas = BigInt(transactionBundle.transactionArray[i].maxPriorityFeePerGas);
      transaction.to = transactionBundle.transactionArray[i].to;

      // transaction.gasLimit = 50000000;
      submittedTransactionArray.push({transaction:transaction, signer:WALLET})
    }

    return new Promise(resolve => {
        this.provider.once('block', async(blockNumber:any) => {
          __this.bundleWaitMessage.unshift("\nSimulating transaction...")
          const signedTransactions = await flashbotsProvider.signBundle(submittedTransactionArray).catch((err) => {
              console.log("Error on SIMULATE signing FlashbotsBundle: ",err);
              __this.errorAlert = true;
              __this.loading = false;
              __this.infoMessage = err.code;
              __this.provider.off( 'block' )
              throw new Error('Throwing error SIMULATE signing FlashbotsBundle');
           });
          let simulate :any = await flashbotsProvider.simulate(signedTransactions,blockNumber + 1).catch((err) => {
              console.log("Error on SIMULATE FlashbotsBundle: ",err);
              __this.errorAlert = true;
              __this.loading = false;
              __this.infoMessage = err.code;
              __this.provider.off( 'block' )
              throw new Error('Throwing error on submitFlashbotsBundle');
           });
          // console.log(simulate)
          if(simulate.error){
            __this.errorAlert = true;
            __this.loading = false;
            __this.infoMessage = simulate.error.message;
            __this.provider.off( 'block' )
            throw new Error('Throwing error on simulate transaction');
          }else{
            __this.provider.off( 'block' )
            console.log("SUCCESS, FINISHED SIMULATING");
            __this.bundleWaitMessage.unshift("\nSuccess, finished simulating...")
          }
          resolve(simulate)
        })
    });
  }

  async submitFlashbotsBundle(transactionBundle:any) {
    // console.log("Selected Network: "+ this.selectedNetwork.id +"Transaction bundle: ",transactionBundle);
    // console.log(transactionBundle.transactionArray);

    this.provider = new providers.InfuraProvider(this.selectedNetwork.id);
    this.loading = true;
    const WALLET = new Wallet(transactionBundle.transactionArray[0].privateKey,this.provider);

    // Standard json rpc provider directly from ethers.js (NOT Flashbots)
    const flashbotsProvider = await FlashbotsBundleProvider.create(this.provider,Wallet.createRandom(),FLASHBOTS_GOERLI_ENDPOINT);
    var __this = this;
    let submittedTransactionArray:any = [];

    for(let i=0;i<transactionBundle.transactionArray.length;i++){
      let transaction:any = {};
      // console.log("Looping through transactionBundle, iteration: ",i," for transaction: ",transaction);
      transaction.chainId = this.selectedNetwork.id;
      transaction.type = Number(transactionBundle.transactionArray[i].transactionType);
      transaction.value = BigInt(transactionBundle.transactionArray[i].value);
      transaction.data = transactionBundle.transactionArray[i].data;
      transaction.gasLimit = BigInt(transactionBundle.transactionArray[i].gasLimit);
      transaction.maxFeePerGas = BigInt(transactionBundle.transactionArray[i].maxFeePerGas);
      transaction.maxPriorityFeePerGas = BigInt(transactionBundle.transactionArray[i].maxPriorityFeePerGas);
      transaction.to = transactionBundle.transactionArray[i].to;

      // transaction.gasLimit = 50000000;
      submittedTransactionArray.push({transaction:transaction, signer:WALLET})
    }

    return new Promise((resolve, reject) => {
      // console.log(provider);
      this.provider.on('block', async(blockNumber:any) => {
        // console.log("Blocknumber: " + blockNumber);
        // console.log("submittedTransactionArray: ",submittedTransactionArray);
        __this.bundleWaitMessage.unshift("\nSubmitting bundle to block number: " + blockNumber)

        const bundleSubmitResponse :any = await flashbotsProvider.sendBundle(
          submittedTransactionArray,blockNumber + 1)
          .catch((err) => {
              console.log("Error on submitFlashbotsBundle: ",err);
              __this.errorAlert = true;
              __this.loading = false;
              __this.infoMessage = err.code;
              __this.provider.off( 'block' )
              throw new Error('Throwing error on submitFlashbotsBundle');
           });

          let bsr = await bundleSubmitResponse.wait();

          if(!bsr){
            // console.log("Successful Falshbots Bundle sent in block: " + (blockNumber + 1));
            __this.loading = false;

            // console.log(bundleSubmitResponse);
            // console.log(bundleSubmitResponse.bundleTransactions);
            // console.log(bundleSubmitResponse.bundleTransactions.length);

            for(let j=0;j<bundleSubmitResponse.bundleTransactions.length;j++){
              if (__this.selectedNetwork.id == 1) {
                __this.txHashArr.push("https://etherscan.io/tx/"+bundleSubmitResponse.bundleTransactions[j].hash);

              }else{
                __this.txHashArr.push("https://goerli.etherscan.io/tx/"+bundleSubmitResponse.bundleTransactions[j].hash);
              }
            }
            // console.log("bundleSubmitResponse: ",bundleSubmitResponse);
            // console.log("txHashArr: ",__this.txHashArr);
            __this.successModal = true;
            // console.log("provider: ", provider);

            __this.provider.off('block');
          }
        })
      })
  }

  cancelFlashbotsBundle(){
    console.log("Canceling Flashbots Bundle");
    this.bundleWaitMessage = [];
    this.provider.off( 'block' )
    this.loading = false;

  }
}
