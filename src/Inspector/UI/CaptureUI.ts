import { deleteIcon } from '@/assets/svgs';
import { Step, StepData } from '@/Inspector/types';
import { UI } from '@/Inspector/UI';
import { Collapse } from '@/Inspector/UI/Collapse';
import { DragAndDrop } from '@/Inspector/UI/DragAndDrop';
import {
  cardActions,
  cardContent,
  createButton,
  createCollapseButton,
  createHandle,
  createInput,
  createSidebaItem,
  dialogElementContainer,
  dialogFooterContainer,
  inspectorContainer,
  listTitle,
  modal,
  saveButton,
  sidebar,
  sidebarUl,
  startButton
} from '@/Inspector/UI/UIElements';
import { createElement } from '@/utils/createElement';

export class CaptureUI {
  ui: UI;
  container: HTMLDivElement;
  collapseButton: HTMLButtonElement = createCollapseButton();
  private sidebarDragHandle: HTMLButtonElement = createHandle();
  private modal: HTMLDialogElement;
  private startButton: HTMLButtonElement;
  stepData: Partial<StepData> = {};
  private modalFooterContainer: HTMLDivElement;
  started: boolean = false;
  private modalContentContainer: HTMLDivElement;

  private saveButton = saveButton;
  private sidebarUl: HTMLUListElement = sidebarUl;
  private resumeButton: HTMLButtonElement = createButton({
    innerText: 'Resume',
    className: 'btn-success',
    type: 'button'
  });

  listTitle = listTitle;
  cardActions: HTMLDivElement = cardActions;
  paused: boolean = false;
  name: string;
  onContainerClick: (container: HTMLElement, name: string) => void;
  constructor(ui: UI, name: string, onContainerClick: (container: HTMLElement, name: string) => void = () => {}) {
    this.ui = ui;
    this.container = sidebar;
    this.modal = modal;
    this.startButton = startButton;
    this.modalContentContainer = dialogElementContainer;
    this.modalFooterContainer = dialogFooterContainer;
    this.name = name;
    this.onContainerClick = onContainerClick;
    this.init();
  }

  private init() {
    new Collapse(this.collapseButton, cardContent);
    this.initButtons();
    this.initInspector();

    this.container.onclick = () => {
      this.onContainerClick(this.container, this.name);
    };
  }

  initDND(name: string, handleZIndex: (container: HTMLElement, name: string) => void) {
    new DragAndDrop(this.container, this.sidebarDragHandle, name, handleZIndex);
  }

  private initInspector() {
    this.ui.inspector.onElementClick = (_e, data) => {
      const hoveredElement = this.ui.inspector.elements.targetElement;
      if (inspectorContainer.contains(hoveredElement)) return;
      if (data.success) this.openCaptureDialog(data.selector as string);
    };
  }

  private handleOpenEditModal(data: Step) {
    this.openCaptureDialog(data.target as string, data);
    this.saveButton.disabled = false;
  }

  private initButtons() {
    this.saveButton.disabled = true;
    this.resumeButton.disabled = true;
    this.startButton.onclick = () => {
      this.listTitle.value = '';
      this.resumeButton.disabled = true;
      this.saveButton.disabled = true;
      this.stepData = {};
      this.sidebarUl.innerHTML = '';
      this.openNameInputDialog();
    };
    this.saveButton.onclick = () => {
      this.save();
    };
    this.cardActions.appendChild(this.resumeButton);
    this.resumeButton.onclick = () => {
      this.resume();
    };
    this.listTitle.oninput = (e) => {
      const value = this.getInputValue(e);
      this.stepData.title = value;
      this.saveButton.disabled = value.length === 0;
    };
  }

  private openNameInputDialog() {
    this.clearModal();
    const { input: titleInput, inputLabel: titleInputLabel } = createInput({
      placeholder: 'Enter Flow Name',
      type: 'text',
      label: 'Flow Name',
      required: true
    });
    this.stepData.url = window?.location?.href || '';
    this.stepData._id = `${this.stepData._id || Date.now()}`;
    const { input: descriptionInput, inputLabel: descriptionInputLabel } = createInput({
      elementType: 'textarea',
      placeholder: 'Enter Flow Description',
      label: 'Flow Description',
      type: 'text'
    });
    const { input: urlInput, inputLabel: urlInputLabel } = createInput({
      placeholder: 'URL where the flow will execute',
      label: 'Flow URL',
      type: 'text',
      className: 'disabled',
      disabled: true,
      required: true,
      value: this.stepData.url
    });

    const startButton = createButton({ innerText: 'Start', className: 'btn-success', type: 'submit' });
    const cancelButton = createButton({
      innerText: 'Cancel',
      className: 'btn-error',
      type: 'button'
    });

    startButton.onclick = () => {
      if (!this.stepData.title || this.stepData.title?.length === 0 || this.stepData.url?.length === 0) return;
      this.started = true;
      this.closeModal();
      this.startButton.disabled = true;
      this.startCapturing();
    };
    cancelButton.onclick = () => {
      this.started = false;
      this.closeModal();
    };

    titleInput.oninput = (e) => {
      this.stepData.title = this.getInputValue(e);
      this.listTitle.value = this.stepData.title;
    };
    descriptionInput.oninput = (e) => {
      this.stepData.description = this.getInputValue(e);
    };
    urlInput.oninput = (e) => {
      this.stepData.url = this.getInputValue(e);
    };

    this.modalContentContainer.append(urlInputLabel, titleInputLabel, descriptionInputLabel);
    this.modalFooterContainer.append(cancelButton, startButton);
    this.modal.showModal();
  }

  private openCaptureDialog(selector: string, savedData?: Step) {
    this.resumeButton.innerText = 'Resume';
    this.clearModal();
    this.pause();
    let tempStep: Step = {
      title: savedData?.title ?? '',
      learned: false,
      description: savedData?.description ?? '',
      target: selector || '',
      _id: savedData?._id ?? `${Date.now()}`
    };

    const { input: titleInput, inputLabel: titleInputLabel } = createInput({
      placeholder: 'Enter Step Name',
      type: 'text',
      label: 'Step Name',
      required: true,
      value: savedData?.title || ''
    });
    const { input: descriptionInput, inputLabel: descriptionInputLabel } = createInput({
      elementType: 'textarea',
      placeholder: 'Enter Step Description',
      label: 'Step Description',
      type: 'text',
      value: savedData?.description || ''
    });
    const { input: targetInput, inputLabel: targetInputLabel } = createInput({
      placeholder: 'Step Target',
      label: 'Step Target',
      type: 'text',
      className: 'disabled',
      disabled: true,
      required: true,
      value: selector || ''
    });

    const pauseButton: HTMLButtonElement = createButton({
      innerText: 'Pause',
      className: 'btn-error mr-auto',
      type: 'button'
    });
    const nextButton = createButton({ innerText: 'Next', className: 'btn-success btn-outline', type: 'submit' });
    const finishButton = createButton({ innerText: 'Finish', className: 'btn-success', type: 'button' });
    const reCaptureButton = createButton({
      innerText: 'Re-Capture',
      className: 'btn-error  btn-outline',
      type: 'button'
    });

    titleInput.oninput = (e) => {
      tempStep.title = this.getInputValue(e);
    };
    descriptionInput.oninput = (e) => {
      tempStep.description = this.getInputValue(e);
    };
    targetInput.oninput = (e) => {
      tempStep.target = this.getInputValue(e);
    };

    reCaptureButton.onclick = () => {
      this.resume();
      this.clearModal();
      this.closeModal();
    };
    nextButton.onclick = () => {
      if (!tempStep.title || tempStep.title?.length === 0) return;
      this.stepData.steps = this.stepData.steps || [];
      this.stepData.steps.push(tempStep);
      this.resume();
      this.clearModal();
      this.closeModal();
      this.addListItem(tempStep);
    };
    pauseButton.onclick = () => {
      this.pause();
      this.resumeButton.disabled = false;
    };

    finishButton.onclick = () => {
      if (tempStep.title && tempStep.title?.length > 0) {
        this.stepData.steps = this.stepData.steps || [];
        this.stepData.steps.push(tempStep);
        this.addListItem(tempStep);
      }
      this.pause();
      this.startButton.disabled = false;
      this.resumeButton.disabled = false;
    };

    if (savedData) {
      const submitButton: HTMLButtonElement = createButton({
        innerText: 'Update',
        className: 'btn-success',
        type: 'button'
      });
      const cancelButton: HTMLButtonElement = createButton({
        innerText: 'Cancel',
        className: 'btn-error ml-auto',
        type: 'button'
      });
      cancelButton.onclick = () => {
        this.closeModal();
        this.clearModal();
      };
      submitButton.onclick = () => {
        if (!tempStep.title || tempStep.title?.length === 0) return;
        this.closeModal();
        this.clearModal();
        this.updateStepContent(tempStep);
      };
      this.modalFooterContainer.append(cancelButton, submitButton);
    } else {
      if (this.stepData.steps && this.stepData.steps?.length > 0) {
        this.modalFooterContainer.append(finishButton);
        this.saveButton.disabled = false;
      }
      this.modalFooterContainer.append(pauseButton);
      this.modalFooterContainer.append(reCaptureButton, nextButton);
    }
    this.modalContentContainer.append(targetInputLabel, titleInputLabel, descriptionInputLabel);
    this.modal.showModal();
  }

  private updateStepContent(data: Step) {
    const index = this.stepData.steps?.findIndex((d) => d._id === data._id);
    if (index === undefined || index === -1) return;
    if (!this.stepData || !this.stepData.steps || !this.stepData.steps[index]) return;
    this.stepData.steps[index] = data;
    this.renderStepDataList(this.stepData as StepData);
  }

  private addListItem(step: Step) {
    const sidebarItem = createSidebaItem(step.title, step.description || '', this.sidebarUl);
    createElement(
      'button',
      {
        className:
          'btn btn-sm btn-error btn-outline !text-[var(--error)] btn-square border-[var(--inspector-border-color,gray)] hover:border-[var(--inspector-border-color,gray)]',
        innerHTML: deleteIcon,
        title: 'Delete Step',
        draggable: true,
        onclick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.saveButton.disabled = false;
          this.removeItemFromStepData(
            this.stepData.steps?.findIndex((d) => d._id === step._id),
            sidebarItem
          );
        }
      },
      sidebarItem
    );
    sidebarItem.onclick = () => {
      this.handleOpenEditModal(step);
    };
  }
  renderStepDataList(data: StepData) {
    if (!data || data.steps.length === 0) return;
    this.sidebarUl.innerHTML = '';
    this.listTitle.value = data.title;
    data.steps.forEach((step) => {
      this.addListItem(step);
    });
    this.stepData = data;
    this.resumeButton.disabled = false;
  }

  private removeItemFromStepData(index: number | undefined, sidebarItem: HTMLLIElement) {
    if (index === undefined || index === -1) return;
    this.sidebarUl.removeChild(sidebarItem);
    this.stepData.steps?.splice(index, 1);
    if (this.stepData.steps?.length === 0) {
      this.saveButton.disabled = true;
      this.stepData = {};
      this.listTitle.value = '';
      this.pause();
    }
  }

  pause() {
    this.closeModal();
    this.clearModal();
    this.ui.inspector.pause();
    this.paused = true;
    this.resumeButton.disabled = false;
  }
  resume() {
    this.resumeButton.disabled = true;
    this.paused = false;
    this.ui.inspector.resume();
  }

  private startCapturing() {
    this.started = true;
    this.ui.inspector.startCapturing();
  }
  stopCapturing() {
    this.ui.inspector.stopCapturing();
    this.closeModal();
    this.clearModal();
    this.startButton.disabled = false;
  }

  private clearModal() {
    this.modalContentContainer.innerHTML = '';
    this.modalFooterContainer.innerHTML = '';
  }

  private closeModal() {
    this.modal.close();
    this.clearModal();
  }

  private getInputValue(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return '';
    return target.value || '';
  }

  private async save() {
    this.clearModal();
    this.closeModal();
    if (!this.ui.indexedDb.isDBReady) {
      alert('Database is not ready yet. Please try again later.');
      return;
    }
    try {
      if (!this.stepData._id) {
        alert('Something went wrong. Please try again later.');
        return;
      }
      const isDataPresent = await this.ui.indexedDb.getSingleItem(this.stepData._id as string);
      if (isDataPresent) {
        await this.ui.indexedDb.updateData(this.stepData._id as string, this.stepData as StepData);
      } else {
        await this.ui.indexedDb.addData(this.stepData as StepData);
      }
      await this.ui.savedStepUI.fetchData();
      console.log(this.stepData);
      this.stepData = {};
      this.listTitle.value = '';
      this.sidebarUl.innerHTML = '';
      this.saveButton.disabled = true;
      this.resumeButton.disabled = true;
    } catch (error) {
      console.error(error);
    }
  }
}
