import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MembersService } from '../members';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './member-detail.html',
  styleUrls: ['./member-detail.css'],
})
export class MemberDetail {
  constructor(
    private route: ActivatedRoute,
    private members: MembersService,
    private router: Router
  ) {}

  get id() {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  get member$() {
    return this.members.members$.pipe(
      map(list => list.find(m => m.id === this.id))
    );
  }

  name = '';

  save() {
    if (!this.name.trim()) return;
    this.members.updateName(this.id, this.name);
    this.router.navigate(['/']);
  }

  toggle(m: any) {
    this.members.toggle(m);
  }

  remove() {
    this.members.remove(this.id);
    this.router.navigate(['/']);
  }
}
