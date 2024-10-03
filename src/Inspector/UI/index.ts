import { Inspector } from '@/Inspector';
import { ElementData, Step, StepData } from '@/Inspector/types';
import { DragAndDrop } from '@/Inspector/UI/DragAndDrop';
import {
  createButton,
  createHandle,
  createInput,
  listTitle,
  createSidebaItem,
  cardActions,
  dialogElementContainer,
  dialogFooterContainer,
  sidebarUl,
  modal,
  sidebar,
  startButton,
  inspectorContainer,
  exportButton
} from '@/Inspector/UI/UIElements';
import { createElement } from '@/utils/createElement';

export class UI {
  inspector: Inspector;
  sidebar: HTMLDivElement;
  sidebarDragHandle: HTMLButtonElement;
  modal: HTMLDialogElement;
  startButton: HTMLButtonElement;
  stepData: Partial<StepData> = {};
  modalFooterContainer: HTMLDivElement;
  started: boolean = false;
  modalContentContainer: HTMLDivElement;
  private exportButton = exportButton;
  private sidebarUl: HTMLUListElement = sidebarUl;
  private resumeButton: HTMLButtonElement = createButton({
    innerText: 'Resume',
    className: 'btn-success',
    type: 'button'
  });
  listTitle = listTitle;
  cardActions: HTMLDivElement = cardActions;
  paused: boolean = false;
  constructor(inspector: Inspector) {
    this.inspector = inspector;
    this.sidebar = sidebar;
    this.sidebarDragHandle = createHandle();
    this.modal = modal;
    this.startButton = startButton;
    this.modalContentContainer = dialogElementContainer;
    this.modalFooterContainer = dialogFooterContainer;

    this.initDND();
    this.initButtons();
  }

  initButtons() {
    this.exportButton.disabled = true;
    this.resumeButton.disabled = true;
    this.startButton.onclick = () => {
      this.exportButton.disabled = true;
      this.stepData = {};
      this.sidebarUl.innerHTML = '';
      this.openNameInputDialog();
    };
    this.exportButton.onclick = () => {
      this.export();
    };
    this.cardActions.appendChild(this.resumeButton);
    this.resumeButton.onclick = () => {
      this.resume();
    };
  }

  openNameInputDialog() {
    this.clearModal();
    const { input: titleInput, inputLabel: titleInputLabel } = createInput({
      placeholder: 'Enter Flow Name',
      type: 'text',
      label: 'Flow Name',
      required: true
    });
    this.stepData.url = window?.location?.href || '';
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
      this.listTitle.innerText = this.stepData.title;
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

  openCaptureDialog(data: ElementData) {
    this.clearModal();
    this.pause();
    let tempStep: Step = {
      title: '',
      description: '',
      target: data.selector || '',
      id: Date.now()
    };
    const { input: titleInput, inputLabel: titleInputLabel } = createInput({
      placeholder: 'Enter Step Name',
      type: 'text',
      label: 'Step Name',
      required: true
    });
    const { input: descriptionInput, inputLabel: descriptionInputLabel } = createInput({
      elementType: 'textarea',
      placeholder: 'Enter Step Description',
      label: 'Step Description',
      type: 'text'
    });
    const { input: targetInput, inputLabel: targetInputLabel } = createInput({
      placeholder: 'Step Target',
      label: 'Step Target',
      type: 'text',
      className: 'disabled',
      disabled: true,
      required: true,
      value: data.selector || ''
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
      tempStep = {
        id: Date.now(),
        title: '',
        description: '',
        target: ''
      };
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
      this.closeModal();
      this.clearModal();
    };

    finishButton.onclick = () => {
      if (tempStep.title && tempStep.title?.length > 0) {
        this.stepData.steps = this.stepData.steps || [];
        this.stepData.steps.push(tempStep);
        this.addListItem(tempStep);
      }
      this.stopCapturing();
      this.resumeButton.disabled = true;
    };
    this.modalContentContainer.append(targetInputLabel, titleInputLabel, descriptionInputLabel);

    if (this.stepData.steps && this.stepData.steps?.length > 0) {
      this.modalFooterContainer.append(finishButton);
      this.exportButton.disabled = false;
    }
    this.modalFooterContainer.append(pauseButton);
    this.modalFooterContainer.append(reCaptureButton, nextButton);
    this.modal.showModal();
  }

  addListItem(step: Step) {
    const sidebarItem = createSidebaItem(step.title, step.description || '', this.sidebarUl);
    createElement(
      'button',
      {
        className: 'btn btn-sm btn-square border-[var(--inspector-border-color,gray)] hover:border-[var(--inspector-border-color,gray)]',
        innerHTML: 'x',
        title: 'Click and drag',
        draggable: true,
        onclick: () =>
          this.removeItemFromStepData(
            this.stepData.steps?.findIndex((d) => d.id === step.id),
            sidebarItem
          )
      },
      sidebarItem
    );
  }

  removeItemFromStepData(index: number | undefined, sidebarItem: HTMLLIElement) {
    if (index === undefined || index === -1) return;
    this.sidebarUl.removeChild(sidebarItem);
    this.stepData.steps?.splice(index, 1);
    if (this.stepData.steps?.length === 0) this.exportButton.disabled = true;
  }

  pause() {
    this.inspector.pause();
    this.paused = true;
    this.resumeButton.disabled = false;
  }
  resume() {
    this.resumeButton.disabled = true;
    this.paused = false;
    this.inspector.resume();
  }

  startCapturing() {
    this.inspector.startCapturing();
    this.inspector.onElementClick = (_e, data) => {
      const hoveredElement = this.inspector.elements.targetElement;
      if (inspectorContainer.contains(hoveredElement)) return;

      if (data.success) this.openCaptureDialog(data);
    };
  }
  stopCapturing() {
    this.inspector.stopCapturing();
    this.closeModal();
    this.clearModal();
    this.startButton.disabled = false;
  }

  clearModal() {
    this.modalContentContainer.innerHTML = '';
    this.modalFooterContainer.innerHTML = '';
  }

  closeModal() {
    this.modal.close();
    this.clearModal();
  }

  getInputValue(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return '';
    return target.value || '';
  }

  export() {
    console.log(this.stepData);
    this.clearModal();
    this.closeModal();
    const blob = new Blob([JSON.stringify(this.stepData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.stepData.title}.json`;
    a.click();
    console.log(this.stepData);
    URL.revokeObjectURL(url);
  }

  initDND() {
    new DragAndDrop(this.sidebar, this.sidebarDragHandle);
  }
}
