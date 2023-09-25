import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BookService } from '../../service/book.service';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from '../book-form/book-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { BookDetailsModalComponent } from '../book-details-modal/book-details-modal.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';
import { Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeSlideTrigger', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})


export class BookListComponent implements OnInit {
  
  books$ = new BehaviorSubject<any[] | null>(null);
  searchTerm$ = new BehaviorSubject<string>('');
  loading$ = new BehaviorSubject<boolean>(true);
  displayedColumns: string[] = ['title', 'author', 'year', 'actions'];

  constructor(private bookService: BookService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.searchTerm$.pipe(
      debounceTime(300),
      switchMap(searchTerm => {
        this.loading$.next(true);
        return this.bookService.getBooks(searchTerm);
      })
    ).subscribe(
      books => {
        this.books$.next(books);
        this.loading$.next(false);
      },
      error => {
        console.error('Error fetching books:', error);
        this.loading$.next(false);
      }
    );
  }
  
  // Handle search term changes
  onSearchTermChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm$.next(input.value);
  }
  

  // Open dialog for editing a book
  openEditBookDialog(bookToEdit: any): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '450px',
      data: { book: bookToEdit }  
    });
  
    dialogRef.componentInstance.formSubmit.subscribe((updatedBookData) => {
      this.bookService.updateBook(bookToEdit.id, updatedBookData).subscribe(
        response => {
          this.refreshBooks();
        },
        error => {
          console.error('Error updating book:', error);
        }
      );
    });
  }

  // Open dialog for adding a new book
  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '450px'
    });
  
    dialogRef.componentInstance.formSubmit.subscribe((newBookData) => {
      this.bookService.addBook(newBookData).subscribe(
        response => {
          this.refreshBooks();
        },
        error => {
          console.error('Error adding book:', error);
        }
      );
    });
  }

  // Open confirmation dialog for deleting a book
  openDeleteConfirmation(bookId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.bookService.deleteBook(bookId).subscribe(
          response => {
            this.refreshBooks();
          },
          error => {
            console.error('Error deleting book:', error);
          }
        );
      }
    });
  }

  // Open modal for displaying book details
  openBookDetails(bookId: number): void {
    console.log(`Fetching details for book with ID: ${bookId}`);
    this.bookService.getBookById(bookId).subscribe(
      bookData => {
        console.log('Received book details:', bookData);
        this.dialog.open(BookDetailsModalComponent, {
          width: '400px',
          data: { book: bookData }
        });
      },
      error => {
        console.error('Error fetching book details:', error);
      }
    );
  }

  // Helper function to refresh the list of books
  private refreshBooks(): void {
    this.searchTerm$.next(this.searchTerm$.value);  
  }
  
}
