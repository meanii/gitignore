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

  /**
   * Tricker when data chnanges
   * @param message
   */
  public changeMessage(message: string[]) {
    this.searchedResult.next(message)
  }

  /**
   * Requests all GitIngores to show in searchbar
   * @returns
   */
  public getAllGitIgnores() {
    let contentHeaders = new HttpHeaders()
      .set('Accept', 'application/vnd.github.v3+json')
    return this.httpClient.get<any>(this.BASE_URL + '/gitignore/templates', { headers: contentHeaders })
  }

  /**
   * Request requested gti context
   * @param ignore Gitignore
   * @returns
   */
  public getSearchedGits(ignore: string) {
    let contentHeaders = new HttpHeaders()
      .set('Accept', 'application/vnd.github.v3+json')
    return this.httpClient.get<any>(this.BASE_URL + '/gitignore/templates/' + ignore, { headers: contentHeaders })
  }


}
