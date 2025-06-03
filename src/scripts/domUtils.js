function createElement(
  tag,
  { classes, textContent, src, href, target, rel, id, children, listeners } = {}
) {
  const element = document.createElement(tag);

  if (classes) {
    if (Array.isArray(classes)) {
      element.classList.add(...classes);
    } else {
      element.classList.add(classes);
    }
  }

  if (textContent) element.textContent = textContent;
  if (src) element.src = src;
  if (href) element.href = href;
  if (target) element.target = target;
  if (rel) element.rel = rel;
  if (id) element.id = id;

  if (listeners) {
    for (const eventType in listeners) {
      if (Object.prototype.hasOwnProperty.call(listeners, eventType)) {
        const listenerFunction = listeners[eventType];
        if (typeof listenerFunction === 'function') {
          element.addEventListener(eventType, listenerFunction);
        } else {
          console.warn(`Listener for event "${eventType}" is not a function.`);
        }
      }
    }
  }

  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child) {
          element.appendChild(child);
        }
      });
    } else if (children) {
      element.appendChild(children);
    }
  }

  return element;
}
// EXAMPLES
// const homePageTitle = createElement("h1", { textContent: "Craving for a delicious Kebab?" });
// const homePageImage = createElement("img", { classes: "homePageImage", src: mainImage });
// const gridDiv = createElement("div", { classes: "grid", children: [createElement("div"), createElement("div") . . .)]})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createImage(src, alt, { classes, id, width, height } = {}) {
  if (!src) {
    console.error('createImage: "src" attribute is required.');
    return null;
  }
  if (alt === undefined || alt === null) {
    console.warn(
      'createImage: "alt" attribute is highly recommended for accessibility. Provide an empty string for decorative images if appropriate.'
    );
  }

  const imgElement = createElement("img", { src, classes, id });

  if (width) imgElement.width = parseInt(width, 10);
  if (height) imgElement.height = parseInt(height, 10);

  return imgElement;
}
// EXAMPLES
// const companyLogo = createImage('images/logo.png', 'Company Logo');
// const promoBanner = createImage('banners/promo.jpg', 'Special Promotion', { classes: ['banner', 'promo-banner', 'large-image'] });
// const heroImage = createImage('assets/main-visual.webp', 'Website main visual', { id: 'heroImage' });
// const smallAvatar = createImage('avatars/user123.png', 'Avatar for user123', { width: '50', height: '50' });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const domUtils = {
  createElement,
  createImage,
};