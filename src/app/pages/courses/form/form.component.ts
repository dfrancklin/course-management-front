import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { CoursesService } from 'src/app/shared/services/courses.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  course$: Observable<any> = EMPTY;

  form: FormGroup;

  submitted = false;

  constructor(
    private service: CoursesService,
    private active: ActivatedRoute,
    private router: Router,
    private builder: FormBuilder
  ) {
    this.form = this.builder.group({
      id: null,
      name: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      hourLoad: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.course$ = this.active.params.pipe(
      map((params) => params['id']),
      switchMap((id) => (id && this.service.getById(id)) || of({})),
      tap((course) => this.form.patchValue(course))
    );
  }

  onSubmit() {
    this.submitted = true;

    if (!this.form.valid) {
      return;
    }

    this.service
      .save(this.form.value)
      .subscribe(() => this.router.navigate(['/courses']));
  }

  isInvalid(controlName: string) {
    return (
      !this.form.get(controlName)?.valid &&
      (this.form.get(controlName)?.touched || this.submitted)
    );
  }
}
