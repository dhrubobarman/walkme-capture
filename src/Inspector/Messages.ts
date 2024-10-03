import { Inspector } from './';
import { Elements } from './Elements';

export class Messages {
  inspector: Inspector;
  countdownInSeconds: number;
  elements: Elements;
  countDown: number;
  messageContainer: HTMLDivElement;
  counterElement: HTMLHeadingElement;
  interval!: NodeJS.Timeout;
  timeout!: NodeJS.Timeout;
  isChildPresent: boolean = false;
  messageElement: HTMLParagraphElement;
  startMessage: string;

  constructor(inspector: Inspector, elements: Elements, countdownInSeconds: number = 3, startMessage = '') {
    this.inspector = inspector;
    this.countdownInSeconds = countdownInSeconds;
    this.countDown = countdownInSeconds;
    this.elements = elements;
    this.messageContainer = elements.createElement('div');
    this.counterElement = elements.createElement('h2');
    this.messageElement = elements.createElement('p', { innerText: 'To exit the inspector tool at any time, simply press the Esc key.' });
    this.startMessage = startMessage;
    this.init();
  }
  init() {
    this.messageContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.5);
      max-width: 100vw;
      backdrop-filter: blur(10px);
      padding: 50px;
      border-radius: 10px;
      text-align: center;
    `;
    this.counterElement.style.cssText = `
      font-size: 24px;
      font-weight: bold;
      color: white;
    `;
    this.messageElement.style.cssText = `
      max-width: 300px;
      margin: 15px auto;
      font-size: 18px;
    `;
    const userMessageElement = this.elements.createElement('span', { innerText: this.startMessage });
    this.messageElement.appendChild(userMessageElement);
    this.messageContainer.appendChild(this.counterElement);
    this.messageContainer.appendChild(this.messageElement);
  }

  clear() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
    this.countDown = this.countdownInSeconds;
    if (this.isChildPresent) document.body.removeChild(this.messageContainer);
  }

  showCountdown(callback: () => void) {
    this.counterElement.textContent = this.countDown.toString();
    document.body.appendChild(this.messageContainer);

    this.isChildPresent = true;
    this.interval = setInterval(() => {
      this.countDown--;
      this.counterElement.textContent = this.countDown.toString();
    }, 1000);
    this.timeout = setTimeout(() => {
      document.body.removeChild(this.messageContainer);
      this.isChildPresent = false;
      this.countDown = this.countdownInSeconds;
      callback();
    }, this.countdownInSeconds * 1000);
  }
}
