import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { MemberDetail } from './member-detail/member-detail';

const routes = [
  { path: '', component: Dashboard },
  { path: 'members/:id', component: MemberDetail },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
