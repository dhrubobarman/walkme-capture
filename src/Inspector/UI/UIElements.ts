import { createElement } from '@/utils/createElement';
import { dragHandle } from '@/assets/svgs';

export const inspectorContainer = createElement('div', {
  className: 'capture-container',
  id: 'capture-container'
});

export const sidebar = createElement(
  'div',
  {
    className: 'capture-sidebar shadow-lg card bg-base-300 shadow-xl fixed min-w-[300px] min-h-[50px] z-[9999] left-0 top-0 rounded-md'
  },
  inspectorContainer
);

const sidebarHeader = createElement(
  'div',
  {
    className: 'capture-sidebar-header bg-[var(--inpector-sidebar-header-bg)] rounded-t p-3 flex justify-between items-center'
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
      className: 'btn btn-sm btn-square cursor-grab',
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
    className: 'capture-sidebar-header-title text-[var(--inpector-sidebar-header-title-color)]',
    innerText: 'Capture'
  },
  sidebarHeader
);

export const sidebarUl = createElement(
  'ul',
  {
    className: 'capture-sidebar-content menu bg-base-200 rounded'
  },
  cardContent
);

const cardActions = createElement(
  'div',
  {
    className: 'card-actions justify-end mt-4'
  },
  cardContent
);

export const createButton = ({
  innerText,
  className = 'btn-neutral',
  container = false
}: {
  innerText: string;
  className?: string;
  container?: false | HTMLElement;
}) =>
  createElement(
    'button',
    {
      className: `btn ${className} btn-sm`,
      innerText
    },
    container
  );
export const createInput = ({
  inputType = 'input',
  type,
  placeholder,
  className = '',
  container = false,
  label = '',
  ...rest
}: {
  inputType?: 'input' | 'textarea';
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
        <span class="label-text">${label}</span>
      </div>`
    },
    container
  );

  const input = createElement(
    inputType,
    {
      className: `inspector-input ${inputType === 'input' ? 'input input-bordered w-full ' : 'textarea textarea-bordered w-full '} ${className}`,
      type,
      placeholder,
      ...rest
    },
    inputLabel
  );
  return { inputLabel, input };
};
export const startButton = createButton({ innerText: 'Start', container: cardActions });
export const finishButton = createButton({ innerText: 'Finish', className: 'btn-success', container: cardActions });

export const createSidebaItem = (innerHtml: string, parentContainer: false | HTMLElement = false) => {
  const sidebarContent = createElement(
    'li',
    {
      className: 'capture-sidebar-item',
      innerHTML: `<a>${innerHtml}</a>`
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
  'div',
  {
    className: 'modal-box',
    id: 'capture-dialog-card'
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
    className: 'capture-dialog-container modal-action',
    innerHTML: `
    <form method="dialog" class="modal-backdrop">
    <button>close</button>
    </form>
    `
  },
  dialogCard
);
