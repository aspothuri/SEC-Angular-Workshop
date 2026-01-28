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
