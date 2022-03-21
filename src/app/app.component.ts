import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlashbotsService } from './services/flashbots.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  myGroup: FormGroup;

  selectedNetwork:any;
  network:Array<any> = [
      {id: 1, name: "Mainnet"},
      {id: 5, name: "Goerli"}
  ];


  constructor(
    formBuilder: FormBuilder,
    public flashbotsService: FlashbotsService
   ) {}

   ngOnInit() {
     this.selectedNetwork = this.network[0];
     this.myGroup = new FormGroup({
       'privateKey': new FormControl(''),
       'to': new FormControl(''),
       'value': new FormControl(''),
       'transactionType': new FormControl(''),
       'gasLimit': new FormControl(''),
       'maxFeePerGas': new FormControl(''),
       'maxPriorityFeePerGas': new FormControl(''),
       'data': new FormControl('')
     });
    }

    async handleSubmit() {
      var __this = this;
      let transaction:any = {};
      // console.log("Selected Network: ");
      // console.log(this.selectedNetwork);

      transaction.network = this.selectedNetwork.id;
      transaction.privateKey =  this.myGroup.value.privateKey;
      transaction.data = this.myGroup.value.data;
      transaction.type = Number(this.myGroup.value.transactionType)
      transaction.to = this.myGroup.value.to;
      transaction.value = this.myGroup.value.value;
      transaction.maxFeePerGas = BigInt(this.myGroup.value.maxFeePerGas);
      transaction.maxPriorityFeePerGas = BigInt(this.myGroup.value.maxPriorityFeePerGas);

      this.flashbotsService.submitFlashbotsBundle(transaction)
        .catch(function(err){
          console.log('ere');
          __this.flashbotsService.errorAlert = true;
          __this.flashbotsService.loading = false;
        });




    }
   }
