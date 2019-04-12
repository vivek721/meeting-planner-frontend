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
  public receiverId: any;
  public displayDate: boolean = false;
  public displayEvent: boolean = false;
  public startDate: string;
  public endDate: string;
  public eventTitle: string;

  constructor(
    private eventService: EventService,
    private Cookie: CookieService,
    private appService: AppService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.authToken = this.Cookie.get("authtoken");

    this.userInfo = this.appService.getUserInfoFromLocalstorage();

    this.receiverId = this.Cookie.get("receiverId");
    this.userName = this.userInfo.firstName;
    this.eventService.getEvents().subscribe(
      data => {
        this.options = {
          editable: false,
          eventLimit: false,
          fixedWeekCount: false,
          height: 800,
          header: {
            left: "prev,next today myCustomButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          },
          plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
          events: data
        };
      },
      error => {
        console.log("error", error);
      }
    );
  }
  eventClick(model) {
    this.allDay = false;
    console.log(model);
    this.startDate = model.event.start.toString().substring(0, 15);
    this.endDate = model.event.end.toString().substring(0, 15);
    this.eventTitle = model.event.title;
    this.displayEvent = true;
  }

  dateClick(model) {
    this.allDay = true;
    console.log(model);
    this.startDate = model.date.toString().substring(0, 15);
    this.displayDate = true;
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

          //   this.SocketService.exitSocket();

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
