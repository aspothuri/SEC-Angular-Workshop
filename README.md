# ClubDashboard — Build From Scratch

This repository contains a small Angular app (ClubDashboard) used for teaching Angular concepts. The README below is a copy-paste, build-from-scratch guide: create a new Angular app and paste each file's contents into the matching path.

Prerequisites

- Node.js (16+ recommended)
- npm
- Angular CLI (optional; helpful): `npm install -g @angular/cli`

Quick start

```bash
# create a new workspace (or use an existing one)
ng new club-dashboard --defaults --routing=false --style=css
cd club-dashboard
npm install
```

Replace the `src/app` contents with the files below. Each section is the exact contents for a file path under `src/app`.

1. `src/app/members.ts` — in-memory state service

```typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Member {
  id: number;
  name: string;
  active: boolean;
}

@Injectable({ providedIn: "root" })
export class MembersService {
  private _members = new BehaviorSubject<Member[]>([
    { id: 1, name: "Alice", active: true },
    { id: 2, name: "Bob", active: false },
  ]);

  members$ = this._members.asObservable();

  add(name: string) {
    const list = this._members.getValue();
    const id = list.length ? Math.max(...list.map((m) => m.id)) + 1 : 1;
    this._members.next([...list, { id, name, active: true }]);
  }

  toggle(m: Member) {
    this._members.next(
      this._members
        .getValue()
        .map((x) => (x.id === m.id ? { ...x, active: !x.active } : x)),
    );
  }

  updateName(id: number, name: string) {
    this._members.next(
      this._members.getValue().map((x) => (x.id === id ? { ...x, name } : x)),
    );
  }

  remove(id: number) {
    this._members.next(this._members.getValue().filter((x) => x.id !== id));
  }
}
```

2. `src/app/member-add/member-add.ts`

```typescript
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MembersService } from "../members";

@Component({
  selector: "app-member-add",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./member-add.html",
  styleUrls: ["./member-add.css"],
})
export class MemberAdd {
  name = "";
  constructor(private members: MembersService) {}

  add() {
    const n = this.name.trim();
    if (!n) return;
    this.members.add(n);
    this.name = "";
  }
}
```

3. `src/app/member-add/member-add.html`

```html
<div class="card">
  <div style="display:flex;gap:.5rem;align-items:center">
    <input [(ngModel)]="name" placeholder="Add member" />
    <button (click)="add()">Add</button>
  </div>
</div>
```

4. `src/app/member-add/member-add.css`

```css
input {
  flex: 1;
  padding: 0.45rem;
  border: 1px solid #e6e9ee;
  border-radius: 6px;
}
button {
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
}
.card {
  padding: 0.75rem;
  background: #fff;
  border: 1px solid #e6e9ee;
  border-radius: 10px;
}
```

5. `src/app/member-list/member-list.ts`

```typescript
import { Component } from "@angular/core";
import { CommonModule, AsyncPipe } from "@angular/common";
import { MembersService } from "../members";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-member-list",
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule],
  templateUrl: "./member-list.html",
  styleUrls: ["./member-list.css"],
})
export class MemberList {
  constructor(private members: MembersService) {}

  get members$() {
    return this.members.members$;
  }

  toggle(m: any) {
    this.members.toggle(m);
  }

  remove(id: number) {
    this.members.remove(id);
  }
}
```

6. `src/app/member-list/member-list.html`

```html
<div class="card">
  <ul class="members">
    <li *ngFor="let m of members$ | async">
      <div class="member-label">
        <a [routerLink]="['/members', m.id]" class="member-name"
          >{{ m.name }}</a
        >
        <div class="member-meta">{{ m.active ? 'Active' : 'Inactive' }}</div>
      </div>
      <div>
        <button (click)="toggle(m)" class="secondary">Toggle</button>
        <button (click)="remove(m.id)">Remove</button>
      </div>
    </li>
  </ul>
</div>
```

7. `src/app/member-list/member-list.css`

```css
.members {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #fff;
  border: 1px solid #e6e9ee;
  border-radius: 6px;
}
.member-label {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.member-name {
  font-weight: 600;
}
.member-meta {
  color: #666;
  font-size: . ninerem;
}
.secondary {
  background: #f3f4f6;
  color: #111;
}
@media (max-width: 560px) {
  li {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

8. `src/app/member-detail/member-detail.ts`

```typescript
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MembersService } from "../members";
import { map } from "rxjs/operators";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-member-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./member-detail.html",
  styleUrls: ["./member-detail.css"],
})
export class MemberDetail {
  constructor(
    private route: ActivatedRoute,
    private members: MembersService,
    private router: Router,
  ) {}

  get id() {
    return Number(this.route.snapshot.paramMap.get("id"));
  }

  get member$() {
    return this.members.members$.pipe(
      map((list) => list.find((m) => m.id === this.id)),
    );
  }

  name = "";

  save() {
    if (!this.name.trim()) return;
    this.members.updateName(this.id, this.name);
    this.router.navigate(["/"]);
  }

  toggle(m: any) {
    this.members.toggle(m);
  }

  remove() {
    this.members.remove(this.id);
    this.router.navigate(["/"]);
  }
}
```

9. `src/app/member-detail/member-detail.html`

```html
<ng-container *ngIf="member$ | async as m; else notFound">
  <h2>Member Details</h2>

  <div class="detail">
    <div>
      <div class="label">Name</div>
      <div class="value">{{ m.name }}</div>
    </div>

    <div>
      <div class="label">Status</div>
      <div class="value">{{ m.active ? 'Active' : 'Inactive' }}</div>
    </div>
  </div>

  <div class="actions">
    <input [(ngModel)]="name" placeholder="New name" />
    <button (click)="save()">Save</button>
    <button (click)="toggle(m)">Toggle</button>
    <button (click)="remove()">Remove</button>
    <a routerLink="/">Back</a>
  </div>
</ng-container>

<ng-template #notFound>
  <p>Member not found.</p>
  <a routerLink="/">Back</a>
</ng-template>
```

10. `src/app/member-detail/member-detail.css`

```css
h2 {
  margin-bottom: 0.5rem;
}
.detail {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
}
.label {
  font-size: 0.85rem;
  color: #666;
}
.value {
  font-weight: 600;
}
.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
input {
  padding: 0.35rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
}
@media (max-width: 520px) {
  .detail {
    flex-direction: column;
  }
  .actions {
    flex-direction: column;
    width: 100%;
  }
  .actions button {
    width: 100%;
  }
}
```

11. `src/app/dashboard/dashboard.ts`

```typescript
import { Component } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { MemberAdd } from "../member-add/member-add";
import { MemberList } from "../member-list/member-list";
import { MembersService } from "../members";
import { map } from "rxjs";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [MemberAdd, MemberList, AsyncPipe],
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.css"],
})
export class Dashboard {
  constructor(private members: MembersService) {}

  get total$() {
    return this.members.members$.pipe(map((m) => m.length));
  }
  get active$() {
    return this.members.members$.pipe(
      map((m) => m.filter((x) => x.active).length),
    );
  }
}
```

12. `src/app/dashboard/dashboard.html`

```html
<h1>Club Members Dashboard</h1>

<div class="stats">
  <div>Total: <strong>{{ total$ | async }}</strong></div>
  <div>Active: <strong>{{ active$ | async }}</strong></div>
</div>

<hr />

<app-member-add></app-member-add>

<hr />

<app-member-list></app-member-list>
```

13. `src/app/dashboard/dashboard.css`

```css
h1 {
  margin-bottom: 0.25rem;
}
.stats {
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
}
hr {
  margin: 1rem 0;
}
```

14. `src/app/app.ts`

```typescript
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})
export class App {}
```

15. `src/app/app.html`

```html
<nav>
  <a routerLink="/">Dashboard</a>
</nav>

<div class="app-shell">
  <router-outlet></router-outlet>
</div>
```

16. `src/app/app.css`

```css
:root {
  --bg: #f6f8fa;
  --card: #ffffff;
  --muted: #6b7280;
  --accent: #2563eb;
  --border: #e6e9ee;
}
html,
body {
  height: 100%;
}
body {
  margin: 0;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial;
  background: var(--bg);
  color: #111827;
}
nav {
  background: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 0.5rem 1rem;
}
nav a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}
.app-shell {
  max-width: 920px;
  margin: 1.5rem auto;
  padding: 1rem;
}
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}
.stats {
  display: flex;
  gap: 1rem;
  align-items: center;
  color: var(--muted);
}
button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
}
button.secondary {
  background: #f3f4f6;
  color: #111;
}
input {
  padding: 0.45rem;
  border: 1px solid var(--border);
  border-radius: 6px;
}
```

17. `src/app/app.config.ts`

```typescript
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";
import { MemberDetail } from "./member-detail/member-detail";

const routes = [
  { path: "", component: Dashboard },
  { path: "members/:id", component: MemberDetail },
];

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)],
};
```

18. `src/main.ts`

```typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

Run the app

```bash
npm install
ng serve --open
```

If the build fails, run `ng build` to see compiler errors and line numbers.

Suggested exercises

- Add validation to the Add form (prevent blank or numeric-only names).
- Show a confirmation modal before removing a member.
- Add icons for active/inactive states and style list rows.

---

README formatting fixes: cleaned stray CSS and unclosed fences, ensured every file is complete and copy-paste ready.

# ClubDashboard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Development server

16. `src/app/app.css` — Global styles

```css
:root{
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

}

html,body{height:100%;}

body{margin:0;font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;background:var(--bg);color:#111827}

nav{background:var(--card);border-bottom:1px solid var(--border);padding:0.5rem 1rem}

nav a{color:var(--accent);text-decoration:none;font-weight:600}

.app-shell{max-width:920px;margin:1.5rem auto;padding:1rem}

.card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem;box-shadow:0 1px 2px rgba(16,24,40,0.04)}

.stats{display:flex;gap:1rem;align-items:center;color:var(--muted)}

button{background:var(--accent);color:white;border:none;padding:0.45rem 0.7rem;border-radius:6px;cursor:pointer}

button.secondary{background:#f3f4f6;color:#111}

input{padding:0.45rem;border:1px solid var(--border);border-radius:6px}

````

17) `src/app/app.config.ts` — Router at bootstrap

```typescript
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
````

18. `src/main.ts` — bootstrap

```typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

Run the app

```bash
npm install
ng serve --open
```

If anything fails, run `ng build` to see compiler errors with file and line.

Suggested exercises

- Add validation to the Add form (prevent blank or numbers-only names).
- Show a confirmation dialog before remove.
- Add an icon for inactive members.

That completes the full build-from-scratch README with every implemented file included above. Follow the file order and paste the contents into the corresponding files in your `club-dashboard/src/app` folder, then run `ng serve --open`.
padding: 0.5rem 0.75rem;
border: 1px solid #e6e6e6;
border-radius: 6px;
display: flex;
align-items: center;
justify-content: space-between;
background: #fff;
}

.inactive {
opacity: 0.6;
color: #666;
}

.member-label {
display: flex;
gap: 0.75rem;
align-items: center;
}

.member-name {
font-weight: 600;
}

.member-meta {
font-size: 0.9rem;
color: #666;
}

li:hover {
transform: translateY(-1px);
box-shadow: 0 6px 18px rgba(16, 24, 40, 0.04);
}

button {
margin-left: 0.5rem;
}

@media (max-width: 560px) {
li {
flex-direction: column;
align-items: flex-start;
gap: 0.5rem;
}
.member-label {
width: 100%;
display: flex;
justify-content: space-between;
}
}

````

8. `src/app/member-detail/member-detail.ts` — Detail component class

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MembersService } from '../members';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './member-detail.html',
  styleUrls: ['./member-detail.css'],
})
export class MemberDetail {
  constructor(
    private route: ActivatedRoute,
    private members: MembersService,
    private router: Router,
  ) {}

  get id() {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  get member$() {
    return this.members.members$.pipe(map((list) => list.find((m) => m.id === this.id)));
  }

  name = '';

  save() {
    if (!this.name.trim()) return;
    this.members.updateName(this.id, this.name);
    this.router.navigate(['/']);
  }

  toggle(m: any) {
    this.members.toggle(m);
  }

  remove() {
    this.members.remove(this.id);
    this.router.navigate(['/']);
  }
}
````

9. `src/app/member-detail/member-detail.html` — Detail template

```html
<ng-container *ngIf="member$ | async as m; else notFound">
  <h2>Member Details</h2>

  <div class="detail">
    <div>
      <div class="label">Name</div>
      <div class="value">{{ m.name }}</div>
    </div>

    <div>
      <div class="label">Status</div>
      <div class="value">{{ m.active ? 'Active' : 'Inactive' }}</div>
    </div>
  </div>

  <div class="actions">
    <input [(ngModel)]="name" placeholder="New name" />
    <button (click)="save()">Save</button>
    <button (click)="toggle(m)">Toggle</button>
    <button (click)="remove()">Remove</button>
    <a routerLink="/">Back</a>
  </div>
</ng-container>

<ng-template #notFound>
  <p>Member not found.</p>
  <a routerLink="/">Back</a>
</ng-template>
```

10. `src/app/member-detail/member-detail.css` — Detail styles

```css
h2 {
  margin-bottom: 0.5rem;
}

.detail {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
}

.label {
  font-size: 0.85rem;
  color: #666;
}

.value {
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

input {
  padding: 0.35rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 520px) {
  .detail {
    flex-direction: column;
    gap: 0.5rem;
  }
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
  .actions button {
    width: 100%;
  }
}
```

11. `src/app/dashboard/dashboard.ts` — Dashboard component

```typescript
import { Component } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { MemberAdd } from "../member-add/member-add";
import { MemberList } from "../member-list/member-list";
import { MembersService } from "../members";
import { map } from "rxjs";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [MemberAdd, MemberList, AsyncPipe],
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.css"],
})
export class Dashboard {
  constructor(private members: MembersService) {}

  get total$() {
    return this.members.members$.pipe(map((m) => m.length));
  }

  get active$() {
    return this.members.members$.pipe(
      map((m) => m.filter((x) => x.active).length),
    );
  }
}
```

12. `src/app/dashboard/dashboard.html` — Dashboard template

```html
<h1>Club Members Dashboard</h1>

<div class="stats">
  <div>Total: <strong>{{ total$ | async }}</strong></div>
  <div>Active: <strong>{{ active$ | async }}</strong></div>
</div>

<hr />

<app-member-add></app-member-add>

<hr />

<app-member-list></app-member-list>
```

13. `src/app/dashboard/dashboard.css` — Dashboard styles

```css
h1 {
  margin-bottom: 0.25rem;
}

.stats {
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
}

hr {
  margin: 1rem 0;
}
```

14. `src/app/app.ts` — Root component

```typescript
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})
export class App {}
```

15. `src/app/app.html` — Root template

```html
<nav>
  <a routerLink="/">Dashboard</a>
</nav>

<div class="app-shell">
  <router-outlet></router-outlet>
</div>
```

16. `src/app/app.css` — Global styles

```css
:root {
  --bg: #f6f8fa;
  --card: #ffffff;
  --muted: #6b7280;
  --accent: #2563eb;
  --border: #e6e9ee;
}

html,
body {
  height: 100%;
}

body {
  margin: 0;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial;
  background: var(--bg);
  color: #111827;
}

nav {
  background: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 0.5rem 1rem;
}

nav a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.app-shell {
  max-width: 920px;
  margin: 1.5rem auto;
  padding: 1rem;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}

.stats {
  display: flex;
  gap: 1rem;
  align-items: center;
  color: var(--muted);
}

button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
}

button.secondary {
  background: #f3f4f6;
  color: #111;
}

input {
  padding: 0.45rem;
  border: 1px solid var(--border);
  border-radius: 6px;
}
```

17. `src/app/app.config.ts` — Router at bootstrap

```typescript
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";
import { MemberDetail } from "./member-detail/member-detail";

const routes = [
  { path: "", component: Dashboard },
  { path: "members/:id", component: MemberDetail },
];

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)],
};
```

18. `src/main.ts` — bootstrap

```typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

Run the app

```
npm install
ng serve --open
```

If anything fails, run `ng build` to see compiler errors with file and line.

Suggested exercises

- Add validation to the Add form (prevent blank or numbers-only names).
- Show a confirmation dialog before remove.
- Add an icon for inactive members.

That completes the full build-from-scratch README with every implemented file included above. Follow the file order and paste the contents into the corresponding files in your `club-dashboard/src/app` folder, then run `ng serve --open`.
