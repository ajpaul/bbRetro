import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { RetroItem, RetroEvent } from './retro';
import { NewUser, Admin } from './user/new-user/user';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor() {
    this.socket = socketIo(environment.socket_url);
  }

  sendItem(message: RetroItem): void {
    message.creator = this.socket.id;
    this.socket.emit('newItem', message);
  }

  // refactor: make a generic event function instead of these 3?
  upvote(retroItem: RetroItem): void { 
    this.socket.emit('upvote', retroItem);
  }

  downvote(retroItem: RetroItem): void {
    this.socket.emit('downvote', retroItem);
  }

  deleteItem(retroItem: RetroItem): void {
    this.socket.emit('deleteItem', retroItem);
  }

  sendConfig(config): void { // add a type
    this.socket.emit('adminConfig', config);
  }

  getMessages = (): Observable<RetroItem> => {
    return Observable.create((observer) => {
      this.socket.on('newItem', (item: RetroItem) => {
          observer.next(item);
          console.log('Received an item on the client: ', item);
      });
    });
  }

  getUpvotes = (): Observable<RetroEvent> => {
    return Observable.create((observer) => {
      this.socket.on('upvote', (retroEvent: RetroEvent) => {
          observer.next(retroEvent);
          console.log('Received an upvote event: ', retroEvent);
      });
    });
  }

  getDownvotes = (): Observable<RetroEvent> => {
    return Observable.create((observer) => {
      this.socket.on('downvote', (retroEvent: RetroEvent) => {
          observer.next(retroEvent);
          console.log('Received a downvote event: ', retroEvent);
      });
    });
  }

  getAdminStatus = () => {
    const admin$ = Observable.create((observer) => {
      this.socket.on('admin', (message) => {
          observer.next(message);
      });
    });

    return admin$.pipe(first());
  }

  getDeletions = () => {
    return Observable.create((observer) => {
      this.socket.on('deleteItem', (message) => {
          observer.next(message);
          console.log('Received a delete event: ', message);
      });
    });
  }

  getUserCount = () => {
    return Observable.create((observer) => {
      this.socket.on('userCount', (message) => {
          observer.next(message);
          console.log('Received a userCount event: ', message);
      });
    });
  }

  getEverything = (): Observable<string> => {
    const allData$: Observable<string> = Observable.create((observer) => {
      this.socket.on('allData', (items: string) => {
          observer.next(items);
      });
    });

    return allData$.pipe(first());
  }
}


// this.socket.on('upvote', (data) => {
//   observer.next(data);
//   console.log('Received a message: ', data);
// });
// this.socket.on('downvote', (data) => {
//   observer.next(data);
//   console.log('Received a message: ', data);
// });
// this.socket.on('delete', (data) => {
//   observer.next(data);
//   console.log('Received a message: ', data);
// });