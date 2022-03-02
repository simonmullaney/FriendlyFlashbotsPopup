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


  constructor(
    formBuilder: FormBuilder,
    public flashbotsService: FlashbotsService
   ) {}

   ngOnInit() {
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
      let transaction:any = {};

      try {
        transaction.privateKey =  this.myGroup.value.privateKey;
        transaction.data = this.myGroup.value.data;
        transaction.type = Number(this.myGroup.value.transactionType)
        transaction.to = this.myGroup.value.to;
        transaction.value = this.myGroup.value.value;
        transaction.maxFeePerGas = BigInt(this.myGroup.value.maxFeePerGas);
        transaction.maxPriorityFeePerGas = BigInt(this.myGroup.value.maxPriorityFeePerGas);

        this.flashbotsService.submitFlashbotsBundle(transaction)

      } catch (error) {
        console.log(error);
      }


    }
   }
