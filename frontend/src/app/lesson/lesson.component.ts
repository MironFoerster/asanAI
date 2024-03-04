import { Component, OnInit, inject, signal } from '@angular/core';
import { ChatElement } from '../structures/chat-element';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';


@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.sass'
})
export class LessonComponent implements OnInit {
  lessonChat = signal<ChatElement[]>([])
  chatScript!: ChatElement[];
  chatScript$!: Observable<ChatElement[]>
  api = inject(ApiService)
  route = inject(ActivatedRoute)

  ngOnInit(): void {
    this.chatScript$ = this.api.get("/lesson/"+this.route.snapshot.paramMap.get('lessonId')).pipe(
      tap((response: ChatElement[]) => {
        this.chatScript = response;
      })
    );
  }
}
