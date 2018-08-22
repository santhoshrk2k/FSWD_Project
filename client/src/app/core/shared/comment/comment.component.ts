// Decorators and Lifehooks
import { Component, TemplateRef, Input, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// Services
import { CommentService } from '../../services/comment.service';

// Models
import { Comment } from '../../models/comment.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input('bookId') bookId: string;
  comments: Comment[];
  commentForm: FormGroup;
  modalRef: BsModalRef;
  isFromEdit: boolean;
  lastEditId: string;
  currentPage = 1;

  constructor(
    private commentService: CommentService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      'content': new FormControl('')
    });
    this.commentService
      .getComments(this.bookId, (this.currentPage - 1).toString())
      .subscribe((res) => {
        this.comments = res.data;
      });
  }

  ngOnDestroy(): void {
  }

  openModal(template: TemplateRef<any>, id?: string): void {
    if (id) {
      let content = '';
      this.isFromEdit = true;
      this.lastEditId = id;
      for (const c of this.comments) {
        if (c._id === id) {
          content = c.content;
          break;
        }
      }

      this.commentForm.patchValue({ content: content });
    } else {
      this.isFromEdit = false;
      this.commentForm.patchValue({ content: '' });
    }

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'commentModal' })
    );
  }

  onSubmit(): void {
    if (this.isFromEdit) {
      this.modifyComment();
    } else {
      this.createComment();
    }
  }

  createComment() {
    this.commentService
      .addComment(this.bookId, this.commentForm.value)
      .subscribe((res) => {
        this.comments.unshift(res.data);
      });
  }

  modifyComment() {
    const editedContent = this.commentForm.value.content;
    this.commentService
      .editComment(this.lastEditId, this.commentForm.value)
      .subscribe(() => {
        for (const c of this.comments) {
          if (c._id === this.lastEditId) {
            c.content = editedContent;
            break;
          }
        }
      });
  }

  removeComment() {

  }

  get content() {
    return this.commentForm.get('content');
  }

}
