import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RecommendationService } from './services/recommendationService.service';
import { SurveyService } from './services/surveyService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  nextStep = false;
  req: any = {};

  constructor(
    private recommendationService: RecommendationService,
    private surveyService: SurveyService
  ) {
    // this.recommendationService
    //   .getAllKeys()
    //   .subscribe((data) => console.log(data));
  }
  ngOnInit(): void {}

  firstStep(data: any) {
    this.nextStep = true;
    this.req.user = data;
  }
  secondStep(data: any) {
    this.req.results = data;
    this.surveyService
      .postSurveyResult(this.req)
      .subscribe((res) => console.log(res));
    window.location.href =
      'https://docs.google.com/forms/d/e/1FAIpQLScgHEeXyXwjYpxWYxEalGrXRUeJfJ0GYo1Ehkd-pWziCsMKOg/viewform?usp=sharing';
  }
}
