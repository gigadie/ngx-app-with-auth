import { 	Component, OnInit, OnChanges, SimpleChanges, SimpleChange, ChangeDetectorRef,
			ViewEncapsulation, Input, Output, EventEmitter, ContentChild,
			TemplateRef, HostListener, ViewChild, ElementRef } from '@angular/core';

const KEY_CODE = {
	ENTER: 13,
	ESC: 27,
	UP_ARROW: 38,
	DOWN_ARROW: 40
};

const sorter = (fields) => (a, b) => fields.map(o => {
		let dir = 1;
		if (o[0] === '-') { dir = -1; o = o.substring(1); }
		return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
	})
	.reduce((p, n) => p ? p : n, 0);

@Component({
	selector: 'app-drop-down-list',
	templateUrl: './drop-down-list.component.html',
	styleUrls: ['./drop-down-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DropDownListComponent implements OnInit, OnChanges {
	collapsed = true;
	search: string = null;
	preSelectedItem: any = null;
	showTooltipBool = false;

	@Input('items') items: any[];

	@Input('selectedItem') selectedItem: any;
	@Output() selectedItemChange = new EventEmitter<any>();

	@Input('withError') withError?: boolean;
	@Input('showGroupLineBreak') showGroupLineBreak = false;
	@Input('sortby') sortby?: string|string[];
	@Input('placeholder') placeholder?: string;
	@Input('loadingItems') loadingItems?: boolean;
	@Input('disabled') disabled?: boolean;
	@Input('disabledItemMessage') disabledItemMessage = 'this item is disabled';
	@Input('disableReset') disableReset = false;

	@ContentChild('selectedItemTemplate') selectedItemTemplate: TemplateRef<any>;
	@ContentChild('listItemTemplate') listItemTemplate: TemplateRef<any>;

	@ViewChild('chevronButton') chevronButton: ElementRef;
	@ViewChild('searchInput') searchInput: ElementRef;
	@ViewChild('listItemContainer') listItemContainer: ElementRef;

	get filteredItems(): any[] {
		if (!this.items) {
			return [];
		}

		if (!this.search) {
			return this.items.concat([]);
		}

		return this.items.filter(item => {
			const lowercaseItem = (item.description + '').toLowerCase();

			const wordsInItem = lowercaseItem.split(' ');
			const searchTerm = this.search.toLowerCase();

			for (let i = 0; i < wordsInItem.length; i++) {
				if (wordsInItem[i].indexOf(searchTerm) === 0) {
					return true;
				}
			}
		});
	}

	constructor(private changeDetector: ChangeDetectorRef) { }

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges): void {
		const items: SimpleChange = changes.items;
		// console.log('prev value: ', items.previousValue);
		// console.log('got name: ', items.currentValue);
		// re-order array with the sort property
		this.sortItems();
	}

	private sortItems(): void {
		if (this.sortby && this.items && this.items.length > 1) {
			const fields = typeof this.sortby === 'string' ? Array.of(this.sortby) : [...this.sortby];
			this.items = this.items.sort(sorter(fields));
		}
	}

	@HostListener('window:keyup', ['$event'])
	keyEvent($event: KeyboardEvent) {
		if (!this.collapsed && this.items && this.items.some(i => !i.disabled)) {
			switch ($event.keyCode) {
				case KEY_CODE.ENTER:
					if (this.preSelectedItem) { this.selectItem(this.preSelectedItem); }
					break;
				case KEY_CODE.ESC:
					this.close();
					break;
				case KEY_CODE.UP_ARROW:
				case KEY_CODE.DOWN_ARROW:
					this.onKeyUpDown($event.keyCode);
					break;
			}
		}
	}

	private onKeyUpDown(updown: number): void {
		const itm = this.preSelectedItem || this.selectedItem;
		let idx;

		const enabledItems = 	this.filteredItems
								.map((i, index) => Object.assign({ __idx: index }, i))
								.filter(i => !i.disabled);
		const enabledItm = itm ? enabledItems.find(i => i.__idx === this.filteredItems.indexOf(itm)) : null;

		if (updown === KEY_CODE.DOWN_ARROW) {
			// first next enabled item
			idx = enabledItm ? (enabledItems.indexOf(enabledItm) + 1) : 0;
			idx = idx < enabledItems.length ? idx : (enabledItems.length - 1);
		} else {
			// first prev enabled item
			idx = enabledItm ? (enabledItems.indexOf(enabledItm) - 1) : (enabledItems.length - 1);
			idx = idx >= 0 ? idx : 0;
		}

		this.preSelectItem(this.filteredItems[enabledItems[idx].__idx]);
	}

	open($event: any): void {
		this.collapsed = !this.collapsed;
		this.chevronButton.nativeElement.blur();
		this.changeDetector.detectChanges();

		if (!this.collapsed) {
			this.searchInput.nativeElement.focus();
			if (this.selectedItem) {
				this.scrollContainerToItem(this.selectedItem);
			}
		}
	}

	close($event?: MouseEvent): void {
		this.collapsed = true;
		this.preSelectedItem = null;
		this.search = null;
	}

	selectItem(item: any): void {
		if (!item.disabled) {
			this.selectedItem = item;
			this.selectedItemChange.emit(this.selectedItem);
			this.close();
		}
	}

	resetSelection($event: MouseEvent): void {
		if ($event.stopPropagation) {
			$event.stopPropagation();
			$event.preventDefault();
		}
		this.selectedItem = null;
		this.selectedItemChange.emit(this.selectedItem);
	}

	preSelectItem(item: any): void {
		this.preSelectedItem = item;
		this.scrollContainerToItem(item);
	}

	private scrollContainerToItem(item: any): void {
		const child = this.listItemContainer.nativeElement.querySelector(`[scrollId='${this.filteredItems.indexOf(item)}']`);
		if (child) {
			const ch = this.listItemContainer.nativeElement.offsetHeight;
			const cst = this.listItemContainer.nativeElement.scrollTop;
			if (child.offsetTop >= cst + ch) {
				this.listItemContainer.nativeElement.scrollTop = child.offsetTop + child.offsetHeight - ch;
			} else if (child.offsetTop < cst) {
				this.listItemContainer.nativeElement.scrollTop = child.offsetTop;
			}
		}
	}

	searchChanged($event?: any): void {
		this.preSelectedItem = null;
	}

	showTooltip(item: any): void {
		if (item.disabled) {
			this.showTooltipBool = true;
		}
	}

	hideTooltip(item: any): void {
		this.showTooltipBool = false;
	}

	hasDifferentGroupOrder(item1: any, item2: any): boolean {
		if (!this.showGroupLineBreak) { return false; }

		if (item1 && item2 && item1.groupOrder && item2.groupOrder) {
			return item1.groupOrder !== item2.groupOrder;
		}

		return false;
	}
}
