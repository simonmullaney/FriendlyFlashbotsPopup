import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { FlashbotsService } from '../../services/flashbots.service';
import { FormBuilder, FormControl,FormGroup, ReactiveFormsModule,FormArray } from '@angular/forms';
import $ from 'jquery';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  network:Array<any> = [
      {id: 1, name: "Mainnet"},
      {id: 5, name: "Goerli"}
  ];
  addMultipleTransactions: boolean = false;
  animateNumber: number = 0;
  bundleTransactions:any;
  numBundleTansactions: number = 1;
  myGroup: FormGroup;
  transactionArray: FormArray;


  constructor(
    public flashbotsService: FlashbotsService,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {
    this.myGroup = this.fb.group({
      transactionArray: this.fb.array([this.createBundleForm()])
    })
  }

  getControls() {
    return (this.myGroup.get('transactionArray') as FormArray).controls;
  }
  createBundleForm(){
    return this.fb.group({
      privateKey: [''],
      to: [''],
      value: [''],
      transactionType: [''],
      gasLimit: [''],
      maxFeePerGas: [''],
      maxPriorityFeePerGas: [''],
      data:['']
    })
  }

  async handleSubmit() {
    var __this = this;
    let transactionBundle:any;
    console.log("Form Values: ",this.myGroup.value);
    transactionBundle = this.myGroup.value;
    this.flashbotsService.bundleWaitMessage = [];


    let simulate = await this.flashbotsService.simulateFlashbotBundle(transactionBundle);
    console.log("FINISHED simulation,  in handle submit");

    await this.flashbotsService.submitFlashbotsBundle(transactionBundle)
      .catch(function(err){
        // console.log('Error: ', err);
        __this.flashbotsService.errorAlert = true;
        __this.flashbotsService.loading = false;
        __this.flashbotsService.errorAlert = true;
        __this.flashbotsService.loading = false;
        __this.flashbotsService.infoMessage = err;
      });
  }

  addTransactiontoBundle(){
    console.log("Adding transaction to bundle");
    this.numBundleTansactions = this.numBundleTansactions + 1;
    this.bundleTransactions = Array(this.numBundleTansactions);
    this.addMultipleTransactions = true;

    this.transactionArray = this.myGroup.get('transactionArray') as FormArray;
    console.log('this.transactionArray');
    console.log(this.transactionArray);

    this.transactionArray.push(this.createBundleForm());


  }

  animateSliderDecrement() {
    // console.log("In animateSliderDecrement");
    let __this = this;
    console.log(__this.animateNumber);
    if (__this.animateNumber > 0) {
      __this.animateNumber = __this.animateNumber - 1;
      console.log(__this.animateNumber);
      $('#slides-container').animate({
        'margin-left': -(95 * __this.animateNumber) + '%'
      });
    }
  }
  openURL(){
    console.log("Opening openURL");
     window.open('https://etherscan.io/unitconverter','_blank')
  }

  animateSliderIncrement() {
    // console.log("In animateSliderIncrement");

    let __this = this;
    console.log(__this.animateNumber);
    if (__this.animateNumber < this.numBundleTansactions -1) {
      __this.animateNumber = __this.animateNumber + 1;
      console.log(__this.animateNumber);
      $('#slides-container').animate({
        'margin-left': - (95 * __this.animateNumber) + '%'
      });
    }
  }

}
