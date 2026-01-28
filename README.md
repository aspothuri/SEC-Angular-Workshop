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

**Exercises to expand**

- Add validation to the Add form
- Add a confirmation dialog before remove
- Add an icon for inactive members

**Support**

If anything breaks, inspect the compiler output and correct typos. Use the repository `src/app` files as the reference implementation.

---

This README mirrors the workshop instructions and guides learners through the code in the correct order.
