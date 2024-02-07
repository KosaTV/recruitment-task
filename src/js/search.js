import {fetchData, debounce} from "./helpers.js";

const input = document.querySelector(".search-wrapper__input");
const loadingElement = document.querySelector(".search-wrapper__icon--load-icon");
const searchHintCnt = document.querySelector(".search-hint-cnt");
let isSearchingStopped = false;

async function fetchProducts(searchValue) {
	if (!searchValue || isSearchingStopped) {
		return;
	}

	loadingElement.classList.add("search-wrapper__icon--loading");
	const productsAPI = `https://dummyjson.com/products/search?q=${searchValue}&limit=5&delay=1000`;
	const products = await fetchData(productsAPI);
	loadingElement.classList.remove("search-wrapper__icon--loading");
	return products;
}

const debouncedFetchProducts = debounce(fetchProducts, 700);

function createListItem(product) {
	const item = document.createElement("li");
	item.classList.add("search-hint-cnt-item");

	const {title, price} = product;
	const nameElement = document.createElement("span");
	nameElement.classList.add("search-hint-cnt-item__name");
	nameElement.textContent = `${title}`;

	const priceElement = document.createElement("span");
	priceElement.classList.add("search-hint-cnt-item__price");
	priceElement.textContent = `$${price}`;

	item.appendChild(nameElement);
	item.appendChild(priceElement);

	return item;
}

const setHintCnt = items => {
	if (!items.length) {
		return;
	}
	searchHintCnt.innerHTML = "";
	searchHintCnt.append(...items);
};

input.addEventListener("input", async ({target: {value: searchValue}}) => {
	if (!searchValue) {
		isSearchingStopped = true;
		searchHintCnt.innerHTML = "";
		return;
	}

	const products = await debouncedFetchProducts(searchValue);
	if (!products) {
		isSearchingStopped = false;
		return setHintCnt([]);
	}
	const productItems = products.products.map(createListItem);
	setHintCnt(productItems);
});
