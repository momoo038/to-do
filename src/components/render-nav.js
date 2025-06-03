import { domUtils } from "../utils/domUtils";

export default function renderNavLinks(nav, items){
    if (!nav) return;
    nav.innerHTML = "";
    items.forEach(itemData => {
        const link = domUtils.createElement("a", {
            classes: "nav-link",
            href: itemData.href,
            textContent: itemData.text,
            id: itemData.id
        })
        nav.appendChild(link);
    })
}