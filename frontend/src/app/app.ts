import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [CommonModule, RouterOutlet, RouterModule],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	protected readonly title = signal('frontend');
	isMenuVisible = false;
	isMobileView = false;

	constructor() {
		this.checkScreenSize();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.checkScreenSize();
	}

	checkScreenSize() {
		this.isMobileView = window.innerWidth <= 600;
		if (!this.isMobileView) {
			this.isMenuVisible = true; // Show menu in large format
		} else {
			this.isMenuVisible = false; // Hide menu in mobile format
		}
	}

	toggleMenu() {
		if (this.isMobileView) {
			this.isMenuVisible = !this.isMenuVisible; // Toggle only in mobile view
		}
	}

	showMenu() {
		if (this.isMobileView) {
			this.isMenuVisible = true; // Show menu on hover in mobile view
		}
	}

	hideMenu() {
		if (this.isMobileView) {
			this.isMenuVisible = false; // Hide menu on mouse leave in mobile view
		}
	}
}
