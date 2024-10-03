import { Inspector } from '@/Inspector';
import { StepData } from '@/Inspector/types';
import { DragAndDrop } from '@/Inspector/UI/DragAndDrop';
import {
  createButton,
  createHandle,
  createInput,
  createSidebaItem,
  dialogElementContainer,
  dialogFooterContainer,
  finishButton,
  modal,
  sidebar,
  startButton
} from '@/Inspector/UI/UIElements';

export class UI {
  inspector: Inspector;
  sidebar: HTMLDivElement;
  sidebarDragHandle: HTMLButtonElement;
  modal: HTMLDialogElement;
  startButton: HTMLButtonElement;
  finishButton: HTMLButtonElement;
  stepData: Partial<StepData> = {};
  modalFooterContainer: HTMLDivElement;
  started: boolean = false;
  modalContentContainer: HTMLDivElement;
  constructor(inspector: Inspector) {
    this.inspector = inspector;
    this.sidebar = sidebar;
    this.sidebarDragHandle = createHandle();
    this.modal = modal;
    this.startButton = startButton;
    this.finishButton = finishButton;
    this.modalContentContainer = dialogElementContainer;
    this.modalFooterContainer = dialogFooterContainer;
    this.initDND();
    this.initButtons();
  }

  initButtons() {
    this.startButton.onclick = () => {
      this.openStartCaptureDialog();
    };
  }

  openStartCaptureDialog() {
    const { input: titleInput, inputLabel: titleInputLabel } = createInput({ placeholder: 'Enter Flow Name', type: 'text', label: 'Flow Name' });
    this.stepData.url = window?.location?.href || '';
    const { input: descriptionInput, inputLabel: descriptionInputLabel } = createInput({
      inputType: 'input',
      placeholder: 'Enter Flow Description',
      label: 'Flow Description',
      type: 'text'
    });
    const { input: urlInput, inputLabel: urlInputLabel } = createInput({
      placeholder: 'URL where the flow will execute',
      label: 'Flow URL',
      type: 'text',
      value: this.stepData.url
    });

    const startButton = createButton({ innerText: 'Start' });
    const cancelButton = createButton({
      innerText: 'Cancel',
      className: 'btn-error'
    });

    startButton.onclick = () => {
      this.started = true;
      this.closeModal();
      this.startButton.disabled = true;
    };
    cancelButton.onclick = () => {
      this.started = false;
      this.closeModal();
    };

    titleInput.oninput = (e) => {
      this.stepData.title = this.getInputValue(e);
    };
    descriptionInput.oninput = (e) => {
      this.stepData.description = this.getInputValue(e);
    };
    urlInput.oninput = (e) => {
      this.stepData.url = this.getInputValue(e);
    };

    this.modalContentContainer.append(titleInputLabel, descriptionInputLabel, urlInputLabel);
    this.modalFooterContainer.append(startButton, cancelButton);
    this.modal.showModal();
  }

  closeModal() {
    this.modal.close();
    this.modalContentContainer.innerHTML = '';
    this.modalFooterContainer.innerHTML = '';
  }

  getInputValue(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return '';
    return target.value || '';
  }

  initDND() {
    new DragAndDrop(this.sidebar, this.sidebarDragHandle);
  }
}
