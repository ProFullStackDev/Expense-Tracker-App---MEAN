import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { MatPaginator } from '@angular/material/paginator';
import { ExpenseContent } from './view-expense.model';
import { MatTableDataSource } from '@angular/material/table';
import { AddExpenseComponent } from '../add-expense/add-expense.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.component.html',
  styleUrls: ['./view-expenses.component.scss'],
})
export class ViewExpensesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'name',
    'amount',
    'expense_date',
    'expense_category',
    'payment',
    'comment',
  ];

  ELEMENT_DATA: ExpenseContent[] = [];
  dataSource = new MatTableDataSource<ExpenseContent>();
  constructor(
    public businessData: BusinessDataService,
    public dialog: MatDialog,
    public http: HttpClient
  ) {}
  text1: any = 'raghav ';
  text2: any = 'rghav1';
  text3: any = 'raghav2';
  text4: any = 'raghav3';
  startDate = new Date();
  cards: any = [];
  ngOnInit(): void {
    this.getAllExpense();
  }
  public getAllExpense() {
    this.businessData.onGetAllExpense().subscribe((res: any) => {
      this.ELEMENT_DATA = res.data;
      this.dataSource = new MatTableDataSource<ExpenseContent>(
        this.ELEMENT_DATA
      );
      this.dataSource.paginator = this.paginator;
      this.cards = [
        {
          icon: 'today',
          title: 'First Expense Date',
          content: res.data[0].expense_date,
        },
        {
          icon: 'today',
          title: 'Latest Expense Date',
          content: res.data[res.data.length - 1].expense_date,
        },
        {
          icon: 'numbers',
          title: 'Number of Expenses',
          content: res.data.length,
        },
        { icon: 'monetization_on', title: 'Total Amount', content: this.text4 },
      ];
      this.businessData.expensesLogged = res.data.length;
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  onOpen(element: any) {
    this.openDialog();
    // console.log(element);
    let body = {
      action: 'edit',
      data: element,
    };
    this.businessData.data = body;
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(Confirm, {
      width: '300px',
      height: '190px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllExpense();
    });
  }
}
@Component({
  selector: 'confirm',
  templateUrl: 'confirm.html',
})
export class Confirm {
  constructor(
    public dialogRef: MatDialogRef<Confirm>,
    public dialog: MatDialog,
    public businessData: BusinessDataService,
    public route: Router
  ) {}

  onOpen() {
    this.route.navigate(['edit', this.businessData.data.data._id]);
  }
  onDelete() {
    this.businessData
      .onDeleteExpense(this.businessData.data.data._id)
      .subscribe((res: any) => {
        console.log(res);
      });
  }
}
