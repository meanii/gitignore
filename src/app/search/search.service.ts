import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private BASE_URL = environment.API_URL

  searchResult: string[] = []
  private searchedResult = new BehaviorSubject(this.searchResult);
  csearchedResult = this.searchedResult.asObservable();


  constructor(private httpClient: HttpClient) { }

  public changeMessage(message: string[]) {
    this.searchedResult.next(message)
  }

  public getAllGitIgnores() {
    let contentHeaders = new HttpHeaders()
      .set('Accept', 'application/vnd.github.v3+json')
    return this.httpClient.get<any>(this.BASE_URL + '/gitignore/templates', { headers: contentHeaders })
  }

  public getSearchedGits(ignore: string) {
    let contentHeaders = new HttpHeaders()
      .set('Accept', 'application/vnd.github.v3+json')
    return this.httpClient.get<any>(this.BASE_URL + '/gitignore/templates/' + ignore, { headers: contentHeaders })
  }


}
