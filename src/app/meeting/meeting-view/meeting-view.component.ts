import { Component, OnInit, ViewChild } from "@angular/core";
import { OptionsInput, Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarComponent } from "ng-fullcalendar";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventService } from "../../event.service";
import { AppService } from "src/app/app.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SocketService } from "src/app/socket.service";

@Component({
  selector: "app-meeting-view",
  templateUrl: "./meeting-view.component.html",
  styleUrls: ["./meeting-view.component.css"]
})
export class MeetingViewComponent implements OnInit {
  options: OptionsInput;
  public allDay: any = false;
  @ViewChild("fullcalendar") fullcalendar: CalendarComponent;
  public authToken: any;
  public userInfo: any;
  public userName: any;
  public userId: any;
  public displayDate: boolean = false;
  public location: string;
  public createdBy: string;
  public displayEvent: boolean = false;
  public startDate: string;
  public endDate: string;
  public startTime: string;
  public endTime: string;
  public eventTitle: string;
  public allUsers: any = [];
  public eventsModel: any;
  public disconnectedSocket: boolean = false;
  public displayRemainder: boolean = false;
  public interval: any;

  constructor(
    private eventService: EventService,
    private Cookie: CookieService,
    private appService: AppService,
    private router: Router,
    private toastr: ToastrService,
    private socketService: SocketService
  ) {}
  ngOnInit() {
    this.verifyUserConfirmation();
    this.authToken = this.Cookie.get("authtoken");

    this.userInfo = this.appService.getUserInfoFromLocalstorage();

    this.userId = this.Cookie.get("userId");
    this.userName = this.userInfo.firstName + " " + this.userInfo.lastName;

    let data = {
      userId: this.userId,
      authToken: this.authToken
    };
    console.log(data);
    this.eventService.getEvents(data).subscribe(
      response => {
        this.eventsModel = response.data;
        console.log(response);
        this.options = {
          editable: false,
          eventLimit: 2,
          fixedWeekCount: false,
          height: 800,
          header: {
            left: "prev,next today myCustomButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          },
          plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin]
        };
      },
      error => {
        console.log("error", error);
      }
    );
    this.showAlertForEvent();
    this.notifyUserAboutMeeting();
  }

  eventClick(model) {
    this.allDay = false;
    console.log(model);
    this.startDate = model.event.start.toString().substring(0, 15);
    this.endDate = model.event.end.toString().substring(0, 15);
    this.eventTitle = model.event.title;
    this.displayEvent = true;
    this.eventsModel.forEach(event => {
      if (event.id === model.event.id) {
        console.log(event);
        this.location = event.location;
        this.createdBy = event.creatorName;
        this.startTime = event.start.substring(event.start.indexOf("T") + 1);
        this.endTime = event.end.substring(event.end.indexOf("T") + 1);
      }
    });
  }

  dateClick(model) {
    this.allDay = true;
    console.log(model);
    this.startDate = model.date.toString().substring(0, 15);
    this.displayDate = true;
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(data => {
      this.disconnectedSocket = false;

      this.socketService.setUser(this.authToken);
    });
  };

  public showAlertForEvent: any = () => {
    this.socketService.alertUser(this.userId).subscribe(data => {
      this.toastr.success(
        "an event was " +
          data.actionPerformed +
          " please refresh to see the event"
      );
      setTimeout(() => {
        window.location.reload();
      }, 4000);

      console.log("an event was " + data.actionPerformed);
    });
  };

  public notifyUserAboutMeeting: any = data => {
    console.log("calling notifyUserAboutMeeting()");
    this.socketService.alertUserForUpcommingMeeting().subscribe(
      data => {
        this.eventTitle = data.eventTitle;
        this.interval = setInterval(() => {
          this.displayRemainder = true;
        }, 5000);
      },
      err => {
        console.log(err);
      }
    );
  };
  stopDisplayRemainder() {
    this.displayRemainder = false;
    clearInterval(this.interval);
  }

  public logout: any = () => {
    this.appService.logout().subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          console.log("logout called");
          this.Cookie.delete("authtoken");

          this.Cookie.delete("receiverId");

          this.Cookie.delete("receiverName");

          this.Cookie.delete("io");

          this.socketService.exitSocket();

          this.router.navigate(["/"]);
        } else {
          this.toastr.error(apiResponse.message);
        } // end condition
      },
      err => {
        this.toastr.error("some error occured");
      }
    );
  };
}
