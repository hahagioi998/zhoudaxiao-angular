import {Component, OnInit,} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IndexService} from '../../../service/index.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit {

  validateForm: FormGroup;
  success: boolean = true;
  errorMessage = '';

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    let params = {
      password: Md5.hashStr(this.validateForm.controls['password'].value),
      email: this.validateForm.controls['email'].value,
      username: this.validateForm.controls['username'].value,
      phone: this.validateForm.controls['phone'].value,
      role: this.validateForm.controls['role'].value,
    };
    this.indexService.registry(params).subscribe(result => {
      if (result.status == 100) {
        this.success = true;
        this.nzMessageService.info('注册成功！');
        setTimeout(() => {
          this.router.navigateByUrl('/check');
        }, 1000);
      } else {
        this.success = false;
        this.errorMessage = result.msg;
      }
    });
  }

  constructor(private fb: FormBuilder, private router: Router, private indexService: IndexService,
              private nzMessageService: NzMessageService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      username: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      role: [0]
    });
  }

  login() {
    this.router.navigateByUrl('/check');
  }
}
