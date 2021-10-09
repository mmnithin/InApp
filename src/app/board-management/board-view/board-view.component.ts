import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.scss']
})
export class BoardViewComponent implements OnInit {

  boardSheet = [
    {
      'TASKID': 1,
      'TASKTITLE': 'Bug Fixes',
      'TASKDESCRIPTION': 'Fix the Login Bug',
      'STATUS': 'TODO'
    },
    {
      'TASKID': 2,
      'TASKTITLE': 'Bug Fixes',
      'TASKDESCRIPTION': 'Fix alignment issues',
      'STATUS': 'TODO'
    },
    {
      'TASKID': 3,
      'TASKTITLE': 'UI Enhancements',
      'TASKDESCRIPTION': 'Support UI Validations in all form fields',
      'STATUS': 'INPROGRESS'
    },
    {
      'TASKID': 4,
      'TASKTITLE': 'Drag Support',
      'TASKDESCRIPTION': 'Implement Drag Events',
      'STATUS': 'COMPLETED'
    },
  ]; // used to store all task details

  show = false; // used to show the modal

  draggingTask: any = {};

  taskForm: FormGroup;
  taskSubmit = false;
  get f() { return this.taskForm.controls; }

  constructor(
    private boardService: BoardService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    if (boardService.currentBoardSheetValue
      && Object.keys(boardService.currentBoardSheetValue).length === 0
      && Object.getPrototypeOf(boardService.currentBoardSheetValue) === Object.prototype) {
      boardService.addTask(this.boardSheet);
    } else {
      this.boardSheet = boardService.currentBoardSheetValue;
    }
    this.taskForm = this.formBuilder.group({
      TASKID: [1],
      TASKTITLE: ['', [Validators.required]],
      TASKDESCRIPTION: ['', [Validators.required]],
      STATUS: ['TODO'],
      OPERATION: ['CREATE']
    });

  }

  ngOnInit(): void {
  }

  openModal(content) {
    this.modalService.open(content, { size: 'lg' });
  }
  drag(task, ev) {
    this.draggingTask = task;
  }
  drop(ev, field) {
    ev.preventDefault();
    if (this.draggingTask.TASKID && field !== 'COMPLETED') {
      this.boardSheet.find(e => e.TASKID === this.draggingTask.TASKID).STATUS = field;
      this.draggingTask = {};
    } else if (this.draggingTask.TASKID && field === 'COMPLETED') {
      if (confirm('Do you want to drop this task to completion?')) {
        this.boardSheet.find(e => e.TASKID === this.draggingTask.TASKID).STATUS = field;
        this.draggingTask = {};
      }
    }
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  submitTask() {
    this.taskSubmit = true;
    if (this.taskForm.invalid) {
      return;
    }
    if (this.taskForm.get('OPERATION').value === 'CREATE') {
      const MAXID = this.boardSheet.reduce((acc, item) => acc = acc > item.TASKID ? acc : item.TASKID, 0);
      this.taskForm.patchValue({
        TASKID: MAXID ? MAXID + 1 : 1 // incrementing TASKID
      });
      this.boardSheet.push(this.taskForm.value); // push the new value
    } else {
      const updatingIndex = this.boardSheet.findIndex(e => e.TASKID === this.taskForm.get('TASKID').value);
      if (updatingIndex > -1) {
        this.boardSheet[updatingIndex] = this.taskForm.value;
      }
    }
    this.boardService.addTask(this.boardSheet); // store data in localStorage

    this.modalService.dismissAll();
    this.taskForm.patchValue({
      TASKID: 1,
      TASKTITLE: '',
      TASKDESCRIPTION: '',
      STATUS: 'TODO',
      OPERATION: 'CREATE'
    });
    this.taskSubmit = false;
  }

  // remove task from array
  removeTask(index) {
    this.boardSheet.splice(index, 1);
    this.boardService.addTask(this.boardSheet); // store data in localStorage
  }
  // edit task
  editTask(task, content) {
    console.log(task);
    this.taskForm.patchValue({
      TASKID: task.TASKID ? task.TASKID : 1,
      TASKTITLE: task.TASKTITLE ? task.TASKTITLE : 1,
      TASKDESCRIPTION: task.TASKDESCRIPTION ? task.TASKDESCRIPTION : 1,
      STATUS: task.STATUS ? task.STATUS : 'TODO',
      OPERATION: 'UPDATE'
    });
    this.modalService.open(content, { size: 'lg' });

  }

}

