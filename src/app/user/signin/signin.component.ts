import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AppService } from "src/app/app.service";
import { Subscriber } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit {
  public emailId: string;
  public userPassword: string;
  public forgotPasswordEmail: string;
  public isSent: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private Cookie: CookieService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}
  goToSignUp() {
    this.router.navigate(["/signup"]);
  }

  signinFn() {
    if (!this.emailId) {
      this.toastr.warning("Please enter Email id");
    } else if (!this.userPassword) {
      this.toastr.warning("Please enter Password");
    } else {
      let data = {
        emailId: this.emailId,
        userPassword: this.userPassword
      };
      this.appService.signinFunction(data).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            console.log(apiResponse);

            this.Cookie.set("authtoken", apiResponse.data.authToken);

            this.Cookie.set("userId", apiResponse.data.userDetails.userId);

            this.Cookie.set(
              "userName",
              apiResponse.data.userDetails.firstName +
                " " +
                apiResponse.data.userDetails.lastName
            );
            this.appService.setUserInfoInLocalStorage(
              apiResponse.data.userDetails
            );
            if (apiResponse.data.userDetails.isAdmin === true) {
              this.toastr.success("Admin Logged in");
              this.router.navigate([
                `/meetingPlan/admin/${apiResponse.data.userDetails.userId}`
              ]);
            } else {
              this.toastr.success("User logged in");
              this.router.navigate([
                `/meetingView/${apiResponse.data.userDetails.userId}`
              ]);
            }
          } else {
            this.toastr.error(apiResponse.message);
          }
        },
        err => {
          this.toastr.error("some error occured");
        }
      );
    }
  }

  resetPassword() {
    if (!this.forgotPasswordEmail) {
      this.toastr.warning("Please enter your email Id");
    } else {
      this.appService
        .forgotPasswordSendMail(this.forgotPasswordEmail)
        .subscribe(
          apiResponse => {
            console.log(apiResponse);

            if (apiResponse.status === 200) {
              this.toastr.success("Password Reset Email has been sent");
              this.isSent = true;
            } else {
              this.toastr.error(apiResponse.message);
            }
          },
          err => {
            this.toastr.error("some error occured");
          }
        );
    }
  }
}
