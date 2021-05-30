import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertType } from 'src/app/enum/alert-type.enum';
import { Post } from 'src/app/model/post';
import { User } from 'src/app/model/user';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  user = new User();
  posts: Post[] = [];
  host: string;
  userHost: string;
  postHost: string;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private postService: PostService,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadingService.isLoading.next(true);
    this.getUserInfo(this.accountService.loggInUsername);
    this.getPosts();
    this.host = this.postService.host;
    this.userHost = this.postService.userHost;
    this.postHost = this.postService.postHost;
    this.loadingService.isLoading.next(false);
  }

  getUserInfo(username: string): void {
    this.subscriptions.push(
      this.accountService.getUserInformation(username).subscribe(
      (response: User) => {
        this.user = response;
      },
      error => {
        console.log(error);
        this.user = null;
        this.logOut();
        this.router.navigateByUrl('/login');
      }
    ));
  }

  logOut(): void {
    this.accountService.logOut();
    this.router.navigateByUrl('/login');
    this.alertService.showAlert(
      'You need to log in to access this page.',
      AlertType.DANGER
    );
  }

  getUserProfile(username: string): void {
    this.router.navigate(['/profile', username]);
    console.log(username);
  }

  getPosts(): void {
    this.subscriptions.push(this.accountService.getPosts().subscribe(
      (response: Post[]) => {
        this.posts = response;
        console.log(this.posts);
        this.loadingService.isLoading.next(false);
      },
      error => {
        console.log(error);
        this.loadingService.isLoading.next(false);
      }
    ));
  }

  onDelete(id: number): void {
    this.subscriptions.push(
      this.postService.delete(id).subscribe(
      response => {
        console.log('The deleted post: ', response);
        this.alertService.showAlert(
          'Post was deleted successfully.',
          AlertType.SUCCESS
        );
        this.getPosts();
      },
      error => {
        console.log(error);
        this.alertService.showAlert(
          'Post was not deleted. Please try again.',
          AlertType.DANGER
        );
        this.getPosts();
      }
    ));
  }

  seeOnePost(postId): void {
    this.router.navigate(['/post', postId]);
    console.log(postId);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
