import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CookieService } from "ngx-cookie-service";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { UserModule } from "./user/user.module";
import { MeetingModule } from "./meeting/meeting.module";
import { EventService } from "./event.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UserModule,
    HttpClientModule,
    MeetingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [CookieService, EventService],
  bootstrap: [AppComponent]
})
export class AppModule {}
