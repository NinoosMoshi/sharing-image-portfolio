
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertType } from 'src/app/enum/alert-type.enum';
import { Comment } from 'src/app/model/comment';
import { Post } from 'src/app/model/post';
import { User } from 'src/app/model/user';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PostService } from 'src/app/services/post.service';




@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  user = new User();
  posts: Post[] = [];
  host: string;
  userHost: string;
  postHost: string;
  userName: string;
  comment: Comment = new Comment();
  commentList: Array<object> = [];
  post: Post = new Post();
  like: string;
  isUser: boolean;
  postId: number;
  color: string;

  constructor(
    public accountService: AccountService,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadingService.isLoading.next(true);
    this.comment.content = '';
    this.resolvePost();
  }

  resolvePost(): void {
    const resolvedPost: Post = this.route.snapshot.data.resolvedPost;
    if (resolvedPost != null) {
      console.log(resolvedPost);
      this.post = resolvedPost;
      this.userHost = this.postService.userHost;
      this.postHost = this.postService.postHost;
      this.host = this.postService.host;
      this.getUserInfo(this.accountService.loggInUsername);
      this.loadingService.isLoading.next(false);
    } else {
      this.loadingService.isLoading.next(false);
      this.alertService.showAlert('Post was not found.', AlertType.DANGER);
      this.router.navigateByUrl('/home');
    }
  }

  getUserInfo(username: string): void {
    this.subscriptions.push(
      this.accountService.getUserInformation(username).subscribe(
        (response: User) => {
          this.displayLike(response);
          this.user = response;
          console.log(this.user);
        },
        error => {
          console.log(error);
        }
      )
    );
  }

  getUserProfile(username: string): void {
    this.router.navigate(['/profile', username]);
    console.log(username);
  }

  onDelete(id: number) {
    this.subscriptions.push(
      this.postService.delete(id).subscribe(
        response => {
          console.log('The deleted post: ', response);
          this.alertService.showAlert(
            'Post was deleted successfully.',
            AlertType.SUCCESS
          );
          this.router.navigateByUrl('/home');
        },
        error => {
          console.log(error);
          this.alertService.showAlert(
            'Post was not deleted. Please try again.',
            AlertType.DANGER
          );
        }
      )
    );
  }

  onAddComment(comment, post: Post) {
    this.comment.content = '';
    const newComment: Comment = new Comment();
    newComment.content = comment.value.content;
    newComment.postId = comment.value.postId;
    newComment.postedDate = new Date();
    newComment.username = comment.value.username;
    console.log(newComment);
    post.commentList.push(newComment);
    this.subscriptions.push(
      this.postService.saveComment(newComment).subscribe(
        response => {
          console.log(response);
          console.log('Comment has been saved to the database...');
        },
        error => {
          this.loadingService.isLoading.next(false);
          console.log(error);
        }
      )
    );
  }

  displayLike(user: User) {
    const result: Post = user.likedPost.find(post => post.id === this.post.id);
    if (result) {
      this.like = 'Unlike';
      this.color = '#18BC9C';
      console.log('testing');
    } else {
      this.like = 'Like';
      this.color = '#000000';
    }
  }

  likePost(post, user) {
    if (this.color === '#000000') {
      this.color = '#18BC9C';
      this.like = 'Unlike';
      this.doLike(post, user);
      post.likes += 1;
    } else {
      this.color = '#000000';
      this.like = 'Like';
      this.doUnlike(post, user);
      if (user.likedPosts != null) {
        for (let i = 0; i < user.likedPosts.length; i++) {
          if (user.likedPosts[i].id === post.id) {
            user.likedPosts.splice(i, 1);
          }
        }
      }
      if (post.likes > 0) {
        this.post.likes -= 1;
      }
    }
  }

  doLike(post, user) {
    this.subscriptions.push(
      this.postService.like(post.id, user.username).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      )
    );
  }

  doUnlike(post, user) {
    this.subscriptions.push(
      this.postService.unLike(post.id, user.username).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      )
    );
  }

}
