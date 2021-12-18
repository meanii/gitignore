import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SearchService } from './search.service';
import { Permissions } from '../router-gaurd.guard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GitHeader } from './context.header';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  gitCtrl = new FormControl();
  filteredGits: Observable<string[]>;
  gits: string[] = [];
  filteredNgModelOptions$: Observable<string[]>;
  allGitsIngores: string[] = [];
  searchGits: string[] = [];
  isCreated: boolean = false;
  header: string = new GitHeader().header;

  @ViewChild('gitInput') gitInput: ElementRef<HTMLInputElement>;

  constructor(
    private searchService: SearchService,
    private router: Router,
    private permissions: Permissions,
    private _snackBar: MatSnackBar
  ) {
    this.filteredGits = this.gitCtrl.valueChanges.pipe(
      startWith(null),
      map((git: string | null) =>
        git ? this._filter(git) : this.allGitsIngores.slice()
      )
    );
  }

  ngOnInit(): void {
    this.getAllGits();
    this.filteredNgModelOptions$ = of(this.allGitsIngores);
    this.permissions.canGoToRoute(false);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our git
    if (value) {
      this.gits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.gitCtrl.setValue(null);
  }

  /**
   * Remove tags helper
   * @param git
   */
  remove(git: string): void {
    const index = this.gits.indexOf(git);

    if (index >= 0) {
      this.gits.splice(index, 1);
    }
  }

  /**
   * Event Tag helper to set enter tags into tag list
   * @param event
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.gits.push(event.option.viewValue);
    this.gitInput.nativeElement.value = '';
    this.gitCtrl.setValue(null);
  }

  /**
   *
   * @param value event tags helper thats manange to lower case and upper case
   * @returns
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGitsIngores.filter((git) =>
      git.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Pushs all requested data to the caches
   */
  public getAllGits() {
    this.searchService.getAllGitIgnores().subscribe((data) => {
      this.allGitsIngores = data;
    });
  }

  /**
   * call onCreate when use creates on Create button and requests to API
   */
  onCreate() {
    if (this.gits.length == 0) {
      this.openSnackBar('Please add some value in input.', 'got it!');
      return;
    }
    for (let i in this.gits) {
      this.searchService.getSearchedGits(this.gits[i]).subscribe((data) => {
        this.searchGits.push(data.source);
      });
    }
    this.searchGits.splice(0, 0, this.header);
    this.openSnackBar(
      'Your .gitingore content has been created, you can choose your mode to get it!',
      'got it!'
    );
    this.isCreated = true;
    this.searchService.changeMessage(this.searchGits);
    this.permissions.canGoToRoute(true);
  }

  /**
   * notifiaction bar trigger
   * @param message {string} string which you want to show in notification
   * @param action {string} the actoin should be show in notification pannel
   */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  /**
   * Call onView function when user clicks on view button, It's navigates to /results route
   */
  onView(): void {
    this.router.navigate(['results']);
  }

  /**
   * onDownload() calls when user clickes on dowload button
   */
  onDownload() {
    this.download('git.gitignore', this.searchGits.join('\n\n\n'));
    this.openSnackBar(
      'Your .gitingore content has been downloaded.',
      'got it!'
    );
  }

  /**
   * Download helper from client side
   * @filename {string} pass filename which you want to be download
   * @text {string} pass the file's context
   */
  download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/octet-stream,' + encodeURIComponent(text)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Copy helper
   */
  onCopy() {
    if (this.searchGits.length != 0) {
      navigator.clipboard.writeText(this.searchGits.join('\n\n\n'));
      this.openSnackBar('Your .gitingore content has been copied.', 'got it!');
    }
  }
}
