import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { Observable } from "rxjs";

import { catchError, tap } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class MeetingService {
  public baseUrl = "http://meetingapi.gajalportfolio.xyz/api/v1/meeting";

  constructor(public http: HttpClient) {
    console.log("meeting Service works");
  }

  events: any[] = [];

  public getAllMeetingForUserId(userData): any {
    let myResponse = this.http.post(
      this.baseUrl + "/getAllMeetingsForUser",
      userData
    );
    return myResponse;
  }

  public addMeeting(data): any {
    let myResponse = this.http.post(this.baseUrl + "/addMeeting", data);
    return myResponse;
  }

  public deleteMeeting(data): any {
    let myResponse = this.http.post(this.baseUrl + "/deleteMeeting", data);
    return myResponse;
  }

  public updateMeeting(data): any {
    let myResponse = this.http.post(this.baseUrl + "/updateMeeting", data);
    return myResponse;
  }

  public getMeetingByMeetingId(data): any {
    let myResponse = this.http.post(
      this.baseUrl + "/getMeetingByMeetingId",
      data
    );
    return myResponse;
  }
}
