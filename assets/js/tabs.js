import '../css/tabs.pcss';

class A11yTabs {
	constructor() {
		this.tabs = [];
		this.activeTabIndex = 0;
		this.init();
	}
	init() {
		const tabElements = document.querySelectorAll('[role="tab"]');
		this.tabs = Array.from(tabElements).map((tab, index) => {
			return {
				id: tab.id,
				isActive: index === 0,
				element: tab,
			};
		});
		this.tabs.forEach((tab, index) => {
			tab.element.addEventListener('click', () => {
				this.setActiveTab(tab.id);
			});
			tab.element.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					this.setActiveTab(tab.id);
					event.preventDefault();
				} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
					if (index === 0) {
						return;
					}
					this.previousTab();
					tab.element.previousElementSibling.focus();
					event.preventDefault();
				} else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
					if (index === this.tabs.length - 1) {
						return;
					}
					this.nextTab();
					tab.element.nextElementSibling.focus();
					event.preventDefault();
				}
			});
		});
		this.activeTabIndex = this.tabs.findIndex((tab) => tab.isActive);
		this.updateTabVisibility();
	}
	updateTabVisibility() {
		this.tabs.forEach((tab, index) => {
			tab.element.setAttribute('aria-selected', tab.isActive);
		});
		const activeTabContent = document.querySelector(`[role="tabpanel"][aria-labelledby="${this.tabs[this.activeTabIndex].id}"]`);
		if (activeTabContent) {
			activeTabContent.removeAttribute('tabIndex');
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
	}
	setActiveTab(tabID) {
		const tab = this.tabs.find((t) => t.id === tabID);
		if (tab) {
			this.activeTabIndex = this.tabs.indexOf(tab);
			this.tabs.forEach((t, index) => {
				t.isActive = index === this.activeTabIndex;
			});
			this.updateTabVisibility();
		}
	}
	previousTab() {
		if (this.activeTabIndex > 0) {
			this.setActiveTab(this.tabs[this.activeTabIndex - 1].id);
		}
	}
	nextTab() {
		if (this.activeTabIndex < this.tabs.length - 1) {
			this.setActiveTab(this.tabs[this.activeTabIndex + 1].id);
		}
	}
}

window.A11yTabs = A11yTabs;
