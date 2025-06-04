import { domUtils } from "../utils/domUtils";

export default function renderNavLinks(nav, items) {
    if (!nav) return;
    nav.innerHTML = "";

    items.forEach(itemData => {
        const linkChildren = [];

        if (itemData.icon) {
            const iconImageElement = domUtils.createImage(itemData.icon, "", {
                classes: "nav-icon" 
            });

            if (iconImageElement) { 
                linkChildren.push(iconImageElement);
                linkChildren.push(document.createTextNode(" "));
            }
        }

        linkChildren.push(document.createTextNode(itemData.text || ""));

        const link = domUtils.createElement("a", {
            classes: "nav-link",
            href: itemData.href,
            id: itemData.id,
            children: linkChildren
        });
        nav.appendChild(link);

        if (itemData.subCategories && itemData.subCategories.length > 0) {
            const subNavContainer = domUtils.createElement("div", {
                classes: "sub-nav-links"
            });

            itemData.subCategories.forEach(subItemData => {
                const subLinkChildren = [];

                if (subItemData.icon) {
                    const subIconImageElement = domUtils.createImage(subItemData.icon, "", {
                        classes: ["nav-icon", "sub-nav-icon"]
                    });

                    if (subIconImageElement) {
                        subLinkChildren.push(subIconImageElement);
                        subLinkChildren.push(document.createTextNode(" "));
                    }
                }

                subLinkChildren.push(document.createTextNode(subItemData.text || ""));

                const subLink = domUtils.createElement("a", {
                    classes: ["nav-link", "sub-nav-link"],
                    href: subItemData.href,
                    id: subItemData.id,
                    children: subLinkChildren
                });
                subNavContainer.appendChild(subLink);
            });
            nav.appendChild(subNavContainer);
        }
    });
}