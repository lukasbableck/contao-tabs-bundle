import '../css/tabs.pcss';

class A11yTabs {
	constructor(element) {
		this.element = element;
		this.tabs = [];
		this.activeTabIndex = 0;
		this.orientation = this.element.querySelector('[role="tablist"]').getAttribute('aria-orientation') || 'horizontal';
		this.tabs = Array.from(this.element.querySelectorAll('[role="tab"]')).map((tab, index) => {
			return {
				id: tab.id,
				isActive: index === 0,
				element: tab,
			};
		});
		this.tabs.forEach((tab) => {
			this.bindEvents(tab);
		});
		this.activeTabIndex = this.tabs.findIndex((tab) => tab.isActive);
		this.updateTabVisibility();
	}

	bindEvents(tab) {
		tab.element.addEventListener('click', () => {
			this.setActiveTab(tab);
		});
		tab.element.addEventListener('keydown', (event) => {
			if (this.orientation == 'vertical' ? event.key == 'ArrowUp' : event.key == 'ArrowLeft') {
				this.previousTab();
			} else if (this.orientation == 'vertical' ? event.key == 'ArrowDown' : event.key == 'ArrowRight') {
				this.nextTab();
			} else if (event.key === 'Home') {
				this.setActiveTab(this.tabs[0]);
			} else if (event.key === 'End') {
				this.setActiveTab(this.tabs[this.tabs.length - 1]);
			}

			if ((this.orientation == 'vertical' ? event.key == 'ArrowUp' : event.key == 'ArrowLeft') || (this.orientation == 'vertical' ? event.key == 'ArrowDown' : event.key == 'ArrowRight') || event.key == 'Home' || event.key == 'End') {
				this.focusActiveTab();
				event.preventDefault();
			}
		});
	}

	updateTabVisibility() {
		if(this.activeTabIndex == -1) return;

		this.tabs.forEach((tab) => {
			tab.element.setAttribute('tabindex', tab.isActive ? '0' : '-1');
			tab.element.setAttribute('aria-selected', tab.isActive);
		});
		const activeTabContent = document.querySelector(`[role="tabpanel"][aria-labelledby="${this.tabs[this.activeTabIndex].id}"]`);
		if (activeTabContent) {
			activeTabContent.tabIndex = 0;
			activeTabContent.classList.remove('hidden');
		}
		const inactiveTabs = this.tabs.filter((t) => !t.isActive);
		inactiveTabs.forEach((tab) => {
			const content = document.querySelector(`[role="tabpanel"][aria-labelledby="${tab.id}"]`);
			if (content) {
				content.tabIndex = -1;
				content.classList.add('hidden');
			}
		});
		const event = new CustomEvent('a11y-tabs:after-change', {
			detail: {
				activeTab: this.tabs[this.activeTabIndex],
				allTabs: this.tabs,
			},
		});
		this.element.dispatchEvent(event);
	}

	setActiveTab(tab) {
		this.activeTabIndex = this.tabs.indexOf(tab);
		this.tabs.forEach((t, index) => {
			if (index === this.activeTabIndex) {
				t.isActive = true;
			} else {
				t.isActive = false;
			}
		});
		this.updateTabVisibility();
	}

	previousTab() {
		if (this.activeTabIndex > 0) {
			this.setActiveTab(this.tabs[this.activeTabIndex - 1]);
		} else {
			this.setActiveTab(this.tabs[this.tabs.length - 1]);
		}
	}

	nextTab() {
		if (this.activeTabIndex < this.tabs.length - 1) {
			this.setActiveTab(this.tabs[this.activeTabIndex + 1]);
		} else {
			this.setActiveTab(this.tabs[0]);
		}
	}

	focusActiveTab() {
		const activeTab = this.tabs[this.activeTabIndex];
		if (activeTab && activeTab.element) {
			activeTab.element.focus();
		}
	}
}

window.A11yTabs = A11yTabs;
