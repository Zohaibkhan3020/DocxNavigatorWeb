import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class IdleService {

  private idleMs = 20 * 60 * 1000;
  private countdownSec = 10;           

  private idleTimer: any;
  private countdownTimer: any;
  private currentCount = this.countdownSec;

  constructor(
    private router: Router,
    private auth: AuthService,
    private ngZone: NgZone
  ) {}
private events = ['mousemove', 'keydown', 'click', 'scroll'];
  private handleActivity = () => this.resetIdleTimer();

startWatching() {
  this.stopWatching(); 
  this.attachEvents();
  this.resetIdleTimer();
}

stopWatching() {
  clearTimeout(this.idleTimer);
  clearInterval(this.countdownTimer);

  this.idleTimer = null;
  this.countdownTimer = null;

  this.detachEvents();
}
private attachEvents() {
  this.events.forEach(e =>
    window.addEventListener(e, this.handleActivity)
  );
}

private detachEvents() {
  this.events.forEach(e =>
    window.removeEventListener(e, this.handleActivity)
  );
}
  private resetIdleTimer() {
    clearTimeout(this.idleTimer);
    clearInterval(this.countdownTimer);

    this.ngZone.runOutsideAngular(() => {
      this.idleTimer = setTimeout(() => {
        this.ngZone.run(() => this.startCountdown());
      }, this.idleMs);
    });
  }

  // 🔥 Countdown start
  private startCountdown() {
    this.currentCount = this.countdownSec;

    this.countdownTimer = setInterval(() => {
      console.log("Logout in:", this.currentCount);

      if (this.currentCount <= 0) {
        clearInterval(this.countdownTimer);
        this.logout();
      }

      this.currentCount--;
    }, 1000);

    // 🔥 Popup after countdown starts
    setTimeout(() => {
      const stay = confirm(`Session expiring! Logout in ${this.currentCount} sec.\nPress OK = Logout\nCancel = Stay`);

      if (!stay) {
        // ❌ Cancel → Stay logged in
        clearInterval(this.countdownTimer);
        this.resetIdleTimer();
      } else {
        // ✅ OK → Logout
        clearInterval(this.countdownTimer);
        this.logout();
      }
    }, 0);
  }

  // 🔹 Logout
  private logout() {
    // alert('Session expired');

    this.auth.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}