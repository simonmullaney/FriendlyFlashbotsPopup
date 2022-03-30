import { Component, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FlashbotsService } from '../../services/flashbots.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedNetwork:any;
  network:Array<any> = [
      {id: 1, name: "Mainnet"},
      {id: 5, name: "Goerli"}
  ];

  constructor(
    public flashbotsService: FlashbotsService
  ){ }

  ngOnInit(): void {
    this.selectedNetwork = this.network[0];
  }

}
