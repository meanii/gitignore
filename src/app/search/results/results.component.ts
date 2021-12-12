import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  searchedResult: string[];
  subscription: Subscription;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.subscription = this.searchService.csearchedResult.subscribe(searchedResult => this.searchedResult = searchedResult)
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
