export class DragAndDrop {
  private container: HTMLElement;
  private handle: HTMLElement;
  private isDragging: boolean = false;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private shadowClass: string = '!shadow-2xl';

  constructor(container: HTMLElement, handle: HTMLElement) {
    this.container = container;
    this.handle = handle;

    this.handle.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    this.isDragging = true;
    this.offsetX = event.clientX - this.container.offsetLeft;
    this.offsetY = event.clientY - this.container.offsetTop;
    this.addElevationStyle();
  };

  private addElevationStyle() {
    this.container.style.transition = 'box-shadow 0.3s ease-in-out';
    this.container.classList.add('dragging', this.shadowClass);
    this.handle.classList.add('dragging', '!cursor-grabbing');
  }
  private removeElevationStyle() {
    this.container.classList.remove('dragging', this.shadowClass);
    this.handle.classList.remove('dragging', '!cursor-grabbing');
    this.container.style.transition = 'box-shadow 0.3s ease-in-out';
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.isDragging) {
      requestAnimationFrame(() => {
        this.container.style.left = `${event.clientX - this.offsetX}px`;
        this.container.style.top = `${event.clientY - this.offsetY}px`;
      });
    }
  };

  private onMouseUp = () => {
    this.isDragging = false;
    this.removeElevationStyle();
  };
}
