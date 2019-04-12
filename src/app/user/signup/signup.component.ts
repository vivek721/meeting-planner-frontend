import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { userDetails } from "../UserDetails";
import { AppService } from "src/app/app.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  public cntryName: any;
  public country = [];
  public cntryCode: any;
  public code = [];
  public selectedValue: string;
  public selectedCountryCode: string = null;
  public firstName: string;
  public lastName: string;
  public emailId: string;
  public phoneNumber: string;
  public userPassword: string;
  public userData: userDetails;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.appService.getCountryName().subscribe(
      data => {
        this.cntryName = data;
        for (let cnt in this.cntryName) {
          this.country.push(this.cntryName[cnt]);
        }
      },
      err => {
        console.log("error occured");
      }
    );
  }
  goToSignIn() {
    this._router.navigate(["/"]);
  }

  selectCountryCode() {
    this.appService.getCountryCode().subscribe(
      data => {
        this.cntryCode = data;
        for (let cnt in this.cntryCode) {
          this.code.push(this.cntryCode[cnt]);
        }
        this.selectedCountryCode = this.code[
          this.country.indexOf(this.selectedValue)
        ];
      },
      err => {
        console.log("error occured");
      }
    );
  }

  onSignUp() {
    let fullPhoneNumber = `(${this.selectedCountryCode})-${this.phoneNumber}`;
    if (!this.firstName) {
      this.toastr.warning("enter first name");
    } else if (!this.lastName) {
      this.toastr.warning("enter last name");
    } else if (!this.emailId) {
      this.toastr.warning("enter mobile");
    } else if (!this.phoneNumber) {
      this.toastr.warning("Invalid email");
    } else if (!this.userPassword) {
      this.toastr.warning("enter password");
    } else {
      this.userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        emailId: this.emailId,
        phoneNumber: fullPhoneNumber,
        userPassword: this.userPassword
      };

      this.appService.signupFunction(this.userData).subscribe(
        apiResponse => {
          console.log(apiResponse);

          if (apiResponse.status === 200) {
            this.toastr.success("Signup successful");

            setTimeout(() => {
              this.goToSignIn();
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
