export function createElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes?: Partial<HTMLElementTagNameMap[T]>,
  insertToApp: string | boolean | HTMLElement = true
): HTMLElementTagNameMap[T] {
  let element = document.createElement(tag);
  if (attributes) {
    Object.assign(element, attributes);
  }
  if (typeof insertToApp === 'string') {
    document.querySelector(insertToApp)?.appendChild(element);
  } else if (insertToApp === true) {
    document.querySelector('#app')?.appendChild(element);
  } else if (typeof insertToApp === 'object') {
    const container = insertToApp as HTMLElement;
    container.appendChild?.(element);
  }
  return element;
}
