import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@src/app/modules/auth/auth.guard';
import { AuthLayoutComponent } from '@src/app/layouts/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from '@src/app/layouts/content-layout/content-layout.component';
import { PageNotFoundComponent } from '@src/app/shared/components/page-not-found/page-not-found.component';
import { AppResolverService } from '@src/app/app-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard],
    resolve: {
      message: AppResolverService,
    },
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],

        loadChildren: () =>
          import('./modules/home/home.module').then(
            (m) => m.HomeComponentModule
          ),
      },
      {
        path: 'assignments',
        loadChildren: () =>
          import('./modules/assignments/assignments.module').then(
            (m) => m.AssignmentsModule
          ),
      },
      // {
      //   path: 'exports',
      //   loadChildren: () =>
      //     import('./modules/exports/exports.module').then(
      //       (m) => m.ExportsModule
      //     ),
      // },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
      },
    ],
  },
  // {
  //   path: 'admin',
  //   loadChildren: () =>
  //     import('./modules/admin/admin.module').then((m) => m.AdminModule),
  // },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  // { path: 'test', component: TestComponent },
  // { path: 'auth', loadChildren: './modules/auth/auth.module#AuthModule' },
  // { path: 'ma', loadChildren: './modules/ma/ma.module#MaModule' },
  // { path: '', component: ContentLayoutComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
