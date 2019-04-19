import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { FullCalendarModule } from "ng-fullcalendar";
import { MeetingCalanderComponent } from "./meeting-calander/meeting-calander.component";
import { RouterModule } from "@angular/router";
import { MeetingViewComponent } from "./meeting-view/meeting-view.component";
import { DialogModule } from "primeng/dialog";
import { SidebarModule } from "primeng/sidebar";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [MeetingCalanderComponent, MeetingViewComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FullCalendarModule,
    DialogModule,
    SidebarModule,
    ButtonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "meetingPlan/admin/:userId",
        component: MeetingCalanderComponent
      },
      {
        path: "meetingView/:userId",
        component: MeetingViewComponent
      }
    ])
  ]
})
export class MeetingModule {}
