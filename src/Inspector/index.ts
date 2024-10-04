import { UI } from '@/Inspector/UI';
import { Elements } from './Elements';
import { Messages } from './Messages';
import { ElementData, InspectorProps } from './types';

export class Inspector {
  isInspecting: boolean;
  private boundKeydown!: (e: KeyboardEvent) => void;
  private boundMousedown!: (e: MouseEvent) => void;
  private boundMouseOver!: (e: MouseEvent) => void;
  private boundContextMenu!: (e: MouseEvent) => void;
  elements: Elements;
  isListenerAttached: boolean;
  onElementClick?: (e: MouseEvent, data: ElementData) => void | undefined;
  updateFN?: (delta: number) => void | undefined;
  messages: Messages;
  ui: UI;

  constructor({
    onElementClick,
    update,
    startMessage = '',
    countdownTimeInSeconds = 3,
    highlightColor = 'rgba(0,0,255,0.3)',
    falseHighlightColor = 'rgba(255, 0, 0, 0.3)'
  }: InspectorProps) {
    this.isListenerAttached = false;
    this.isInspecting = false;
    this.elements = new Elements(this, highlightColor, falseHighlightColor);
    this.onElementClick = onElementClick;
    this.updateFN = update;
    this.messages = new Messages(this, this.elements, countdownTimeInSeconds, startMessage);
    this.ui = new UI(this);
  }

  private addEventListeners() {
    if (this.isListenerAttached) return;
    this.isListenerAttached = true;
    this.boundKeydown = this.handleKeydown.bind(this);
    this.boundMousedown = this.handleMouseDown.bind(this);
    this.boundMouseOver = this.handleMouseOver.bind(this);
    this.boundContextMenu = this.handleContextMenu.bind(this);

    document.addEventListener('keydown', this.boundKeydown);
    document.addEventListener('mousedown', this.boundMousedown);
    document.addEventListener('mouseover', this.boundMouseOver);
    document.addEventListener('contextmenu', this.boundContextMenu);
  }

  removeEventListeners() {
    if (!this.isListenerAttached) return;
    this.isListenerAttached = false;
    document.removeEventListener('keydown', this.boundKeydown);
    document.removeEventListener('mousedown', this.boundMousedown);
    document.removeEventListener('mouseover', this.boundMouseOver);
    document.removeEventListener('contextmenu', this.boundContextMenu);
  }

  private handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.stopCapturing();
    }

    if (e.key === 'ḍ' && e.altKey && e.ctrlKey) {
      if (!this.isInspecting) {
        this.startCapturing();
      } else {
        this.stopCapturing();
      }
    }
  }

  private handleMouseDown(e: MouseEvent) {
    if (this.isInspecting) {
      e.preventDefault();
      e.stopPropagation();
      if (this.onElementClick && typeof this.onElementClick === 'function') this.onElementClick(e, this.elements.targetElementData);
    }
  }

  private handleMouseOver(e: MouseEvent) {
    if (!this.isInspecting) return;
    const target = e.target as HTMLElement;
    this.elements.targetElement = target;
  }

  private handleContextMenu(e: MouseEvent) {
    if (this.isInspecting) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  pause() {
    this.stopCapturing();
  }
  resume() {
    this.addEventListeners();
    this.isInspecting = true;
    this.elements.addElementToDom();
    requestAnimationFrame((delta) => this.animate(delta));
  }

  stopCapturing() {
    this.elements.removeElementFromDom();
    this.isInspecting = false;
    this.removeEventListeners();
    this.messages.clear();
  }
  startCapturing() {
    const startFunction = () => {
      this.addEventListeners();
      this.isInspecting = true;
      this.elements.addElementToDom();
      window.requestAnimationFrame((delta) => this.animate(delta));
    };
    this.messages.showCountdown(startFunction);
  }

  private animate(delta: number) {
    if (!this.isInspecting) return;
    this.update(delta);
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }
  private update(delta: number) {
    this.elements.update();
    if (this.updateFN && typeof this.updateFN === 'function') this.updateFN(delta);
  }
  private render() {
    this.elements.render();
  }
}

export * from './types';
