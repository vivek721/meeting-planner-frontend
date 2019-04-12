import { Component, OnInit, ViewChild } from "@angular/core";
import { OptionsInput, Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarComponent } from "ng-fullcalendar";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventService } from "../../event.service";
import { CookieService } from "ngx-cookie-service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-meeting-calander",
  templateUrl: "./meeting-calander.component.html",
  styleUrls: ["./meeting-calander.component.css"]
})
export class MeetingCalanderComponent implements OnInit {
  options: OptionsInput;
  eventsModel: any;
  @ViewChild("fullcalendar") fullcalendar: CalendarComponent;
  public authToken: any;
  public userInfo: any;
  public userName: any;
  public receiverId: any;
  display: boolean = false;

  constructor(
    private eventService: EventService,
    private Cookie: CookieService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.authToken = this.Cookie.get("authtoken");

    this.userInfo = this.appService.getUserInfoFromLocalstorage();

    this.receiverId = this.Cookie.get("receiverId");
    this.userName = this.userInfo.firstName;

    this.eventService.getEvents().subscribe(
      data => {
        this.options = {
          editable: true,
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
    console.log(model);
  }
  eventDragStop(model) {
    console.log(model);
  }
  dateClick(model) {
    console.log(model);
  }
  get yearMonth(): string {
    const dateObj = new Date();
    return dateObj.getUTCFullYear() + "-" + (dateObj.getUTCMonth() + 1);
  }
}
