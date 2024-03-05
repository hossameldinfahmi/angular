import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Post } from '../../models/post';
import { PageInfo } from '../../models/blog-info';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll.directive';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterLink, AsyncPipe, InfiniteScrollDirective],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  posts!: Post[];
  blogService: BlogService = inject(BlogService);
  paginationInfo: PageInfo = { hasNextPage: true, endCursor: '' };
  isHiddenLoadMore: boolean = false;
  isActiveInfiniteScroll: boolean = false;

  private router = inject(Router);

  ngOnInit() {
    this.loadPosts();
  }

  navigateToPost(slug: string) {
    this.router.navigate(['/post', slug]);
  }

  loadMorePosts(): void {
    if (!this.paginationInfo.hasNextPage) return;
    this.isHiddenLoadMore = true;
    this.blogService.getPosts(10, this.paginationInfo.endCursor).pipe(
    ).subscribe(newPosts => {
      this.isActiveInfiniteScroll = true;
      this.paginationInfo = newPosts.pagination;
      this.posts = this.posts.concat(newPosts.posts);
    });
  }

  private loadPosts(): void {
    this.blogService.getPosts(10, this.paginationInfo.endCursor).subscribe(blogPaginationInfo => {
      this.paginationInfo = blogPaginationInfo.pagination;
      this.posts = blogPaginationInfo.posts;
    });
  }
}
