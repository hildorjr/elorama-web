import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switch',
  templateUrl: './language-switch.component.html',
  styleUrls: ['./language-switch.component.scss']
})
export class LanguageSwitchComponent implements OnInit {

  public langs: any[] = [
    {
      flag: 'assets/svg/flags/us.svg',
      label: 'English',
      lang: 'en-US',
    },
    {
      flag: 'assets/svg/flags/br.svg',
      label: 'Português',
      lang: 'pt-BR',
    },
  ];

  public currentLang: string;

  public constructor(private translate: TranslateService) { }

  public ngOnInit(): void {
    this.translate.addLangs(['en-US', 'pt-BR']);
    const currentLang = localStorage.getItem('lang');
    if (currentLang) {
      this.setLang(currentLang);
    } else {
      if (navigator.language && this.translate.getLangs().includes(navigator.language)) {
        this.setLang(navigator.language);
      } else {
        this.setLang(this.translate.currentLang);
      }
    }
  }

  public setLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
  }

}
