import { Component, OnInit, ViewChild } from "@angular/core";
import { OptionsInput, Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FullCalendarComponent } from "@fullcalendar/angular";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventService } from "../../event.service";
import { CookieService } from "ngx-cookie-service";
import { AppService } from "../../app.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SocketService } from "src/app/socket.service";

@Component({
  selector: "app-meeting-calander",
  templateUrl: "./meeting-calander.component.html",
  styleUrls: ["./meeting-calander.component.css"]
})
export class MeetingCalanderComponent implements OnInit {
  //Variable declaration starts here
  calander: Calendar;
  options: OptionsInput;
  eventsModel: any;
  @ViewChild("fullcalendar") fullcalendar: FullCalendarComponent;

  public selectedUserDetails: any;
  public location: String;
  public authToken: any;
  public userName: any;
  public userInfo: any;
  public selectedFirstName: String;
  public selectedLastName: String;
  public userId: any;
  public createdBy: string;
  public display: boolean = false;
  public allUserDetail: any = [];
  public allDay: boolean;
  public startDate: any;
  public startTime: any;
  public endDate: any;
  public endTime: any;
  public eventTitle: any;
  public displayEvent: boolean;
  public displayDate: boolean;
  public visibleSidebar1: boolean = false;
  public createEventTitle: string;
  public selectedUserId: string;
  public event = [];
  public selectedEventId: any;
  public eventData = {
    eventTitle: null,
    creatorId: null,
    creatorName: null,
    creatorForEmail: null,
    createdForId: null,
    createdForName: null,
    actionPerformed: null,
    eventStart: null
  };
  //variable declaration ends here

  //constructor starts
  constructor(
    private eventService: EventService,
    private Cookie: CookieService,
    private appService: AppService,
    private router: Router,
    private toastr: ToastrService,
    private socketService: SocketService
  ) {}
  //constructor end

  //ngOnInit start
  ngOnInit() {
    this.visibleSidebar1 = true;
    this.authToken = this.Cookie.get("authtoken");

    this.userInfo = this.appService.getUserInfoFromLocalstorage();

    this.userId = this.Cookie.get("userId");

    this.userName = `${this.userInfo.firstName.substring(
      0,
      this.userInfo.firstName.length - 6
    )} ${this.userInfo.lastName}`;

    this.eventService.getAllUserDetails(this.authToken).subscribe(
      response => {
        this.allUserDetail = response;
      },
      error => {
        console.log(error);
      }
    );
    this.options = {
      editable: false,
      eventLimit: 2,
      selectable: true,
      fixedWeekCount: false,
      lazyFetching: true,
      height: 800,
      header: {
        left: "prev,next today customButton",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin]
    };
  }
  //ngOnInit end

  //eventClick funtion
  eventClick(model) {
    this.allDay = false;
    this.startDate = `${model.event.start.getFullYear()}-${(
      "0" +
      (model.event.start.getMonth() + 1)
    ).slice(-2)}-${("0" + model.event.start.getDate()).slice(-2)}`;

    this.endDate = `${model.event.end.getFullYear()}-${(
      "0" +
      (model.event.end.getMonth() + 1)
    ).slice(-2)}-${("0" + model.event.end.getDate()).slice(-2)}`;

    this.eventTitle = model.event.title;
    this.displayEvent = true;
    this.selectedEventId = model.event.id;
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

  //dateSelect funstion
  dateSelect(model) {
    this.allDay = true;
    this.startDate = model.startStr;
    this.startTime = "00:00:00";
    this.endDate = model.endStr;
    this.endTime = "00:00:00";
    this.displayDate = true;
  }

  //logout fuction
  public logout: any = () => {
    this.appService.logout().subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          console.log("logout called");
          this.Cookie.delete("authtoken");

          this.Cookie.delete("userId");

          this.Cookie.delete("userName");
          this.toastr.success("successfully logged out");

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

  //createEvent function
  createEvent() {
    let data = {
      title: this.eventTitle,
      startDate: `${this.startDate}T${this.startTime}`,
      endDate: `${this.endDate}T${this.endTime}`,
      location: this.location,
      userId: this.selectedUserId,
      creatorId: this.userId,
      creatorName: this.userName,
      authToken: this.authToken
    };
    console.log(data);
    this.eventService.createEvents(data).subscribe(
      response => {
        this.toastr.success("event created");
        this.eventData = {
          eventTitle: this.eventTitle,
          creatorId: this.userInfo.userId,
          creatorName: this.userInfo.firstName,
          creatorForEmail: this.selectedUserDetails.emailId,
          createdForId: this.selectedUserId,
          createdForName: this.selectedFirstName,
          actionPerformed: "created",
          eventStart: `${this.startDate}T${this.startTime}`
        };
        console.log("emitting " + this.eventData.createdForId);
        this.socketService.eventOccured(this.eventData);
        this.userSelectedToAddMeeting(this.selectedUserDetails);
      },
      error => {
        this.toastr.error("error occured in creating event");
      }
    );
  }

  //userSelectedToAddMeetingfunction

  userSelectedToAddMeeting(user) {
    this.selectedUserDetails = user;
    this.visibleSidebar1 = false;
    this.selectedUserId = user.userId;
    this.selectedFirstName = user.firstName;
    this.selectedLastName = user.lastName;
    let data = {
      userId: user.userId,
      authToken: this.authToken
    };
    this.eventService.getEvents(data).subscribe(
      response => {
        this.eventsModel = response.data;
        console.log(this.eventsModel);
      },
      error => {
        console.log("error", error);
      }
    );
  }

  //updateEvent function
  updateEvent() {
    let data = {
      id: this.selectedEventId,
      start: `${this.startDate}T${this.startTime}`,
      end: `${this.endDate}T${this.endTime}`,
      location: this.location,
      title: this.eventTitle,
      authToken: this.authToken
    };
    console.log(data);
    this.eventService.editEvent(data).subscribe(
      response => {
        this.toastr.success("Successfully editted the event");
        this.eventData = {
          eventTitle: this.eventTitle,
          creatorId: this.userInfo.userId,
          creatorName: this.userInfo.firstName,
          creatorForEmail: this.selectedUserDetails.emailId,
          createdForId: this.selectedUserId,
          createdForName: this.selectedFirstName,
          actionPerformed: "Updated",
          eventStart: `${this.startDate}T${this.startTime}`
        };
        console.log("emitting " + this.eventData.createdForId);
        this.socketService.eventOccured(this.eventData);
        this.userSelectedToAddMeeting(this.selectedUserDetails);
      },
      error => {
        this.toastr.error("error occured while editting");
      }
    );
  }

  //deleteEvent function
  deleteEvent() {
    this.eventService
      .deleteEvent(this.selectedEventId, this.authToken)
      .subscribe(
        response => {
          this.eventData = {
            eventTitle: this.eventTitle,
            creatorId: this.userInfo.userId,
            creatorName: this.userInfo.firstName,
            creatorForEmail: this.selectedUserDetails.emailId,
            createdForId: this.selectedUserId,
            createdForName: this.selectedFirstName,
            actionPerformed: "deleted",
            eventStart: null
          };
          console.log("emitting " + this.eventData.createdForId);
          this.socketService.eventOccured(this.eventData);
          this.toastr.success("Successfully deleted the event");
          this.userSelectedToAddMeeting(this.selectedUserDetails);
        },
        error => {
          this.toastr.error("error occured while editting");
        }
      );
  }
}
