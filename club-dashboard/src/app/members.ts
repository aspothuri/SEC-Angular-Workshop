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
      this.membersSubject.value.map(m => (m.id === id ? { ...m, name: value } : m))
    );
  }

  remove(id: number) {
    this.membersSubject.next(this.membersSubject.value.filter(m => m.id !== id));
  }

  toggle(member: Member) {
    this.membersSubject.next(
      this.membersSubject.value.map(m =>
        m.id === member.id ? { ...m, active: !m.active } : m
      )
    );
  }
}
