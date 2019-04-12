import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { RouterModule } from "@angular/router";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

@NgModule({
  declarations: [SignupComponent, SigninComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: "signup", component: SignupComponent },
      {
        path: "resetpasword/:userId",
        component: ResetPasswordComponent
      }
    ])
  ]
})
export class UserModule {}
