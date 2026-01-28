# ClubDashboard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

**Overview**

- **Purpose**: Hands-on 45-minute Angular workshop using a compact Club Members dashboard. Focuses on components, services (dependency injection), routing, observables, and simple forms.

**Prerequisites**

- Node.js (v16+)
- Angular CLI: `npm install -g @angular/cli`
- Code editor (VS Code recommended)

**Setup**

Download an IDE/text editor like [VS Code](https://code.visualstudio.com/)

Download [Node.js](https://nodejs.org/)

Start your terminal in your code folder

Make sure you have Node.js and NPM working:

> node -v
> npm -v

If either of these fail, go back to step 2 and install Node.js

Install angular using npm install and make sure it installed

> npm install -g @angular/cli
> ng version

Now, create the Angular project with boilerplate

> ng new club-dashboard --routing=false --style=css

Click enter at every yes or no option (default option is no)

After a few second you should see a project folder called club-dashboard

Then, we need to set up the services and components required for the app

> ng generate service members
> ng generate component member-add
> ng generate component member-list

Think of these as generating the objects and functions of the project

To run your app, use the command

> ng serve -o

Now you are ready to start coding!!!

**Quick Start**

- **Open terminal** and run:

```
cd SEC-Angular-Workshop/club-dashboard
npm install
ng serve --open
```

- App should open at http://localhost:4200. If not, run `ng build` and fix errors the compiler reports.

**Files to edit (order you will follow)**

- `src/app/members.ts`
- `src/app/member-add/member-add.ts` and `member-add.html`
- `src/app/member-list/member-list.ts` and `member-list.html`
- `src/app/dashboard/*`
- `src/app/member-detail/*`
- `src/app/app.config.ts`
- `src/app/app.ts` and `app.html`
- `src/app/*.css` for UI polish

**Workshop flow (45 minutes)**

- 0–5 min: Project structure and run the app
- 5–20 min: Implement/inspect `MembersService` and `member-add` component
- 20–35 min: Implement/inspect `member-list` and wiring to detail
- 35–45 min: Implement `member-detail`, routing, polish, and exercises

**Step-by-step: what to write and where**

**1) MembersService (state)**

Open `src/app/members.ts` and ensure it exports a `MembersService` with:

- `membersSubject` as `BehaviorSubject<Member[]>`
- `members$` observable
- `add(name)`, `toggle(member)`, `updateName(id,name)`, `remove(id)` methods

If you need to write this file, place the class implementation shown in the project's `src/app/members.ts`.

**2) Add form component**

Open `src/app/member-add/member-add.ts` and `member-add.html`.

Write the component class (example):

```
import { Component } from '@angular/core';
import { MembersService } from '../members';

@Component({
	selector: 'app-member-add',
	standalone: true,
	templateUrl: './member-add.html',
	styleUrls: ['./member-add.css'],
})
export class MemberAdd {
	constructor(private members: MembersService) {}

	add(name: string) { this.members.add(name); }
}
```

And the template (`src/app/member-add/member-add.html`):

```
<h2>Add member</h2>
<div class="add-row card">
	<input #input placeholder="Name" />
	<button (click)="add(input.value); input.value = ''">Add member</button>
</div>
```

**3) Member list**

Open `src/app/member-list/member-list.ts` and `member-list.html`.

Ensure the component uses a getter for `members$` to avoid initialization errors:

```
get members$() { return this.membersService.members$; }
```

Template should display items with actions and a link to the detail page:

```
<ul>
	<li *ngFor="let m of members$ | async" [class.inactive]="!m.active">
		<div class="member-label">
			<a [routerLink]="['/members', m.id]" class="member-name">{{ m.name }}</a>
			<span class="member-meta">{{ m.active ? 'Active' : 'Inactive' }}</span>
		</div>
		<div>
			<button (click)="toggle(m)">Toggle</button>
			<button (click)="remove(m.id)" class="secondary">Remove</button>
		</div>
	</li>
</ul>
```

**4) Member detail page**

Create `src/app/member-detail/member-detail.ts`, `.html`, `.css`.

The component reads route params using `ActivatedRoute` and exposes `member$`, plus `save`, `toggle`, `remove` methods. Use `FormsModule` for `ngModel`.

Example template (`member-detail.html`):

```
<ng-container *ngIf="member$ | async as m; else notFound">
	<h2>Member Details</h2>
	<div class="detail card">
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
		<button (click)="remove()" class="secondary">Remove</button>
		<a routerLink="/">Back</a>
	</div>
</ng-container>
<ng-template #notFound>
	<p>Member not found.</p>
	<a routerLink="/">Back</a>
</ng-template>
```

**5) Dashboard component**

Create `src/app/dashboard/dashboard.ts/html/css`. Dashboard composes `app-member-add` and `app-member-list` and displays `total$` and `active$` derived from `MembersService`.

**6) Routing and bootstrap**

Open `src/app/app.config.ts` and add the router provider:

```
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { MemberDetail } from './member-detail/member-detail';

const routes = [ { path: '', component: Dashboard }, { path: 'members/:id', component: MemberDetail } ];

export const appConfig: ApplicationConfig = { providers: [ provideRouter(routes) ] };
```

**7) Root component**

Open `src/app/app.ts` and ensure it imports `RouterOutlet` and uses a minimal template. Replace `src/app/app.html` content with a navigation and `<router-outlet>`.

**8) Styling**

Edit `src/app/app.css`, `member-list.css`, `member-add.css`, and `member-detail.css` to apply light, clean styles. Keep the UI simple and focused on Angular concepts.

**Run and verify**

- `ng serve --open` and test: add, toggle, view details, edit name, remove.
- If you see compile errors, run `ng build` to see file/line hints.

**Exercises**

- Add validation to the Add form
- Add a confirmation dialog before remove
- Add an icon for inactive members

**Support**

If anything breaks, inspect the compiler output and correct typos. Use the repository `src/app` files as the reference implementation.

---

This README mirrors the workshop instructions and guides learners through the code in the correct order.

Setup

Download an IDE/text editor like [VS Code](https://code.visualstudio.com/)

Download [Node.js](https://nodejs.org/)

Start your terminal in your code folder

Make sure you have Node.js and NPM working:

> node -v
> npm -v

If either of these fail, go back to step 2 and install Node.js

Install angular using npm install and make sure it installed

> npm install -g @angular/cli
> ng version

Now, create the Angular project with boilerplate

> ng new club-dashboard --routing=false --style=css

Click enter at every yes or no option (default option is no)

After a few second you should see a project folder called club-dashboard

Then, we need to set up the services and components required for the app

> ng generate service members
> ng generate component member-add
> ng generate component member-list

Think of these as generating the objects and functions of the project

To run your app, use the command

> ng serve -o

Now you are ready to start coding!!!

Full step-by-step (create these files and paste the code exactly)

1. `src/app/members.ts` — MembersService (state and actions)

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Member = {
  id: number;
  name: string;
  active: boolean;
};

@Injectable({ providedIn: 'root' })
export class MembersService {
  private nextId = 4;

  private membersSubject = new BehaviorSubject<Member[]>([
    { id: 1, name: 'Ava', active: true },
    { id: 2, name: 'Ben', active: true },
    { id: 3, name: 'Chris', active: false },
  ]);

  members$ = this.membersSubject.asObservable();

  get members(): Member[] {
    return this.membersSubject.value;
  }

  add(name: string) {
    const value = name.trim();
    if (!value) return;

    this.membersSubject.next([
      ...this.membersSubject.value,
      { id: this.nextId++, name: value, active: true },
    ]);
  }

  updateName(id: number, name: string) {
    const value = name.trim();
    if (!value) return;

    this.membersSubject.next(
      this.membersSubject.value.map((m) => (m.id === id ? { ...m, name: value } : m)),
    );
  }

  remove(id: number) {
    this.membersSubject.next(this.membersSubject.value.filter((m) => m.id !== id));
  }

  toggle(member: Member) {
    this.membersSubject.next(
      this.membersSubject.value.map((m) => (m.id === member.id ? { ...m, active: !m.active } : m)),
    );
  }
}
```

2. `src/app/member-add/member-add.ts` — Add component class

```typescript
import { Component } from '@angular/core';
import { MembersService } from '../members';

@Component({
  selector: 'app-member-add',
  standalone: true,
  templateUrl: './member-add.html',
  styleUrls: ['./member-add.css'],
})
export class MemberAdd {
  constructor(private members: MembersService) {}

  add(name: string) {
    this.members.add(name);
  }
}
```

3. `src/app/member-add/member-add.html` — Add template

```html
<h2>Add member</h2>

<input #input placeholder="Name" />
<button (click)="add(input.value); input.value = ''">Add</button>
```

4. `src/app/member-add/member-add.css` — Add styles

```css
h2 {
  margin-bottom: 0.5rem;
}

input {
  margin-right: 0.5rem;
}

input {
  padding: 0.35rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

@media (max-width: 520px) {
  .add-row {
    flex-direction: column;
    align-items: stretch;
  }
  button {
    width: 100%;
  }
}
```

5. `src/app/member-list/member-list.ts` — List component

```typescript
import { Component } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MembersService, Member } from '../members';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [NgFor, AsyncPipe, RouterLink],
  templateUrl: './member-list.html',
  styleUrls: ['./member-list.css'],
})
export class MemberList {
  get members$() {
    return this.membersService.members$;
  }

  constructor(private membersService: MembersService) {}

  toggle(member: Member) {
    this.membersService.toggle(member);
  }

  remove(id: number) {
    this.membersService.remove(id);
  }
}
```

6. `src/app/member-list/member-list.html` — List template

```html
<ul>
  <li *ngFor="let m of members$ | async" [class.inactive]="!m.active">
    <div class="member-label">
      <a [routerLink]="['/members', m.id]" class="member-name">{{ m.name }}</a>
      <span class="member-meta">{{ m.active ? 'Active' : 'Inactive' }}</span>
    </div>

    <div>
      <button (click)="toggle(m)">Toggle</button>
      <button (click)="remove(m.id)">Remove</button>
    </div>
  </li>
</ul>
```

7. `src/app/member-list/member-list.css` — List styles

```css
ul {
  padding-left: 0;
  margin: 0;
}

li {
  list-style: none;
  margin: 0.4rem 0;
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
```

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
```

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
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MemberAdd } from '../member-add/member-add';
import { MemberList } from '../member-list/member-list';
import { MembersService } from '../members';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MemberAdd, MemberList, AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  constructor(private members: MembersService) {}

  get total$() {
    return this.members.members$.pipe(map((m) => m.length));
  }

  get active$() {
    return this.members.members$.pipe(map((m) => m.filter((x) => x.active).length));
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
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
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
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
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
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { MemberDetail } from './member-detail/member-detail';

const routes = [
  { path: '', component: Dashboard },
  { path: 'members/:id', component: MemberDetail },
];

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)],
};
```

18. `src/main.ts` — bootstrap

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

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
