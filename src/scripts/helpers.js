// Helper function for showing and hiding an element
const toggleElement = (el, display) => {
  const element = el;
  element.style.display = display;
};

// Helper function for creating elements
const createElement = (type, classList = []) => {
  const element = document.createElement(type);

  if (classList.length !== 0) element.classList.add(...classList);

  return element;
};

export { toggleElement, createElement };
