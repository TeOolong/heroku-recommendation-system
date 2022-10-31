import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  navList: any[] = [];

  constructor(private http: HttpClient) {
    this.http.get('/assets/data/navigation.json').subscribe((navList: any) => {
      this.navList = navList;
    });
  }

  ngOnInit(): void {}
}
