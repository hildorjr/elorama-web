import { Injectable, Injector } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public toast: any = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  public dangerConfirm: any = Swal.mixin({
    showCancelButton: true,
    buttonsStyling: false,
    focusCancel: true,
    customClass: {
      actions: 'buttons',
      confirmButton: 'button is-danger is-light',
      cancelButton: 'button is-light',
    },
  });

  constructor(
    private injector: Injector
  ) { }

  public openToast(icon: string, title: string): void {
    const translate = this.injector.get(TranslateService);
    title = translate.instant(title);
    this.toast.fire({ icon, title });
  }

  public openDangerConfirmDialog(title: string, text: string, confirmButtonText: string, confirmFunction: () => void): void {
    const translate = this.injector.get(TranslateService);
    translate.get([title, text, confirmButtonText, 'Cancel']).subscribe((texts: any) => {
      const keys = Object.keys(texts);
      this.dangerConfirm.fire({
        title: texts[keys[0]],
        text: texts[keys[1]],
        confirmButtonText: texts[keys[2]],
        cancelButtonText: texts[keys[3]],
      })
        .then((result: any) => {
          if (result.value) {
            confirmFunction();
          }
        });
    });
  }
}
