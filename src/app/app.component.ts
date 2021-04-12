import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-financial-planning';


  constructor(private authService: AuthService) {
    this.authService.isTokenValid();
  }

  ngOnInit() {
  }
}
