import { Inspector } from './';
import { ElementData } from './types';

export class Elements {
  inspector: Inspector;
  hoverElement!: HTMLDivElement;
  isHoverElementAddedToDOM: boolean;
  targetElement!: HTMLElement;
  targetElementData!: ElementData;
  highlightColor: string;
  falseHighlightColor: string;

  constructor(inspector: Inspector, highlightColor: string, falseHighlightColor: string) {
    this.inspector = inspector;
    this.isHoverElementAddedToDOM = false;
    this.createHoverElement();
    this.highlightColor = highlightColor;
    this.falseHighlightColor = falseHighlightColor;
  }

  createHoverElement() {
    this.hoverElement = this.createElement('div', {
      className: 'inspector-hover-element border-2 border-red-500 fixed z-[1305]'
    });
    this.hoverElement.style.position = 'fixed';
    this.hoverElement.style.border = '1px solid red';
    this.hoverElement.style.pointerEvents = 'none';
    this.hoverElement.style.zIndex = '1305';
  }
  addElementToDom() {
    if (this.isHoverElementAddedToDOM) return;
    this.isHoverElementAddedToDOM = true;
    document.body.appendChild(this.hoverElement);
  }
  removeElementFromDom() {
    if (!this.isHoverElementAddedToDOM) return;
    this.isHoverElementAddedToDOM = false;
    document.body.removeChild(this.hoverElement);
  }

  getSelector(element: HTMLElement) {
    if (!element) return null;
    if (element.id) return '#' + element.id;
    const parent = element.parentElement;
    if (parent?.id) {
      return `#${parent.id}`;
    } else if (element.className) {
      const classSelector = `.${element?.className?.split?.(' ').join('.')}`;
      return this.escapeTailwindClassNames(classSelector);
    }
  }
  escapeTailwindClassNames(classNames: string): string {
    return classNames.replace(/[^a-zA-Z0-9-_.]/g, '\\$&');
  }

  getElementData(element: HTMLElement): ElementData | null {
    if (!element) return null;
    const tag = element.tagName.toLowerCase();
    const htmlBox = element.getBoundingClientRect();
    const selector = this.getSelector(element);
    const attributes = Array.from(element.attributes).reduce(
      (acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      },
      {} as Record<string, string>
    );
    return { tag, attributes, selector, htmlBox, element, success: true };
  }

  highlightElement() {
    let backgroundColor = this.highlightColor;
    if (this.targetElementData) {
      this.targetElementData.success = true;
      try {
        const virtualElement = this.getElementDataFromSelector(this.targetElementData.selector);
        if (!virtualElement || virtualElement?.element !== this.targetElement) {
          backgroundColor = this.falseHighlightColor;
          this.targetElementData.success = false;
        }
      } catch (e) {
        console.warn(e);
        this.targetElementData.success = false;
        backgroundColor = this.falseHighlightColor;
      }

      const style = getComputedStyle(this.targetElement);
      const borderRadius = style.getPropertyValue('border-radius');
      const { htmlBox } = this.targetElementData;
      this.hoverElement.style.borderRadius = borderRadius;
      this.hoverElement.style.left = htmlBox.left + 'px';
      this.hoverElement.style.top = htmlBox.top + 'px';
      this.hoverElement.style.width = htmlBox.width + 'px';
      this.hoverElement.style.height = htmlBox.height + 'px';
      this.hoverElement.style.backgroundColor = backgroundColor;
    }
  }

  getElementDataFromSelector(selectorQuery: string | undefined | null): ElementData | null {
    if (!selectorQuery) return null;
    const element = <HTMLElement>document.querySelector(selectorQuery);
    if (!element) return null;
    return this.getElementData(element);
  }

  createElement<T extends keyof HTMLElementTagNameMap>(tag: T, attributes?: Partial<HTMLElementTagNameMap[T]>): HTMLElementTagNameMap[T] {
    const element = document.createElement(tag);
    if (attributes) {
      Object.assign(element, attributes);
    }
    return element;
  }
  update() {
    if (!this.targetElement) return;
    const elementData = this.getElementData(this.targetElement);
    if (!elementData) return;
    this.targetElementData = elementData;
  }
  render() {
    this.highlightElement();
  }
}
