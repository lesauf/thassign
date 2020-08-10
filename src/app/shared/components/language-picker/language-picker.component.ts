import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef,
} from '@angular/core';
import { User } from 'src/app/core/models/user/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ma-language-picker',
  templateUrl: './language-picker.component.html',
  styleUrls: ['./language-picker.component.scss'],
})
export class LanguagePickerComponent implements OnInit {
  /**
   *
   * @description     		Property that stores the selected language
   *  value from the component
   */
  language: string;

  isOpen = false;

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  constructor(
    private elementRef: ElementRef,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.language = this.translate.currentLang;
  }

  /**
   * Capture the selected language from the  component
   *
   * @method changeLanguage
   */
  public changeLanguage(lang: string): void {
    this.language = lang;
    this.translate.use(this.language);
    // Close selector
    this.isOpen = false;
  }
}
