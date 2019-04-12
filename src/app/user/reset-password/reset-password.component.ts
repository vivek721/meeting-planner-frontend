import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "src/app/app.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  public password: string;
  public password1: string;
  public authToken: string;
  public userId: string;
  public data = {};
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) {}

  ngOnInit() {}
  newPasswordReset() {
    if (!this.password) {
      this.toastr.warning("Please enter new password");
    } else if (!this.password1) {
      this.toastr.warning("Please re-type new password");
    } else if (this.password !== this.password1) {
      this.toastr.error("Password doesnot match");
    } else {
      this.userId = this.route.snapshot.paramMap.get("userId");
      this.authToken = this.route.snapshot.queryParamMap.get("authToken");
      this.data = {
        userId: this.userId,
        authToken: this.authToken,
        userPassword: this.password
      };
      this.appService.resetPasswords(this.data).subscribe(
        apiResponse => {
          console.log(apiResponse);

          if (apiResponse.status === 200) {
            this.toastr.success("Password has been reset");
            setTimeout(() => {
              this.router.navigate(["/"]);
            }, 2000);
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
