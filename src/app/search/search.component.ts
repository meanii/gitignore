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

  ngOnInit(
  ): void {
    this.getAllGits();
    this.filteredNgModelOptions$ = of(this.allGitsIngores);
    this.permissions.canGoToRoute(false)
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

  remove(git: string): void {
    const index = this.gits.indexOf(git);

    if (index >= 0) {
      this.gits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.gits.push(event.option.viewValue);
    this.gitInput.nativeElement.value = '';
    this.gitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGitsIngores.filter((git) =>
      git.toLowerCase().includes(filterValue)
    );
  }

  public getAllGits(){
    this.searchService.getAllGitIgnores().subscribe((data) => {
      this.allGitsIngores = data
    })
  }

  onCreate(){
    if(this.gits.length == 0){
      this.openSnackBar('Please add some value in input.', 'got it!')
      return
    }
    for( let i in this.gits){
      this.searchService.getSearchedGits(this.gits[i]).subscribe((data) => {
        this.searchGits.push(data.source)
      })
    }
    this.openSnackBar('Your .gitingore content has been created, you can choose you mode to get it!', 'got it!')
    this.isCreated = true
    this.searchService.changeMessage(this.searchGits)
    this.permissions.canGoToRoute(true)
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onView(){
    this.router.navigate(['results'])
  }

  onDownload(){
    this.download('git.gitignore', this.searchGits.join('\n\n\n'))
    this.openSnackBar('Your .gitingore content has been downloaded.', 'got it!')
  }

  download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  onCopy(){
    if(this.searchGits.length != 0){
      navigator.clipboard.writeText(this.searchGits.join('\n\n\n'));
      this.openSnackBar('Your .gitingore content has been copied.', 'got it!')
    }
  }

}
