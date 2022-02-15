import { Component, OnInit } from '@angular/core';
import { FlashbotsService } from '../../services/flashbots.service';


@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent implements OnInit {

  constructor(
    public flashbotsService: FlashbotsService
  ) { }

  ngOnInit(): void {
  }

}
