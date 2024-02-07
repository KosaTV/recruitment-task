export async function fetchData(url, options = {method: "GET", headers: {"Content-Type": "application/json"}}) {
	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error("Couldn't get response, when fetching data");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

export function debounce(func, delay) {
	let timeoutId;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timeoutId);
		return new Promise((resolve, reject) => {
			timeoutId = setTimeout(async () => {
				try {
					resolve(await func.apply(context, args));
				} catch (error) {
					reject(error);
				}
			}, delay);
		});
	};
}
