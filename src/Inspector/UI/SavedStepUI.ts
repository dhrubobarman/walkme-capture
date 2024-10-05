import { deleteIcon } from '@/assets/svgs';
import { StepData } from '@/Inspector/types';
import { UI } from '@/Inspector/UI';
import { Collapse } from '@/Inspector/UI/Collapse';

import { DragAndDrop } from '@/Inspector/UI/DragAndDrop';
import {
  createCollapseButton,
  createHandle,
  inserItemInSavedSidebar,
  savedSidebar,
  savedSidebarHeader,
  savedSidebarUl,
  saveSidebarUlContainer
} from '@/Inspector/UI/UIElements';
import { createElement } from '@/utils/createElement';

export class SavedStepUI {
  ui: UI;
  container = savedSidebar;
  savedSidebarHeader = savedSidebarHeader;
  private savedSidebarUl = savedSidebarUl;
  private collapseButton: HTMLButtonElement = createCollapseButton(savedSidebarHeader);
  private savedSidebarDragHandle: HTMLButtonElement = createHandle(savedSidebarHeader);
  private stepData: StepData[] = [];
  private interval: NodeJS.Timeout | undefined;
  private retryConnection: number = 0;
  name: string;
  onContainerClick: (container: HTMLElement, name: string) => void;

  constructor(ui: UI, name: string, onContainerClick: (container: HTMLElement, name: string) => void = () => {}) {
    this.ui = ui;
    new Collapse(this.collapseButton, saveSidebarUlContainer);
    this.name = name;
    this.onContainerClick = onContainerClick;
    this.init();
  }

  private async init() {
    this.container.onclick = () => {
      this.onContainerClick(this.container, this.name);
    };
    try {
      this.interval = setInterval(async () => {
        if (this.retryConnection > 10) {
          alert('Database is not ready yet. Please try again later.');
          clearInterval(this.interval);
          return;
        }
        if (this.ui.indexedDb.isDBReady) {
          console.log('DB is ready');
          clearInterval(this.interval);
          await this.fetchData();
        } else {
          this.retryConnection++;
          console.log('DB is not ready yet');
        }
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  }
  initDND(name: string, handleZIndex: (container: HTMLElement, name: string) => void) {
    new DragAndDrop(this.container, this.savedSidebarDragHandle, name, handleZIndex);
  }
  private renderStepData() {
    this.savedSidebarUl.innerHTML = '';
    this.stepData.forEach((stepData) => {
      const sidebarItem = inserItemInSavedSidebar(stepData);
      sidebarItem.onclick = () => {
        this.ui.captureUI.renderStepDataList(stepData);
      };
      createElement(
        'button',
        {
          className:
            'btn btn-sm btn-square btn-error btn-outline !text-[var(--error)] border-[var(--inspector-border-color,gray)] hover:border-[var(--inspector-border-color,gray)]',
          innerHTML: deleteIcon,
          title: 'Delete Flow',
          onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.deleteStepData(stepData);
          }
        },
        sidebarItem
      );
      this.savedSidebarUl.appendChild(sidebarItem);
    });
  }
  private async deleteStepData(stepData: StepData) {
    try {
      await this.ui.indexedDb.deleteData(stepData._id);
      await this.fetchData();
    } catch (error) {
      console.error(error);
    }
  }
  async fetchData() {
    if (!this.ui.indexedDb.isDBReady) {
      alert('Database is not ready yet. Please try again later.');
      return;
    }
    try {
      const data = await this.ui.indexedDb.getStoreData();
      this.stepData = data;
      this.renderStepData();
    } catch (error) {
      console.error(error);
    }
  }
}
