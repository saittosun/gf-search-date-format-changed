import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/app-models/user';
import { DatabaseHandlerService } from 'src/app/services/database-handler.service';
import { AuthService } from 'src/app/services/auth.service';
import * as fromApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent, AlertData } from 'src/app/shared/base-components/alert/alert.component';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  data: FaqData[];
  errorMessage: string;
  isLoading = false;
  faqArray: boolean[] = [];
  user: User;
  panelOpenState = false;

  constructor(
    private databaseHandlerService: DatabaseHandlerService,
    private store: Store<fromApp.AppState>,
    public alertDialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.store
      .select('auth')
      .pipe(take(1))
      .subscribe((state) => {
        this.user = state.user;
      });
    this.isLoading = true;
    this.databaseHandlerService.getFaqs().subscribe(
      (response) => {
        console.log(response);
        this.data = response.data;
        this.isLoading = false;
        this.faqArray = new Array(this.data.length).fill(false);
      },
      (error) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    );
  }

  onFaqClick(i) {
    this.faqArray[i] = !this.faqArray[i];
  }

  onDelete(id: string) {
    this.openAlert(
      {
        title: 'Attention',
        text: ['Do you want to delete the question?'],
        type: 'confirmation',
      },
      id
    );
  }

  openAlert(alertData: AlertData, id: string) {
    const dialogRef = this.alertDialog.open(AlertComponent, {
      width: '400px',
      data: alertData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.authService.deleteFaq(id).subscribe(
          (response) => {
            this.data = this.data.filter((faq) => faq.id !== id);
            this.isLoading = false;
            console.log(response);
          },
          (error) => {
            this.isLoading = false;
            this.errorMessage = error;
          }
        );
      }
    });
  }
}

interface FaqData {
  id: string;
  title: string;
  body: { tag: string; element: string }[];
}
