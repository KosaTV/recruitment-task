import {fetchData} from "./helpers.js";

const CUSTOM_COMMANDS = {
	hello: {
		msg: "Hello :)"
	}
	//* INSERT YOUR OWN COMMANDS
};

const terminal = {
	window: document.getElementById("terminal"),
	msgBox: undefined,
	output: undefined,
	input: undefined,
	hintCnt: undefined,
	focusedHintElement: undefined,
	commands: {
		clear: {
			msg: "",
			cb: function () {
				terminal.msgBox.innerText = "";
			}
		},
		help: {
			msg: "",
			cb: function () {
				const commandList = Object.keys(terminal.commands).join("\n");
				terminal.appendMessage(`Available commands: \n\n${commandList}`, "terminal");
			}
		},
		double: {
			msg: "",
			cb: function (args) {
				const number = parseFloat(args);
				if (!isNaN(number)) {
					const result = number * 2;
					terminal.appendMessage(result, "terminal");
				} else {
					terminal.appendMessage("Invalid input. Please provide a valid number.", "terminal");
				}
			}
		},
		quote: {
			msg: "",
			cb: async function () {
				const API = `https://dummyjson.com/quotes/random`;
				const res = await fetchData(API);
				if (!res) return terminal.appendMessage("Couldn't execute command", "terminal");
				const quote = res.quote;
				const author = res.author;

				const formattedQuote = `${quote} - ${author}`;
				terminal.appendMessage(formattedQuote);
			}
		},
		...CUSTOM_COMMANDS
	},
	commandHistory: [],
	historyPosition: 0,
	initialize: function () {
		this.msgBox = this.window.querySelector(".msg-box");
		this.input = this.window.querySelector(".input-area__input");
		this.hintCnt = this.window.querySelector(".hint-cnt");
		this.output = this.window.querySelector(".output");
		this.input.addEventListener("keydown", this.handleInput.bind(this));
		this.input.addEventListener("input", this.getHints.bind(this));
		this.initLogin();
	},
	initLogin: function () {
		const loginDate = new Date();
		const formattedLoginDate = loginDate.toUTCString();
		this.appendMessage(`${formattedLoginDate}`, "Last login");
	},
	getHints: function () {
		const currentInput = this.input.value;
		const hints = Object.keys(this.commands).filter(command => command.includes(currentInput));
		this.hintCnt.innerHTML = "";
		if (currentInput) hints.forEach(hint => this.showHint(hint));
	},
	showHint: function (hint) {
		const span = document.createElement("span");
		span.classList.add("hint-cnt__hint");
		span.innerText = hint;
		this.hintCnt.appendChild(span);
	},
	scrollDown: function () {
		this.output.scrollTop = this.output.scrollHeight;
	},
	focusOnHint: function () {
		const hints = this.hintCnt.querySelectorAll(".hint-cnt__hint");
		if (hints.length === 0) return;

		let focusedHintIndex = -1;
		for (let i = 0; i < hints.length; i++) {
			if (hints[i].classList.contains("hint-cnt__hint--focused")) {
				focusedHintIndex = i;
				break;
			}
		}

		if (focusedHintIndex !== -1) {
			hints[focusedHintIndex].classList.remove("hint-cnt__hint--focused");
		}

		let nextIndex = focusedHintIndex + 1;
		if (nextIndex >= hints.length) {
			nextIndex = 0;
		}

		this.focusedHintElement = hints[nextIndex];
		hints[nextIndex].classList.add("hint-cnt__hint--focused");
	},
	focusOnHintBack: function () {
		const hints = this.hintCnt.querySelectorAll(".hint-cnt__hint");
		if (hints.length === 0) return;

		let focusedHintIndex = -1;
		for (let i = 0; i < hints.length; i++) {
			if (hints[i].classList.contains("hint-cnt__hint--focused")) {
				focusedHintIndex = i;
				break;
			}
		}

		if (focusedHintIndex !== -1) {
			hints[focusedHintIndex].classList.remove("hint-cnt__hint--focused");
		}

		let prevIndex = focusedHintIndex - 1;
		if (prevIndex < 0) {
			prevIndex = hints.length - 1;
		}

		this.focusedHintElement = hints[prevIndex];
		hints[prevIndex].classList.add("hint-cnt__hint--focused");
	},
	handleInput: function (event) {
		switch (event.key) {
			case "Enter":
				if (this.focusedHintElement) {
					this.input.value = this.focusedHintElement.textContent;
					this.focusedHintElement.classList.remove("hint-cnt__hint--focused");
					this.focusedHintElement = undefined;
				} else {
					const inputText = this.input.value.trim();
					const [command, ...args] = inputText.split(" ");
					this.hintCnt.innerHTML = "";
					this.commandHistory.unshift(this.input.value);
					this.historyPosition = -1;
					this.appendMessage(`${inputText}`, "you");
					this.executeCommand(command, args);
					this.scrollDown();
					this.input.value = "";
				}
				break;
			case "ArrowUp":
				if (this.historyPosition < this.commandHistory.length - 1) {
					this.historyPosition++;
					this.input.value = this.commandHistory[this.historyPosition];
				}
				this.hintCnt.innerHTML = "";
				break;
			case "ArrowDown":
				if (this.historyPosition >= 0) {
					this.historyPosition--;
					if (this.historyPosition >= 0) {
						this.input.value = this.commandHistory[this.historyPosition];
					} else {
						this.input.value = "";
					}
				}
				this.hintCnt.innerHTML = "";
				break;
			case "Tab":
				event.preventDefault();
				if (event.shiftKey) {
					this.focusOnHintBack();
				} else {
					this.focusOnHint();
				}
				break;
			default:
				break;
		}
	},
	executeCommand: function (command, args) {
		const commandObj = this.commands[command];
		if (commandObj) {
			if (commandObj.msg) this.appendMessage(commandObj.msg || "", "terminal");
			else if (commandObj.cb) {
				commandObj.cb(args);
			}
		} else {
			this.appendMessage(`Unknown command: ${command}`, "terminal");
		}
	},
	appendMessage: function (message, source = "terminal") {
		const formattedMessage = source ? `${source}: ${message}\n` : `${message}\n`;
		const logElement = document.createElement("span");
		logElement.innerText = formattedMessage;
		this.msgBox.appendChild(logElement);
		this.scrollDown();
	}
};

terminal.initialize();
