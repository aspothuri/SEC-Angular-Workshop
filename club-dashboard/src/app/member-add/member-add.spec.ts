import { Component } from '@angular/core';
import { MembersService } from '../members';

@Component({
  selector: 'app-member-add',
  standalone: true,
  templateUrl: './member-add.html',
  styleUrl: './member-add.css',
})
export class MemberAdd {
  constructor(public members: MembersService) {}

  add(name: string) {
    this.members.add(name);
  }
}
