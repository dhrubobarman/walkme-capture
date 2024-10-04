import { chevronDown, chevronUp } from '@/assets/svgs';

// int
// this.button.innerHTML = chevronUp;

// this.button.innerHTML = chevronDown;

export class Collapse {
  private button: HTMLElement;
  private container: HTMLElement;
  private isCollapsed: boolean = false;
  private animationDuration: number = 300;
  private padding: { top: number; bottom: number } = { top: 0, bottom: 0 };

  constructor(button: HTMLElement, container: HTMLElement, animationDuration: number = 300, defaultCollapse = false) {
    this.button = button;
    this.container = container;
    this.animationDuration = animationDuration;

    this.init();
    if (defaultCollapse) {
      this.collapse();
    }
  }

  private init() {
    const computedStyle = window.getComputedStyle(this.container);
    this.padding.top = Math.ceil(parseFloat(computedStyle.paddingTop));
    this.padding.bottom = Math.ceil(parseFloat(computedStyle.paddingBottom));
    this.button.innerHTML = chevronUp;
    this.button.addEventListener('click', () => this.toggleCollapse());
  }

  private toggleCollapse() {
    this.isCollapsed ? this.expand() : this.collapse();
  }

  private collapse() {
    this.isCollapsed = true;
    this.button.title = 'Expand';
    this.container.setAttribute(
      'style',
      `
      min-height: 0px !important; 
      padding-top: 0px; 
      padding-bottom: 0px; 
      overflow: hidden !important;
      `
    );

    const animation = this.container.animate([{ height: `${this.container.scrollHeight}px` }, { height: '0px' }], {
      duration: this.animationDuration,
      easing: 'ease',
      fill: 'forwards'
    });
    animation.onfinish = () => {
      this.container.setAttribute('data-collapsed', `${this.isCollapsed}`);
      this.container.classList.remove('expanded');
      animation.cancel();
      this.container.setAttribute(
        'style',
        `
        height: 0px !important;
        min-height: 0px !important; 
        padding-top: 0px; 
        padding-bottom: 0px; 
        overflow: hidden !important;
        `
      );
    };

    this.button.innerHTML = chevronDown;
  }

  private expand() {
    this.isCollapsed = false;
    this.button.title = 'Collapse';
    const initialHeight = this.container.clientHeight;
    const targetHeight = this.container.scrollHeight + this.padding.top + this.padding.bottom;

    this.container.style.height = `${initialHeight}px`;
    this.container.style.overflow = 'hidden';
    this.container.setAttribute('data-collapsed', `${this.isCollapsed}`);
    this.container.classList.add('expanded');

    // Animate to the target height
    const animation = this.container.animate([{ height: `${initialHeight}px` }, { height: `${targetHeight}px` }], {
      duration: this.animationDuration,
      easing: 'ease',
      fill: 'forwards'
    });
    animation.onfinish = () => {
      animation.cancel();
    };

    this.button.innerHTML = chevronUp;

    animation.onfinish = () => {
      animation.cancel();
      this.container.style.height = 'auto';
      this.container.style.overflow = '';
      this.container.style.minHeight = '';
      this.container.style.paddingTop = '';
      this.container.style.paddingBottom = '';
    };
  }
}
