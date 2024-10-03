import { createElement } from '@/utils/createElement';
import { dragHandle } from '@/assets/svgs';

export const inspectorContainer = createElement(
  'div',
  {
    className: 'capture-container',
    id: 'capture-container'
  },
  'body'
);

export const sidebar = createElement(
  'div',
  {
    className:
      'capture-sidebar max-h-[calc(100vh-200px)] shadow-lg card bg-base-300 fixed min-w-[300px] max-w-[300px] min-h-[50px] z-[9999] left-0 top-0 rounded-md border border-[var(--inspector-border-color,gray)]'
  },
  inspectorContainer
);

const sidebarHeader = createElement(
  'div',
  {
    className:
      'capture-sidebar-header bg-[var(--inpector-sidebar-header-bg)] rounded-t p-3 flex justify-between items-center border-b border-[var(--inspector-border-color,gray)]'
  },
  sidebar
);

const cardContent = createElement(
  'div',
  {
    className: 'card-content p-3'
  },
  sidebar
);

export const createHandle = (container: HTMLElement = sidebarHeader) => {
  return createElement(
    'button',
    {
      className: 'btn btn-sm btn-square cursor-grab border-[var(--inspector-border-color,gray)] hover:border-[var(--inspector-border-color,gray)]',
      innerHTML: dragHandle,
      title: 'Click and drag',
      draggable: true
    },
    container
  );
};

createElement(
  'span',
  {
    className: 'capture-sidebar-header-title text-[var(--inpector-sidebar-header-title-color)] text-[20px] font-semibold',
    innerText: 'Capture'
  },
  sidebarHeader
);

export const listTitle = createElement(
  'h6',
  {
    className:
      'capture-sidebar-header-title line-clamp-1 text-center text-[var(--inpector-sidebar-header-title-color)] text-[20px] font-semibold mb-3'
  },
  cardContent
);
export const sidebarUl = createElement(
  'ul',
  {
    className: 'capture-sidebar-content menu bg-base-200 rounded max-h-[calc(100vh-456px)] overflow-y-auto block'
  },
  cardContent
);

export const cardActions = createElement(
  'div',
  {
    className: 'card-actions justify-end mt-4'
  },
  cardContent
);

export const createButton = ({
  innerText,
  className = 'btn-neutral',
  container = false,
  ...rest
}: {
  innerText: string;
  className?: string;
  container?: false | HTMLElement;
} & Partial<HTMLButtonElement>) =>
  createElement(
    'button',
    {
      className: `btn ${className} btn-sm`,
      innerText,
      ...rest
    },
    container
  );
export const createInput = ({
  elementType = 'input',
  type,
  placeholder,
  className = '',
  container = false,
  required = false,
  label = '',
  ...rest
}: {
  elementType?: 'input' | 'textarea';
  type: string;
  placeholder: string;
  className?: string;
  container?: false | HTMLElement;
  label?: string;
} & Partial<HTMLInputElement | HTMLTextAreaElement>) => {
  const inputLabel = createElement(
    'label',
    {
      className: 'form-control w-full',
      innerHTML: ` 
      <div class="label">
        <span class="label-text">${label}${required ? '*' : ''}</span>
      </div>`
    },
    container
  );

  const input = createElement(
    elementType,
    {
      className: `inspector-input ${elementType === 'input' ? 'input input-bordered w-full ' : 'textarea textarea-bordered w-full '} ${className}`,
      ...(elementType === 'input' ? { type } : { rows: 3 }),
      placeholder,
      required,
      ...rest
    },
    inputLabel
  );
  return { inputLabel, input };
};
export const startButton = createButton({ innerText: 'Start', container: cardActions });
export const exportButton = createButton({ innerText: 'Export', container: cardActions, className: 'mr-auto ' });

export const createSidebaItem = (head: string, body?: string, parentContainer: false | HTMLElement = false) => {
  const sidebarContent = createElement(
    'li',
    {
      className: 'capture-sidebar-item',
      innerHTML: `
      <a class="block">
      <h6 class="text-lg">${head}</h6>
      <p class="text-sm">${body}</p>
      </a>`
    },
    parentContainer
  );
  return sidebarContent;
};

export const modal = createElement(
  'dialog',
  {
    className: 'modal',
    id: 'capture-modal'
  },
  inspectorContainer
);
const dialogCard = createElement(
  'form',
  {
    className: 'modal-box',
    id: 'capture-dialog-card',
    onsubmit: (e) => e.preventDefault()
  },
  modal
);

export const dialogElementContainer = createElement(
  'div',
  {
    className: 'capture-dialog-container space-y-3'
  },
  dialogCard
);

export const dialogFooterContainer = createElement(
  'div',
  {
    className: 'capture-dialog-container modal-action'
  },
  dialogCard
);
