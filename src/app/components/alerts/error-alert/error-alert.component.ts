import { Component, OnInit } from '@angular/core';
import { FlashbotsService } from '../../../services/flashbots.service';


@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.css']
})
export class ErrorAlertComponent implements OnInit {

  constructor(
    public flashbotsService: FlashbotsService
  ) { }

  ngOnInit(): void {
  }

  closeModal(){
    console.log("Closing Info Modal");
    this.flashbotsService.errorAlert = false;
  }

}
