import { Component, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class NewUserComponent implements AfterViewInit {

  @ViewChild('userModal') newUserModal: ElementRef;
  @ViewChild('adminModal') adminModal: ElementRef;

  constructor(private modalService: NgbModal,
              private socket: SocketService) { }

  ngAfterViewInit() {
    // the view references become available here
    setTimeout(() => {
      this.socket.getAdminStatus()
        .subscribe(response => {
          console.log('admins response:', response);

          if(response.status === true)
            this.modalService.open(this.adminModal, { centered: true });
          else 
            this.modalService.open(this.newUserModal, { centered: true });
        });
    }, 0);
  }
}
