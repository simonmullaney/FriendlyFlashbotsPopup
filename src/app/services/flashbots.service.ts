import { Injectable } from '@angular/core';
import { BigNumber, providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
const CHAIN_ID = 5;
const FLASHBOTS_GOERLI_ENDPOINT = "https://relay-goerli.flashbots.net/";
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n
// const GWEI = BigInt(BigNumber.from(10).pow(9))
// const ETHER = BigInt(BigNumber.from(10).pow(18))
const provider = new providers.InfuraProvider(CHAIN_ID);


@Injectable({
  providedIn: 'root'
})
export class FlashbotsService {
  loading = false;
  successModal = false;
  txHash: String;

  constructor() { }

  async submitFlashbotsBundle(transaction:any) {
    this.loading = true;
    const WALLET = new Wallet(transaction.privateKey,provider);

    // Standard json rpc provider directly from ethers.js (NOT Flashbots)
    const flashbotsProvider = await FlashbotsBundleProvider.create(provider,Wallet.createRandom(),FLASHBOTS_GOERLI_ENDPOINT);
    // console.log("flashbotsProvider");
    //
    // console.log(flashbotsProvider);

    var __this = this;

    provider.on('block', async(blockNumber) => {
      console.log("Blocknumber: " + blockNumber);
      const bundleSubmitResponse : any = await flashbotsProvider.sendBundle(
        [{
          transaction:{
            chainId: CHAIN_ID,
            type: 2,
            value: ETHER / 100n * 3n,
            data: transaction.data,
            maxFeePerGas: GWEI * 3n,//3
            maxPriorityFeePerGas: GWEI * 2n,//2
            to: transaction.to
          },
          signer:WALLET
        }],blockNumber + 1)
        .catch((err) => {
               __this.loading = false;
               console.log('ere2: '+  __this.loading);
               console.log(err);
         });
        console.log("bundleSubmitResponse");
        console.log(bundleSubmitResponse);
        console.log(await bundleSubmitResponse.wait());
        let bsr = await bundleSubmitResponse.wait();
        if(!bsr){
          console.log("Successful Falshbots Bundle sent in block: " + (blockNumber + 1));
          // console.log(bsr);
          // console.log(bundleSubmitResponse.bundleTransactions);
          // console.log(bundleSubmitResponse.bundleTransactions[0]);
          // console.log(bundleSubmitResponse.bundleTransactions[0].hash);
          __this.loading = false;
          __this.txHash = "https://goerli.etherscan.io/tx/"+bundleSubmitResponse.bundleTransactions[0].hash;
          console.log(__this.txHash);
          __this.successModal = true;
          provider.off('block');
        }
      })



    }
}
