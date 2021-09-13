import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StudentsService } from 'src/app/shared/services/students.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  students$: Observable<any> = EMPTY;

  constructor(private service: StudentsService, private active: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.students$ = this.active.queryParams.pipe(
      map(params => params['page'] || 0),
      switchMap(id => this.service.getAll(id))
    );
  }

  onRemove(id: number) {
    if (confirm('Are you sure?\nThis action cannot be undone.')) {
      this.service.delete(id).subscribe(() => this.ngOnInit());
    }
  }

  onPrevious({ number }: any) {
    if (number <= 0) {
      return;
    }

    this.navigate(number - 1);
  }

  onNext({ number, totalPages }: any) {
    if (number >= totalPages - 1) {
      return;
    }

    this.navigate(number + 1);
  }

  private navigate(page: number) {
    const options: NavigationExtras = {
      relativeTo: this.active,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    };

    this.router.navigate([], options);
  }
}
