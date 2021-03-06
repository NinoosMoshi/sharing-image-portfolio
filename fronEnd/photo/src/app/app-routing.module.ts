import { ProfileComponent } from './components/profile/profile.component';
import { PostresolverService } from './services/postresolver.service';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { SignupComponent } from './components/signup/signup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationGuard } from './guard/authentication.guard';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path:'resetpassword', component: ResetPasswordComponent},
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'home', component: HomeComponent, canActivate:[AuthenticationGuard]},
  {path:'post/:postId', component: PostDetailComponent, resolve: {resolvedPost: PostresolverService}, canActivate: [AuthenticationGuard]},
  {path:'profile/:username', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: '', redirectTo:'/home', pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
