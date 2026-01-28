# Angular Workshop: Building a Club Dashboard

Welcome! In this hands-on workshop you'll learn core Angular concepts by building a **Club Members Dashboard** from scratch. By the end, you'll have built an app with:

- A dashboard showing member statistics
- A member list with toggle and remove actions
- A form to add new members
- A detail page to view and edit individual members
- Navigation between pages using Angular Router

**What you'll learn:**

- Components (the building blocks of Angular apps)
- Services & Dependency Injection (sharing data across components)
- Data binding (connecting TypeScript to templates)
- Observables & the AsyncPipe (reactive data flow)
- Routing (navigating between views)
- Route parameters (passing data via URLs)

**Time:** ~60 minutes  
**Difficulty:** Beginner-friendly (some JavaScript/TypeScript experience helpful)

---

## Prerequisites

Before we start, make sure you have:

1. **Node.js** (v18 or higher) — [Download here](https://nodejs.org/)
2. **A code editor** — VS Code recommended
3. **Angular CLI** — Install globally:
   ```bash
   npm install -g @angular/cli
   ```

Verify your setup:

```bash
node --version   # Should show v18+
ng version       # Should show Angular CLI version
```

---

## Part 1: Create the Project (5 min)

### Step 1.1 — Generate a new Angular app

Open your terminal and run:

```bash
ng new club-dashboard --style=css --ssr=false
```

When prompted:

- **Would you like to enable autocompletion?** → No (or Yes if you want)
- **Would you like to share usage data?** → No

This creates a new folder `club-dashboard` with a fully working Angular app.

### Step 1.2 — Open in VS Code and start the dev server

```bash
cd club-dashboard
code .
```

In the VS Code terminal, start the development server:

```bash
ng serve --open
```

Your browser should open to `http://localhost:4200` showing the Angular welcome page.

> **✓ Checkpoint:** You should see "Hello, club-dashboard" in your browser. Keep the server running throughout!

---

## Part 2: Understanding Components (5 min)

### What is a Component?

A **component** is a reusable piece of UI. Every component has:

- A **TypeScript class** (the logic)
- An **HTML template** (the view)
- Optional **CSS styles** (the look)

### Step 2.1 — Explore the root component

Open `src/app/app.ts`. You'll see something like:

```typescript
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {}
```

**Key concepts:**

- `@Component` is a **decorator** that tells Angular "this class is a component"
- `selector: 'app-root'` means this component renders as `<app-root>` in HTML
- `standalone: true` means this component doesn't need an NgModule
- `imports: [...]` lists other components/directives this component uses
- `templateUrl` points to the HTML file
- `styleUrl` points to the CSS file

### Step 2.2 — Simplify the root component

Replace the contents of `src/app/app.html` with:

```html
<h1>Club Members Dashboard</h1>
<p>Welcome to our club!</p>
```

Save the file. Your browser should automatically refresh.

> **✓ Checkpoint:** You should see "Club Members Dashboard" heading in your browser.

---

## Part 3: Create a Service for Data (10 min)

### What is a Service?

A **service** is a class that holds data or logic that multiple components can share. We use **Dependency Injection** to provide services to components.

### Step 3.1 — Generate the members service

In a new terminal (keep `ng serve` running):

```bash
ng generate service members --skip-tests
```

This creates `src/app/members.ts`.

### Step 3.2 — Define the Member type

Open `src/app/members.ts` and replace its contents with:

```typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Define what a Member looks like
export type Member = {
  id: number;
  name: string;
  active: boolean;
};

@Injectable({ providedIn: "root" })
export class MembersService {
  // We'll add the implementation next
}
```

**Why a type?** TypeScript types define the "shape" of our data. This gives us autocompletion and catches errors early.

### Step 3.3 — Add member data using BehaviorSubject

We'll use RxJS `BehaviorSubject` to store our members. This lets components subscribe to changes reactively.

Update `src/app/members.ts` to add the data and observable:

```typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type Member = {
  id: number;
  name: string;
  active: boolean;
};

@Injectable({ providedIn: "root" })
export class MembersService {
  private nextId = 4; // Track the next ID to assign

  // Private BehaviorSubject holds the current list
  private membersSubject = new BehaviorSubject<Member[]>([
    { id: 1, name: "Ava", active: true },
    { id: 2, name: "Ben", active: true },
    { id: 3, name: "Chris", active: false },
  ]);

  // Public observable that components subscribe to
  members$ = this.membersSubject.asObservable();

  // Synchronous getter for current value (useful sometimes)
  get members(): Member[] {
    return this.membersSubject.value;
  }
}
```

**Key concepts:**

- `BehaviorSubject` is like a variable that components can "watch" for changes
- `members$` (the `$` suffix is a convention for observables) is what components subscribe to
- `providedIn: 'root'` means one instance is shared across the whole app

### Step 3.4 — Add methods to modify members

Add these methods inside the `MembersService` class:

```typescript
  add(name: string) {
    const value = name.trim();
    if (!value) return;

    this.membersSubject.next([
      ...this.membersSubject.value,
      { id: this.nextId++, name: value, active: true },
    ]);
  }

  toggle(member: Member) {
    this.membersSubject.next(
      this.membersSubject.value.map(m =>
        m.id === member.id ? { ...m, active: !m.active } : m
      )
    );
  }

  updateName(id: number, name: string) {
    const value = name.trim();
    if (!value) return;

    this.membersSubject.next(
      this.membersSubject.value.map(m =>
        m.id === id ? { ...m, name: value } : m
      )
    );
  }

  remove(id: number) {
    this.membersSubject.next(
      this.membersSubject.value.filter(m => m.id !== id)
    );
  }
```

**What each method does:**

- `add()` — creates a new member with a unique ID
- `toggle()` — flips the `active` status
- `updateName()` — changes a member's name
- `remove()` — deletes a member from the list

> **✓ Checkpoint:** No visible changes yet, but the service is ready with all CRUD operations!

---

## Part 4: Create the Member List Component (10 min)

### Step 4.1 — Generate the component

```bash
ng generate component member-list --skip-tests
```

This creates `src/app/member-list/` with three files.

### Step 4.2 — Inject the service and expose the observable

Open `src/app/member-list/member-list.ts` and replace with:

```typescript
import { Component } from "@angular/core";
import { NgFor, AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MembersService, Member } from "../members";

@Component({
  selector: "app-member-list",
  standalone: true,
  imports: [NgFor, AsyncPipe, RouterLink],
  templateUrl: "./member-list.html",
  styleUrls: ["./member-list.css"],
})
export class MemberList {
  constructor(private membersService: MembersService) {}

  // Expose observable to template via getter
  get members$() {
    return this.membersService.members$;
  }

  toggle(member: Member) {
    this.membersService.toggle(member);
  }

  remove(id: number) {
    this.membersService.remove(id);
  }
}
```

**Key concepts:**

- `constructor(private membersService: MembersService)` — Angular automatically provides the service
- We use a **getter** `members$` to expose the observable
- `RouterLink` is imported so we can link to the detail page

### Step 4.3 — Create the template with actions

Open `src/app/member-list/member-list.html` and replace with:

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

**Key concepts:**

- `*ngFor="let m of members$ | async"` — loops through members; `async` subscribes to the observable
- `[class.inactive]="!m.active"` — adds CSS class conditionally
- `[routerLink]="['/members', m.id]"` — creates a link to `/members/1`, `/members/2`, etc.
- `(click)="toggle(m)"` — event binding calls the method when clicked

### Step 4.4 — Add styles

Open `src/app/member-list/member-list.css`:

```css
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  background: #f9fafb;
  border-radius: 6px;
}

li.inactive {
  opacity: 0.6;
}

.member-label {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.member-name {
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}

.member-name:hover {
  text-decoration: underline;
}

.member-meta {
  color: #666;
  font-size: 0.9rem;
}

button {
  padding: 0.25rem 0.5rem;
  margin-left: 0.25rem;
  background: #e5e7eb;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #d1d5db;
}
```

> **✓ Checkpoint:** Component created! We'll add it to the page after setting up routing.

---

## Part 5: Create the Add Member Form (10 min)

### Step 5.1 — Generate the component

```bash
ng generate component member-add --skip-tests
```

### Step 5.2 — Build the form logic

Open `src/app/member-add/member-add.ts`:

```typescript
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MembersService } from "../members";

@Component({
  selector: "app-member-add",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./member-add.html",
  styleUrls: ["./member-add.css"],
})
export class MemberAdd {
  name = ""; // Bound to the input field

  constructor(private membersService: MembersService) {}

  add() {
    this.membersService.add(this.name);
    this.name = ""; // Clear input after adding
  }
}
```

### Step 5.3 — Create the template

Open `src/app/member-add/member-add.html`:

```html
<div class="add-form">
  <input
    [(ngModel)]="name"
    placeholder="Enter member name"
    (keyup.enter)="add()"
  />
  <button (click)="add()">Add Member</button>
</div>
```

**Key concepts:**

- `[(ngModel)]="name"` is **two-way binding** — the input and `name` property stay in sync
- `(keyup.enter)="add()"` — triggers add when pressing Enter

### Step 5.4 — Add styles

Open `src/app/member-add/member-add.css`:

```css
.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}
```

> **✓ Checkpoint:** Add form ready! Next we'll create the dashboard to combine these.

---

## Part 6: Create the Dashboard Component (10 min)

The Dashboard combines the add form and member list, plus shows statistics.

### Step 6.1 — Generate the component

```bash
ng generate component dashboard --skip-tests
```

### Step 6.2 — Add statistics using observables

Open `src/app/dashboard/dashboard.ts`:

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

  // Derive total count from the members observable
  get total$() {
    return this.members.members$.pipe(map((m) => m.length));
  }

  // Derive active count from the members observable
  get active$() {
    return this.members.members$.pipe(
      map((m) => m.filter((x) => x.active).length),
    );
  }
}
```

**Key concepts:**

- `map()` transforms the observable data — here we're computing counts
- We compose child components (`MemberAdd`, `MemberList`) by importing them
- Statistics update automatically when members change!

### Step 6.3 — Create the template

Open `src/app/dashboard/dashboard.html`:

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

### Step 6.4 — Add styles

Open `src/app/dashboard/dashboard.css`:

```css
h1 {
  margin-bottom: 0.25rem;
}

.stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
  color: #666;
}

hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1rem 0;
}
```

> **✓ Checkpoint:** Dashboard ready with stats! Now we need routing to display it.

---

## Part 7: Create the Member Detail Page (10 min)

This page shows a single member and lets you edit their name.

### Step 7.1 — Generate the component

```bash
ng generate component member-detail --skip-tests
```

### Step 7.2 — Read the route parameter

Open `src/app/member-detail/member-detail.ts`:

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
  name = ""; // For the edit input

  constructor(
    private route: ActivatedRoute,
    private members: MembersService,
    private router: Router,
  ) {}

  // Get the ID from the URL (e.g., /members/2 → id = 2)
  get id() {
    return Number(this.route.snapshot.paramMap.get("id"));
  }

  // Find the member with this ID
  get member$() {
    return this.members.members$.pipe(
      map((list) => list.find((m) => m.id === this.id)),
    );
  }

  save() {
    if (!this.name.trim()) return;
    this.members.updateName(this.id, this.name);
    this.router.navigate(["/"]); // Go back to dashboard
  }

  toggle(m: any) {
    this.members.toggle(m);
  }

  remove() {
    this.members.remove(this.id);
    this.router.navigate(["/"]); // Go back to dashboard
  }
}
```

**Key concepts:**

- `ActivatedRoute` gives access to route parameters
- `this.route.snapshot.paramMap.get('id')` reads the `:id` from the URL
- `Router.navigate(['/'])` programmatically navigates to another page

### Step 7.3 — Create the template

Open `src/app/member-detail/member-detail.html`:

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

**Key concepts:**

- `*ngIf="member$ | async as m; else notFound"` — if member exists, render content; otherwise show `#notFound` template
- `<ng-template #notFound>` — a named template block for the "not found" case
- `routerLink="/"` — declarative navigation back to home

### Step 7.4 — Add styles

Open `src/app/member-detail/member-detail.css`:

```css
h2 {
  margin-bottom: 0.5rem;
}

.detail {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.value {
  font-weight: 600;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

input {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #e5e7eb;
}

button:hover {
  background: #d1d5db;
}

a {
  color: #2563eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

> **✓ Checkpoint:** Detail page ready! Now let's wire up routing.

---

## Part 8: Set Up Routing (10 min)

Routing lets users navigate between the Dashboard and Member Detail pages.

### Step 8.1 — Configure routes

Open `src/app/app.config.ts` and replace with:

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

**Key concepts:**

- `path: ''` — the default route (home page)
- `path: 'members/:id'` — a route with a **parameter**; `:id` is a placeholder
- `provideRouter(routes)` — registers the routes with Angular

### Step 8.2 — Update the root component

Open `src/app/app.ts`:

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

### Step 8.3 — Add navigation and router outlet

Open `src/app/app.html`:

```html
<nav>
  <a routerLink="/">Dashboard</a>
</nav>

<div class="app-shell">
  <router-outlet></router-outlet>
</div>
```

**Key concepts:**

- `<router-outlet>` is where Angular renders the current route's component
- `routerLink="/"` creates a link to the home route

### Step 8.4 — Add global styles

Open `src/app/app.css`:

```css
:root {
  --bg: #f6f8fa;
  --card: #ffffff;
  --accent: #2563eb;
  --border: #e5e7eb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
  background: var(--bg);
  color: #111827;
}

nav {
  background: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 1rem;
}

nav a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

nav a:hover {
  text-decoration: underline;
}

.app-shell {
  max-width: 800px;
  margin: 1.5rem auto;
  padding: 1rem;
  background: var(--card);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Step 8.5 — Verify main.ts is correct

Open `src/main.ts` and ensure it looks like:

```typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

> **✓ Checkpoint:** Save all files. Your app should now show:
>
> - The Dashboard at `http://localhost:4200/`
> - Member detail at `http://localhost:4200/members/1`
> - Click a member name to navigate to their detail page!

---

## Congratulations! 🎉

You've built a complete Angular application with:

| Feature       | What you learned                                 |
| ------------- | ------------------------------------------------ |
| Dashboard     | Composing components, deriving data with `map()` |
| Member List   | `*ngFor`, conditional classes, event binding     |
| Add Form      | Two-way binding with `[(ngModel)]`               |
| Member Detail | Route parameters, `*ngIf` with `else`            |
| Service       | `BehaviorSubject`, dependency injection          |
| Routing       | Route config, `<router-outlet>`, `routerLink`    |

---

## Key Angular Concepts Summary

| Concept              | Syntax                              | Purpose                  |
| -------------------- | ----------------------------------- | ------------------------ |
| Interpolation        | `{{ value }}`                       | Display a value          |
| Property binding     | `[property]="value"`                | Set an element property  |
| Event binding        | `(event)="handler()"`               | React to DOM events      |
| Two-way binding      | `[(ngModel)]="value"`               | Sync input with property |
| Structural directive | `*ngFor`, `*ngIf`                   | Add/remove DOM elements  |
| Async pipe           | `observable$ \| async`              | Subscribe in template    |
| Class binding        | `[class.name]="condition"`          | Toggle CSS class         |
| Router link          | `[routerLink]="['/path', param]"`   | Navigate declaratively   |
| Route parameter      | `route.snapshot.paramMap.get('id')` | Read URL params          |

---

## Bonus Challenges

Try extending the app:

1. **Validation** — Prevent adding members with empty or numeric-only names
2. **Confirmation** — Show a confirm dialog before removing a member
3. **Sort** — Add buttons to sort members by name or status
4. **Search** — Add a filter input to search members by name
5. **Persist** — Save members to `localStorage` so they survive page refresh

---

## Troubleshooting

**"Can't bind to 'ngModel'"**  
→ Make sure `FormsModule` is in the component's `imports` array

**"Cannot find module '../members'"**  
→ Check that `src/app/members.ts` exists and exports `MembersService`

**Page is blank**  
→ Check the browser console for errors; run `ng build` to see compile errors

**Route not working**  
→ Ensure `provideRouter(routes)` is in `app.config.ts` and `RouterOutlet` is imported in `app.ts`

---

## Resources

- [Angular Documentation](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [Angular CLI Reference](https://angular.dev/cli)

Happy coding! 🚀
