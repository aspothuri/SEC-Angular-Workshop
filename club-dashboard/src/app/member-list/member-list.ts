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
