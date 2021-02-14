import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../base-components/alert/alert.component';
import { LoadingSpinnerComponent } from '../base-components/loading-spinner/loading-spinner.component';
import { LocationPipe } from '../pipes/location.pipe';


@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    LocationPipe,
    AlertComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  exports: [
    LoadingSpinnerComponent,
    LocationPipe,
    ReactiveFormsModule,
    FormsModule,
    AlertComponent
 ]
})
export class SharedModule { }
