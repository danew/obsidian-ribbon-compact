import { Plugin, WorkspaceRibbon } from 'obsidian';

const STYLE_ELEMENT = 'compact-plugin';

interface CompactSettings {
	isCompact: boolean;
}

export default class Compact extends Plugin {
	async onload() {
		if (document.getElementById(STYLE_ELEMENT) === null) {
			const styleEl = document.createElement('style');
			styleEl.id = STYLE_ELEMENT;
			styleEl.innerHTML = '.compact-plugin { display: none; } .compact-content { height: 100% !important; }';
			document.head.appendChild(styleEl);
		}

		this.addCommand({
			id: 'toggle-compact',
			name: 'Toggle Compact',
			callback: () => {
				this.toggleCompact();
			},
		});

		const settings = await this.loadData() as CompactSettings;
		// Wait for the UI to paint so we can hide after the fact
		setTimeout(() => {
			this.toggleCompact(settings.isCompact);
		}, 500);
	}

	toggleCompact(override: boolean = false) {
		const statusBar = this.getElement('status-bar');
		const viewHeader = this.getElement('view-header');
		const viewContent = this.getElement('view-content');
		const leftRibbon = this.getContainer(this.app.workspace.leftRibbon);
		const rightRibbon = this.getContainer(this.app.workspace.rightRibbon);

		
		if (statusBar && leftRibbon && rightRibbon && viewHeader) {
			const value = override || !statusBar.hasClass('compact-plugin');

			statusBar.toggleClass('compact-plugin', value);
			leftRibbon.toggleClass('compact-plugin', value);
			rightRibbon.toggleClass('compact-plugin', value);
			viewHeader.toggleClass('compact-plugin', value);
			viewContent.toggleClass('compact-content', value);

			this.saveData({
				isCompact: value
			});
		}
	}

	getElement(className: string): HTMLElement {
		const query = document.getElementsByClassName(className);
		if (query && query.length) {
			return query[0] as HTMLElement;
		}
	}

	getContainer(ribbon: WorkspaceRibbon): HTMLElement | null {
		if ('containerEl' in ribbon) {
			return (ribbon as any).containerEl;
		}
		return null;
	}
}
