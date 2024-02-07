function positionSubMenuArrows(menu, menuItems) {
	const menuPosition = menu.getBoundingClientRect();
	menuItems.forEach(item => {
		const subMenuArrow = item.querySelector(".sub-menu__arrow");
		if (subMenuArrow) {
			const itemDetails = item.getBoundingClientRect();
			const arrowPosition = itemDetails.x - menuPosition.x;
			const arrowWidth = itemDetails.width;
			subMenuArrow.style.left = `${arrowPosition + arrowWidth / 2 - 30}px`;
		}
	});
}

function setupMenuEventListeners(menu, menuItems) {
	menu.addEventListener("mouseenter", () => {
		positionSubMenuArrows(menu, menuItems);
	});
}

function initializeMenu() {
	const menu = document.querySelector(".main-menu");
	const menuItems = document.querySelectorAll(".main-menu__item");
	setupMenuEventListeners(menu, menuItems);
}

initializeMenu();
