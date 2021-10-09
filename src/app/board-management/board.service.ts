import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private currentBoardSheetSubject: BehaviorSubject<any>;
  public currentSheet: Observable<any>;

  constructor() {
    this.currentBoardSheetSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('InApp') || '{}'));
    this.currentSheet = this.currentBoardSheetSubject.asObservable();
  }

  public get currentBoardSheetValue() {
    return this.currentBoardSheetSubject.value;
  }

  addTask(task: any) {
    localStorage.setItem('InApp', JSON.stringify(task));
    this.currentBoardSheetSubject.next(task);
  }
}
