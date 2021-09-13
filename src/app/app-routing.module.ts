import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormComponent as CoursesFormComponent } from './pages/courses/form/form.component';
import { ListComponent as CoursesListComponent } from './pages/courses/list/list.component';
import { HomeComponent } from './pages/home/home.component';
import { FormComponent as StudentsFormComponent } from './pages/students/form/form.component';
import { ListComponent as StudentsListComponent } from './pages/students/list/list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'courses', component: CoursesListComponent },
  { path: 'courses/new', component: CoursesFormComponent },
  { path: 'courses/:id', component: CoursesFormComponent },
  { path: 'students', component: StudentsListComponent },
  { path: 'students/new', component: StudentsFormComponent },
  { path: 'students/:id', component: StudentsFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
