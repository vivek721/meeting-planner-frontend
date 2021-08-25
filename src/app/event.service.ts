import { Inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable()
export class EventService {
  // private baseURL = `http://api.edvivek.xyz/api/v1/meeting`;
  private baseURL = `http://localhost:3000/api/v1/meeting`; 
  constructor(private http: HttpClient) {}

  //get events passing userId as param
  public getEvents(data): Observable<any> {
    const params = new HttpParams().set("userId", data.userId);

    return this.http.post(
      `${this.baseURL}/getEvent?authToken=${data.authToken}`,
      params
    );
  }

  public createEvents(data): Observable<any> {
    const params = new HttpParams()
      .set("title", data.title)
      .set("startDate", data.startDate)
      .set("endDate", data.endDate)
      .set("location", data.location)
      .set("userId", data.userId)
      .set("creatorId", data.creatorId)
      .set("creatorName", data.creatorName);

    return this.http.post(
      `${this.baseURL}/createEvent?authToken=${data.authToken}`,
      params
    );
  }

  getAllUserDetails(authToken) {
    return this.http.get(`${this.baseURL}/allUsers?authToken=${authToken}`);
  }

  editEvent(data) {
    const params = new HttpParams()
      .set("title", data.title)
      .set("start", data.start)
      .set("end", data.end)
      .set("location", data.location);

    console.log(params);
    return this.http.post(
      `${this.baseURL}/${data.id}/editEvent?authToken=${data.authToken}`,
      params
    );
  }

  deleteEvent(eventId, authToken) {
    return this.http.get(
      `${this.baseURL}/${eventId}/deleteEvent?authToken=${authToken}`
    );
  }
}
