import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseURL = 'http://localhost:8080/books';
  private apiURL = 'http://localhost:8081/books';
  private cache = new Map();

  constructor(private http: HttpClient) { }

  clearCache(): void {
    this.cache.clear();
  }

  getBooks(searchTerm: string = ''): Observable<any[]> {
    const cacheKey = `booksList:${searchTerm}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get<any[]>(this.baseURL).pipe(
      map(books => {
        const filteredBooks = searchTerm ?
          books.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
          ) : books;
        this.cache.set(cacheKey, filteredBooks);
        return filteredBooks;
      }),
      shareReplay(1),
      catchError(this.handleError('getBooks', []))
    );
  }

  getBookById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/${id}`).pipe(
      catchError(this.handleError(`getBookById id=${id}`))
    );
  }

  addBook(book: any): Observable<any> {
    return this.http.post(this.baseURL, book).pipe(
      finalize(() => this.clearCache()),
      catchError(this.handleError('addBook'))
    );
  }

  updateBook(id: number, book: any): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}`, book).pipe(
      finalize(() => this.clearCache()),
      catchError(this.handleError('updateBook'))
    );
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`).pipe(
      finalize(() => this.clearCache()),
      catchError(this.handleError('deleteBook'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
