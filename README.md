# Angular Workshop: Building a Club Dashboard

Welcome! In this hands-on workshop you'll learn core Angular concepts by building a **Club Members Dashboard** from scratch. By the end, you'll understand:

- Components (the building blocks of Angular apps)
- Services & Dependency Injection (sharing data across components)
- Data binding (connecting TypeScript to templates)
- Observables & the AsyncPipe (reactive data flow)
- Routing (navigating between views)

**Time:** ~45 minutes  
**Difficulty:** Beginner-friendly (some JavaScript/TypeScript experience helpful)

---

## Prerequisites

Before we start, make sure you have:

1. **Node.js** (v16 or higher) — [Download here](https://nodejs.org/)
2. **A code editor** — VS Code recommended
3. **Angular CLI** — Install globally:
   ```bash
   npm install -g @angular/cli
   ```

Verify your setup:

```bash
node --version   # Should show v16+
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

> **Checkpoint:** You should see "Hello, club-dashboard" in your browser. Keep the server running!

---

## Part 2: Understanding Components (10 min)

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
  // ...
})
export class App {}
```

**Key concepts:**

- `@Component` is a **decorator** that tells Angular "this class is a component"
- `selector: 'app-root'` means this component is used as `<app-root>` in HTML
- `templateUrl` points to the HTML file
- `styleUrls` points to the CSS file

### Step 2.2 — Simplify the root component

Replace the contents of `src/app/app.html` with:

```html
<h1>Club Members Dashboard</h1>
<p>Welcome to our club!</p>
```

Save the file. Your browser should automatically refresh and show your new content.

> **Checkpoint:** You should see "Club Members Dashboard" heading in your browser.

---

## Part 3: Create a Service for Data (10 min)

### What is a Service?

A **service** is a class that holds data or logic that multiple components can share. We use **Dependency Injection** to provide services to components.

### Step 3.1 — Generate the members service

In your terminal (open a new one if needed, keep ng serve running):

```bash
ng generate service members --skip-tests
```

This creates `src/app/members.ts`.

### Step 3.2 — Define the Member interface

Open `src/app/members.ts` and add an interface above the class:

```typescript
import { Injectable } from "@angular/core";

// Add this interface - it describes what a Member looks like
export interface Member {
  id: number;
  name: string;
  active: boolean;
}

@Injectable({
  providedIn: "root",
})
export class MembersService {
  // We'll add code here next
}
```

**Why an interface?** TypeScript interfaces define the "shape" of our data. This gives us autocompletion and catches errors early.

### Step 3.3 — Add member data using BehaviorSubject

We'll use RxJS `BehaviorSubject` to store our members. This lets components subscribe to changes.

Update `members.ts`:

```typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Member {
  id: number;
  name: string;
  active: boolean;
}

@Injectable({
  providedIn: "root",
})
export class MembersService {
  // Private BehaviorSubject holds the current list
  private _members = new BehaviorSubject<Member[]>([
    { id: 1, name: "Alice", active: true },
    { id: 2, name: "Bob", active: false },
  ]);

  // Public observable that components can subscribe to
  members$ = this._members.asObservable();
}
```

**Key concepts:**

- `BehaviorSubject` is like a variable that components can "watch" for changes
- `members$` (the `$` suffix is a convention for observables) is what components subscribe to
- `providedIn: 'root'` means one instance is shared across the whole app

> **Checkpoint:** No visible changes yet, but the service is ready!

---

## Part 4: Display the Member List (10 min)

### Step 4.1 — Generate the member-list component

```bash
ng generate component member-list --skip-tests
```

This creates a folder `src/app/member-list/` with three files.

### Step 4.2 — Inject the service into the component

Open `src/app/member-list/member-list.ts` and update it:

```typescript
import { Component } from "@angular/core";
import { AsyncPipe, NgFor } from "@angular/common";
import { MembersService } from "../members";

@Component({
  selector: "app-member-list",
  standalone: true,
  imports: [AsyncPipe, NgFor],
  templateUrl: "./member-list.html",
  styleUrl: "./member-list.css",
})
export class MemberList {
  // Inject the service through the constructor
  constructor(private membersService: MembersService) {}

  // Expose the observable to the template
  get members$() {
    return this.membersService.members$;
  }
}
```

**Key concepts:**

- `constructor(private membersService: MembersService)` — Angular automatically provides the service (Dependency Injection!)
- We use a getter `members$` to expose the observable to our template

### Step 4.3 — Create the template

Open `src/app/member-list/member-list.html` and replace its contents:

```html
<h2>Members</h2>

<ul>
  <li *ngFor="let member of members$ | async">
    {{ member.name }} — {{ member.active ? 'Active' : 'Inactive' }}
  </li>
</ul>
```

**Key concepts:**

- `*ngFor` loops through each member in the array
- `| async` subscribes to the observable and unwraps the value
- `{{ }}` is interpolation — it displays the value in the template

### Step 4.4 — Add the component to the app

Open `src/app/app.ts` and import the component:

```typescript
import { Component } from "@angular/core";
import { MemberList } from "./member-list/member-list";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [MemberList],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {}
```

Now update `src/app/app.html`:

```html
<h1>Club Members Dashboard</h1>

<app-member-list></app-member-list>
```

Save all files.

> **Checkpoint:** You should see "Members" with Alice and Bob listed!

---

## Part 5: Add New Members (10 min)

### Step 5.1 — Add the `add()` method to the service

Open `src/app/members.ts` and add this method inside the class:

```typescript
add(name: string) {
  const currentList = this._members.getValue();
  const newId = currentList.length
    ? Math.max(...currentList.map(m => m.id)) + 1
    : 1;

  const newMember: Member = { id: newId, name, active: true };

  this._members.next([...currentList, newMember]);
}
```

**What's happening:**

1. Get the current list with `getValue()`
2. Calculate the next ID
3. Create a new member object
4. Emit the updated list with `next()`

### Step 5.2 — Generate the member-add component

```bash
ng generate component member-add --skip-tests
```

### Step 5.3 — Build the add form

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
  styleUrl: "./member-add.css",
})
export class MemberAdd {
  name = ""; // This will be bound to the input

  constructor(private membersService: MembersService) {}

  add() {
    const trimmed = this.name.trim();
    if (!trimmed) return; // Don't add empty names

    this.membersService.add(trimmed);
    this.name = ""; // Clear the input
  }
}
```

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

- `[(ngModel)]="name"` is **two-way binding** — the input and the `name` property stay in sync
- `(click)="add()"` is **event binding** — calls `add()` when clicked
- `(keyup.enter)="add()"` — also triggers on Enter key

### Step 5.4 — Add some basic styling

Open `src/app/member-add/member-add.css`:

```css
.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
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

### Step 5.5 — Wire it into the app

Update `src/app/app.ts`:

```typescript
import { Component } from "@angular/core";
import { MemberList } from "./member-list/member-list";
import { MemberAdd } from "./member-add/member-add";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [MemberList, MemberAdd],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {}
```

Update `src/app/app.html`:

```html
<h1>Club Members Dashboard</h1>

<app-member-add></app-member-add>

<app-member-list></app-member-list>
```

Save all files.

> **Checkpoint:** Type a name and click "Add Member" — it should appear in the list instantly!

---

## Part 6: Toggle Member Status (5 min)

### Step 6.1 — Add toggle method to service

Open `src/app/members.ts` and add:

```typescript
toggle(member: Member) {
  const updated = this._members.getValue().map(m =>
    m.id === member.id
      ? { ...m, active: !m.active }
      : m
  );
  this._members.next(updated);
}
```

### Step 6.2 — Add toggle button to the list

Update `src/app/member-list/member-list.ts`:

```typescript
import { Component } from "@angular/core";
import { AsyncPipe, NgFor } from "@angular/common";
import { MembersService, Member } from "../members";

@Component({
  selector: "app-member-list",
  standalone: true,
  imports: [AsyncPipe, NgFor],
  templateUrl: "./member-list.html",
  styleUrl: "./member-list.css",
})
export class MemberList {
  constructor(private membersService: MembersService) {}

  get members$() {
    return this.membersService.members$;
  }

  toggle(member: Member) {
    this.membersService.toggle(member);
  }
}
```

Update `src/app/member-list/member-list.html`:

```html
<h2>Members</h2>

<ul>
  <li *ngFor="let member of members$ | async" [class.inactive]="!member.active">
    <span>{{ member.name }} — {{ member.active ? 'Active' : 'Inactive' }}</span>
    <button (click)="toggle(member)">Toggle</button>
  </li>
</ul>
```

**New concept:**

- `[class.inactive]="!member.active"` — conditionally adds the `inactive` CSS class

Add to `src/app/member-list/member-list.css`:

```css
ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f9fafb;
  border-radius: 4px;
}

li.inactive {
  opacity: 0.6;
}

button {
  padding: 0.25rem 0.5rem;
  background: #e5e7eb;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

> **Checkpoint:** Click "Toggle" — the member should dim and show "Inactive"!

---

## Congratulations! 🎉

You've built a working Angular app with:

✅ **Components** — MemberList, MemberAdd  
✅ **Services** — MembersService with shared state  
✅ **Dependency Injection** — Services injected into components  
✅ **Data Binding** — Two-way with ngModel, event binding with (click)  
✅ **Observables** — BehaviorSubject + AsyncPipe

---

## Bonus Challenges

If you have extra time, try these:

1. **Add a Remove button** — Add a `remove(id: number)` method to the service and a delete button to each list item

2. **Show statistics** — Display "Total: X | Active: Y" above the list using `members$.pipe(map(...))`

3. **Add routing** — Create a detail page for each member:

   ```bash
   ng generate component member-detail --skip-tests
   ```

   Then configure routes in `app.config.ts`

4. **Persist to localStorage** — Save members to localStorage so they survive page refresh

---

## Quick Reference

| Concept              | Syntax                     | Purpose                  |
| -------------------- | -------------------------- | ------------------------ |
| Interpolation        | `{{ value }}`              | Display a value          |
| Property binding     | `[property]="value"`       | Set an element property  |
| Event binding        | `(event)="handler()"`      | React to events          |
| Two-way binding      | `[(ngModel)]="value"`      | Sync input with property |
| Structural directive | `*ngFor`, `*ngIf`          | Add/remove elements      |
| Async pipe           | `observable$ \| async`     | Subscribe in template    |
| Class binding        | `[class.name]="condition"` | Toggle CSS class         |

---

## Resources

- [Angular Documentation](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [Angular CLI Reference](https://angular.dev/cli)

Happy coding! 🚀
