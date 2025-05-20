// Helper function for creating elements
const createElement = (type, classList = []) => {
  const element = document.createElement(type);

  if (classList.length !== 0) element.classList.add(...classList);

  return element;
};

export default createElement;
