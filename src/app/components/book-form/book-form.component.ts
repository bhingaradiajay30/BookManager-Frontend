import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges,Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit, OnChanges{
  @Input() book: any | null = null; 
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();

  bookForm: FormGroup;

  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private dialogRef: MatDialogRef<BookFormComponent>  ) {
    // Initialize the form
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
  });
  
    // populate the form
    if (this.data && this.data.book) {
      this.bookForm.patchValue(this.data.book);
    }
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book'] && changes['book'].currentValue) {
      // Populate the form with the provided book details
      this.bookForm.patchValue(this.book);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  
  onSubmit(): void {
    if (this.bookForm.valid) {
      
      this.formSubmit.emit(this.bookForm.value); 
      this.dialogRef.close(); 
      this.bookForm.reset();
    }
  }
}
