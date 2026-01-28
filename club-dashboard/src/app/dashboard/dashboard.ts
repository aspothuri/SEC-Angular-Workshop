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
    return this.members.members$.pipe(map(m => m.length));
  }

  get active$() {
    return this.members.members$.pipe(map(m => m.filter(x => x.active).length));
  }
}
