import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  UntypedFormBuilder,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { RecommendationService } from '../services/recommendationService.service';
type ValidateFnCallback = (
  self: FormControl,
  other: FormControl
) => ValidationErrors;

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'],
})
export class RecommendationComponent implements OnInit {
  decisions: any[] = [
    { label: 'Si', value: 'Y' },
    { label: 'No', value: 'N' },
  ];

  currentCount = 1;
  results: any[] = [];

  scales: any[] = [1, 2, 3, 4, 5];

  form: FormGroup;
  title = 'sem2-workspace';
  current: any = {};
  tops: any = [];
  bottoms: any = [];
  foots: any = [];
  @Output() recommendationData = new Subject<any>();

  constructor(
    private _sanitizer: DomSanitizer,
    private recommendationService: RecommendationService,
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient
  ) {
    this.form = this.getFormGroup();
  }

  item: any = undefined;

  ngOnInit(): void {
    this.generateData();
  }

  loadRecommendation(key: string) {
    this.recommendationService.getByKey(key).subscribe((item) => {
      this.item = item;
      this.current = { ...item.current };
      this.current.image = this._sanitizer.bypassSecurityTrustResourceUrl(
        'data:image/jpg;base64,' + item.current.image
      );
      this.bottoms = [];

      for (let ele of item.bottom) {
        this.bottoms.push(
          this._sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/jpg;base64,' + ele
          )
        );
      }
      this.tops = [];
      for (let ele of item.top) {
        this.tops.push(
          this._sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/jpg;base64,' + ele
          )
        );
      }
      this.foots = [];
      for (let ele of item.foot) {
        this.foots.push(
          this._sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/jpg;base64,' + ele
          )
        );
      }
    });
  }

  generateData() {
    this.http.get('/assets/data/keys.json').subscribe((items: any) => {
      let random = Math.floor(Math.random() * items.keys.length);
      this.loadRecommendation(items.keys[random]);
    });
  }

  getFormGroup(): FormGroup {
    let form: FormGroup;
    form = new FormGroup({
      first_question: new FormControl('', Validators.required),
      first_question_bonus: new FormControl(''),
      second_question_bonus: new FormControl(''),
      third_question_bonus: new FormControl(''),
      first_recomendation: new FormControl('', Validators.required),
      second_recomendation: new FormControl('', Validators.required),
      third_recomendation: new FormControl('', Validators.required),
      fourth_recomendation: new FormControl('', Validators.required),
    });
    return form;
  }
  submit() {
    let currentCount = this.currentCount;
    this.results.push(this.form.value);

    if (currentCount + 1 > 10) {
      this.recommendationData.next(this.results);
    } else {
      this.currentCount += 1;
      this.generateData();
      this.form.reset();
    }
  }

  requiredWhen(
    targetControlName: string,
    targetControlValue: any,
    allowedValue: any = null
  ): any {
    return watchControl(targetControlName, (self, other) => {
      if (other.value !== targetControlValue) {
        return null as any;
      }

      if (
        Validators.required(self) &&
        (allowedValue === null || self.value !== allowedValue)
      ) {
        return { requiredWhen: 'This field is required.' };
      }
      return null as any;
    });
  }
}

function watchControl(targetControlName: string, validate: ValidateFnCallback) {
  let control2: any;
  return (control: FormControl) => {
    const form = <FormGroup>control.root;
    let newControl;
    if (
      !form ||
      !form.controls ||
      !(newControl = form.get(targetControlName))
    ) {
      return null;
    }

    if (control2 !== newControl) {
      control2 = newControl;
      control2.valueChanges.subscribe(() => control.updateValueAndValidity());
    }
    return validate(control, control2);
  };
}
