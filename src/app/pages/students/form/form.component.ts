import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { StudentsService } from 'src/app/shared/services/students.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  student$: Observable<any> = EMPTY;

  form: FormGroup;

  courses: any[] = [];

  submitted = false;

  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private active: ActivatedRoute,
    private router: Router,
    private builder: FormBuilder
  ) {
    this.form = this.builder.group({
      id: null,
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      courses: this.builder.array([], minSelectedCheckboxes()),
    });
  }

  ngOnInit(): void {
    this.student$ = this.active.params.pipe(
      map((params) => params['id']),
      switchMap((id) => (id && this.studentsService.getById(id)) || of({})),
      tap(console.log),
      tap((student) => {
        this.form.patchValue(student);
        this.loadCourses(student);
      })
    );
  }

  onSubmit() {
    this.submitted = true;

    if (!this.form.valid) {
      return;
    }

    const courses = this.form.value.courses
      .map((checked: boolean, i: number) => (checked ? this.courses[i] : null))
      .filter((v: any) => !!v);
    const student = { ...this.form.value, courses };

    this.studentsService
      .save(student)
      .subscribe(() => this.router.navigate(['/students']));
  }

  isInvalid(controlName: string) {
    return (
      !this.form.get(controlName)?.valid &&
      (this.form.get(controlName)?.touched || this.submitted)
    );
  }

  get coursesControl() {
    return this.form.controls.courses as FormArray;
  }

  private loadCourses(student: any, page = 0) {
    this.coursesControl.clear();

    this.coursesService.getAll(page).subscribe((response) => {
      this.courses = [...this.courses, ...response._embedded.courses];
      this.courses.forEach((course) => {
        const selected = student.courses?.some(
          (it: any) => it.id === course.id
        );
        this.coursesControl.push(new FormControl(selected));
      });

      if (response.page.number < response.page.totalPages) {
        this.loadCourses(student, response.page.number + 1);
      }
    });
  }
}

function minSelectedCheckboxes(min = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = <FormArray>control;
    const totalSelected = formArray.controls
      .map((c) => c.value)
      .reduce((prev, next) => (next ? prev + next : prev), 0);

    return totalSelected >= min ? null : { required: true };
  };
}
