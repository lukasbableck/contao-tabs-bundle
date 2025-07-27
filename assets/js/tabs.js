import "../css/tabs.pcss";

class A11yTabs{
	constructor(){
		this.tabs = [];
		this.activeTabIndex = 0;
		this.init();
	}
	init(){
		const tabElements = document.querySelectorAll('[role="tab"]');
		this.tabs = Array.from(tabElements).map((tab, index) => {
			return {
				id: tab.id,
				isActive: index === 0,
				element: tab
			};
		});
		this.activeTabIndex = this.tabs.findIndex(tab => tab.isActive);
		this.updateTabVisibility();
		document.addEventListener('keydown', this.onKeydown.bind(this));
	}
	updateTabVisibility(){
		this.tabs.forEach((tab, index) => {
			tab.element.setAttribute('aria-selected', tab.isActive);
			tab.element.addEventListener('click', () => {
				this.setActiveTab(tab.id);
			});
		});
		const activeTabContent = document.querySelector(`[role="tabpanel"][aria-labelledby="${this.tabs[this.activeTabIndex].id}"]`);
		if(activeTabContent){
			activeTabContent.classList.remove('hidden');
		}
		const inactiveTabs = this.tabs.filter(t => !t.isActive);
		inactiveTabs.forEach(tab => {
			const content = document.querySelector(`[role="tabpanel"][aria-labelledby="${tab.id}"]`);
			if(content){
				content.classList.add('hidden');
			}
		});
	}
	setActiveTab(tabID){
		const tab = this.tabs.find(t => t.id === tabID);
		if(tab){
			this.activeTabIndex = this.tabs.indexOf(tab);
			this.tabs.forEach((t, index) => {
				t.isActive = (index === this.activeTabIndex);
			});
			this.updateTabVisibility();
		}
	}
	previousTab(){
		if(this.activeTabIndex > 0){
			this.setActiveTab(this.tabs[this.activeTabIndex - 1].id);
		}
	}
	nextTab(){
		if(this.activeTabIndex < this.tabs.length - 1){
			this.setActiveTab(this.tabs[this.activeTabIndex + 1].id);
		}
	}
	onKeydown(event){
		if(event.key === 'ArrowLeft' || event.key === 'ArrowUp'){
			this.previousTab();
			event.preventDefault();
		} else if(event.key === 'ArrowRight' || event.key === 'ArrowDown'){
			this.nextTab();
			event.preventDefault();
		} else if(event.key === 'Home'){
			this.setActiveTab(this.tabs[0].id);
			event.preventDefault();
		} else if(event.key === 'End'){
			this.setActiveTab(this.tabs[this.tabs.length - 1].id);
			event.preventDefault();
		}
	}
}

window.A11yTabs = A11yTabs;