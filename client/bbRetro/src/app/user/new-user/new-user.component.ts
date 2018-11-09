import { Component, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from '../../socket.service';
import { NewUser, Admin } from './user';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class NewUserComponent implements AfterViewInit {

  @ViewChild('userModal') newUserModal: ElementRef;
  @ViewChild('adminModal') adminModal: ElementRef;
  user = new NewUser('');
  admin = new Admin('');
  userRef: NgbModalRef;
  adminRef: NgbModalRef;
  adminName: string;

  constructor(private modalService: NgbModal,
              private socket: SocketService) { }

  ngAfterViewInit() {
    // the view references become available here
    setTimeout(() => {
      this.socket.getAdminStatus()
        .subscribe(response => {
          console.log('admins response:', response);
          console.log('admins name', response.adminName);

          if(response.status === true)
            this.userRef = this.modalService.open(this.adminModal, { centered: true });
          else {
            this.adminName = response.adminName;
            this.adminRef = this.modalService.open(this.newUserModal, { centered: true });
          }
        });
    }, 0);
  }

  sendConfig(modal): void { // type for modal?
    modal.close();
    console.log('admin name', this.admin.name);

    const config = {
      adminName: this.admin.name;
    }

    this.socket.sendConfig(config);
    // send admin config thru socket
    // 
  }
}
