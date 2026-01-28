import { Component } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { MembersService, Member } from '../members'; // adjust path if needed

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [NgFor, AsyncPipe],
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
}
