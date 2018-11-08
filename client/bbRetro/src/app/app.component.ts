import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';
import { map } from 'rxjs/operators';
import { RetroItem, RetroEvent } from './retro';
import { NewUserComponent } from './user/new-user/new-user.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'bbRetro';
  item: RetroItem = { text: '', id: null, upvotes: 0, downvotes: 0, creator: '' };
  retroItems: RetroItem[] = [];
  totalUsers: number;

  constructor(private socket: SocketService) {}

  ngOnInit() {
    this.listenForEvents();

    // open welcome or admin modal

  }

  createNewItem(): void {
    this.socket.sendItem(this.item);
    this.item = {
      text: '', id: null, upvotes: 0, downvotes: 0, creator: ''
    };
    // get state here
    // update retroItems

  }

  upvote(retroItem: RetroItem): void {
    this.socket.upvote(retroItem);
  }

  downvote(retroItem: RetroItem): void {
    this.socket.downvote(retroItem);
  }

  deleteItem(retroItem: RetroItem): void {
    this.socket.deleteItem(retroItem);
  }

  renderData(data: string): void {
    this.retroItems = Object.values(JSON.parse(data));
    console.log(this.retroItems);
  }

  listenForEvents() {
    this.socket.getMessages()
      .subscribe((val: RetroItem) => {
        this.retroItems.push(val);
        console.log(this.retroItems);
      });

    this.socket.getUpvotes()
      .subscribe((val: RetroEvent) => {
        console.log('upvote: ', val);

        const idx = this.retroItems.findIndex(item => item.id === +val.id);
        console.log('found retroitem record at index: ', idx);
        this.retroItems[idx].upvotes++;
      });

    this.socket.getDownvotes()
      .subscribe((val: RetroEvent) => {
        console.log('downvote: ', val);

        const idx = this.retroItems.findIndex(item => item.id === +val.id);
        console.log('found retroitem record at index: ', idx);
        this.retroItems[idx].downvotes++;
      });

    this.socket.getDeletions()
      .subscribe(val => {
        console.log('delete: ', val);
      });

    this.socket.getUserCount()
      .subscribe(response => {
        console.log('total active users: ', response.totalUsers);
        this.totalUsers = response.totalUsers;
      });

    // gets everything when you first connect, then completes
    this.socket.getEverything()
      .subscribe({
        next: (data: string) => this.renderData(data),
        error: err => console.error('An error occured retrieving all initial data: ' + err),
        complete: () => console.log('Complete: getEverything()'),
      });
  }
}
