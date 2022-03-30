import { Component, OnInit } from '@angular/core';
import { FlashbotsService } from '../../services/flashbots.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(
    public flashbotsService: FlashbotsService
  ) { }

  ngOnInit(): void {
  }

}
