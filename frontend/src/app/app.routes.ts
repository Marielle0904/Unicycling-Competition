import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { Competitions } from './features/competitions/competitions';
import { Evaluation } from './features/evaluation/evaluation';
import { Jury } from './features/jury/jury';
import { Management } from './features/management/management';
import { Members } from './features/members/members';
import { Profile } from './features/profile/profile';
import { Registrations } from './features/registrations/registrations';
import { Verein } from './features/verein/verein';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'competitions',
    component: Competitions,
    canActivate: [authGuard],
  },
  {
    path: 'evaluation',
    component: Evaluation,
    canActivate: [authGuard],
  },
  {
    path: 'jury',
    component: Jury,
    canActivate: [authGuard],
  },
  {
    path: 'management',
    component: Management,
    canActivate: [authGuard],
  },
  {
    path: 'members',
    component: Members,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'registrations',
    component: Registrations,
    canActivate: [authGuard],
  },
  {
    path: 'verein',
    component: Verein,
    canActivate: [authGuard],
  },
];
