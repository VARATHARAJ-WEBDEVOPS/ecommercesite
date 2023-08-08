import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
  isScrolled: boolean = false;

  Name: string = '';
  Email: string = '';
  Message: string = '';
  FeedbackForm!: FormGroup;
  showError: string = "";

  constructor(public router: Router,
    private userservce: UserService,
    private fb: FormBuilder) { }

  @HostListener('window:scroll', [])

  onWindowScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollPercentage = (scrollY / (document.body.scrollHeight - windowHeight)) * 100;
    this.isScrolled = scrollPercentage > 50;
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/dashboard');
    }
    this.FeedbackForm = this.fb.group({
      Name: [''],
      Email: [''],
      Message: ['']
    });
  }

  sendFeedback() {
    if (this.Name === "") {
      this.showError = "Please enter Name";
    } else if (this.Email === "") {
      this.showError = "Please enter Email";
    } else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(this.Email)) {
      this.showError = "Invalid Email";
    } else if (this.Message === "") {
      this.showError = "Please type something on message";
    } else if (this.Name && this.Email && this.Message) {
      this.FeedbackForm.value.Name = this.Name;
      this.FeedbackForm.value.Email = this.Email;
      this.FeedbackForm.value.Message = this.Message;
      this.userservce.postFeedbackData(this.FeedbackForm.value).subscribe(res => {
        console.log(res);
        if (res) {
          alert(`Hey! ${this.Name} Your Message Had been send! :)`);
          this.Name = "";
          this.Email = "";
          this.Message = "";
          this.showError ="";
        }
      });

    }
  }

}
