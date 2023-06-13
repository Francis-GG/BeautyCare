import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private _hasClickedRedirect = false;

  get hasClickedRedirect() {
    return this._hasClickedRedirect;
  }

  setRedirectClicked() {
    this._hasClickedRedirect = true;
  }

  resetRedirectClicked() {
    this._hasClickedRedirect = false;
  }
}
