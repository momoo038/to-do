function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(options)) {
    switch (key) {
      case "classes":
        if (Array.isArray(value)) {
          element.classList.add(...value.filter(Boolean));
        } else if (value) {
          element.classList.add(value);
        }
        break;

      case "children":
        if (Array.isArray(value)) {
          value.forEach((child) => {
            if (child) {
              element.appendChild(child);
            }
          });
        } else if (value) {
          element.appendChild(value);
        }
        break;

      case "listeners":
        for (const eventType in value) {
          if (Object.prototype.hasOwnProperty.call(value, eventType)) {
            const listenerFunction = value[eventType];
            if (typeof listenerFunction === "function") {
              element.addEventListener(eventType, listenerFunction);
            }
          }
        }
        break;

      case "textContent":
        element.textContent = value;
        break;

      case "innerHTML":
        element.innerHTML = value;
        break;

      default:
        element.setAttribute(key, value);
        break;
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
