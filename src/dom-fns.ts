export const toggleClass = (element: HTMLElement, ...cls: string[]) => {
  element.classList.remove(...cls);

  // Force layout reflow
  void element.offsetWidth;

  element.classList.add(...cls);
};
