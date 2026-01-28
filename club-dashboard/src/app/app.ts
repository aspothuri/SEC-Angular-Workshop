import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MemberAdd } from './member-add/member-add';
import { MemberList } from './member-list/member-list';
import { MembersService } from './members';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MemberAdd, MemberList, AsyncPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  get members$() {
    return this.members.members$;
  }

  get total$() {
    return this.members.members$.pipe(map(m => m.length));
  }

  get active$() {
    return this.members.members$.pipe(map(m => m.filter(x => x.active).length));
  }

  constructor(private members: MembersService) {}
}
