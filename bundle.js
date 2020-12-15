(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

class Editor {
    // Метод для перетворення тексту файла в масив даних
    parseFile(file) {
        const dataArray = file.split(/\r?\n/);
        const data = dataArray.map(value => value.split(/\t/));
        const headers = data.slice(0, 1)[0];
        return { data: data.slice(1), headers };
    }

    // Метод для перетворення таблиці в текст
    tableToText(headers, rows) {
        let text = '';

        for (let i = 0; i < headers.length; i++) {
            const elem = headers[i];
            const cell = elem.innerHTML;
            text += (i === headers.length - 1) ? cell : cell + '\t';
        }
        text += '\n';

        for (let i = 0; i < rows.length; i++) {
            const elem = rows[i];
            const cellsOfRow = elem.children;
            for (let j = 0; j < cellsOfRow.length; j++) {
                const cell = cellsOfRow[j].innerHTML;
                text += (j === cellsOfRow.length - 1) ? cell : cell + '\t';
            }
            text += (i === rows.length - 1) ? '' : '\n';
        }
        return text;
    }

    // Метод для завантаження файла
    download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href',
            'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

module.exports = Editor;

},{}],2:[function(require,module,exports){

'use strict';

const Editor = require('./Editor');
const Table = require('./Table');

class Modal {
    constructor() {
    }

    createElem() {
        this.container = document.getElementById('modal-container');
        const elemModal = document.createElement('div');
        elemModal.classList.add('modal');
        elemModal.id = 'modal';
        this.container.append(elemModal);

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');
        elemModal.append(modalContent, modalFooter);

        const modalHeader = document.createElement('h4');
        modalHeader.innerHTML = this.headerText;

        const modalInput = document.createElement('input');
        modalInput.setAttribute('type', 'text');
        modalContent.append(modalHeader, modalInput);

        const { cancelBtn, saveBtn } = this.createBtn();
        modalFooter.append(cancelBtn, saveBtn);

        const modal = M.Modal.init(document.getElementById('modal'));
        modalInput.defaultValue = this.defaultValue;
    }

    createBtn() {
        const cancelBtn = document.createElement('a');
        cancelBtn.classList.add('modal-close', 'waves-effect', 'waves-green', 'btn-flat');
        cancelBtn.innerHTML = 'Cancel';

        // Обробник для кнопки CANCEL модального вінка
        cancelBtn.addEventListener('click', () => {
            this.container.innerHTML = '';
        });

        const saveBtn = document.createElement('a');
        saveBtn.classList.add('modal-close', 'waves-effect', 'waves-green', 'btn-flat');
        saveBtn.innerHTML = this.btnText;

        // Обробник для кнопки SAVE модального вінка
        saveBtn.addEventListener('click', this.FnForBtn);
        // Обробник для Enter
        document.addEventListener('keydown', event => {
            if (event.code === 'Enter') {
                this.FnForBtn();
                event.preventDefault();
            }
        });

        return { cancelBtn, saveBtn };
    }
    FnForBtn() {}
}

class ModalToSave extends Modal {
    constructor(defaultValue, argForFn) {
        super();
        this.headerText = 'Save as';
        this.btnText = 'Save';
        this.defaultValue = defaultValue;
        this.argForFn = argForFn;
    }

    FnForBtn() {
        const { filename, text, modalInput } = this.argForFn;
        return (filename, text, modalInput) => {
            const newFilename = modalInput || filename;
            Editor.download(newFilename, text);
        };
    }
}

class ModalToChange extends Modal {
    constructor(defaultValue, argForFn) {
        super();
        this.headerText = 'Change the cell';
        this.btnText = 'OK';
        this.defaultValue = defaultValue;
        this.argForFn = argForFn;
    }

    FnForBtn() {
        const { element, modalInput } = this.argForFn;
        return (element, modalInput) => {
            Table.previousElement = element;
            Table.previousValue = element.innerHTML;
            element.innerHTML = modalInput;
        };
    }
}

module.exports = { ModalToSave, ModalToChange, Table, Editor };

},{"./Editor":1,"./Table":3}],3:[function(require,module,exports){
'use strict';

class Table {

	static previousElement;
	static previousValue;

	// Створення таблиці
	constructor(name, data) {
		this.filename = name;

		this.elemTable = document.createElement('table');
		this.elemTable.classList.add('highlight');

		const tableContainer = document.getElementById('table_container');
		tableContainer.innerHTML = '';
		tableContainer.append(this.elemTable);

		this.elemHeader = document.createElement('thead');
		this.elemBody = document.createElement('tbody');
		this.elemTable.append(this.elemHeader, this.elemBody);
		this.createHeader(data.headers);
		this.createRow(data.data);
	}

	// Створення рядку заколовків таблиці
	createHeader(array) {
		const elemRow = document.createElement('tr');
		this.elemHeader.append(elemRow);

		array.map((value) => {
			const elemCell = document.createElement('th');
			elemCell.classList.add('sort');
			elemCell.innerHTML = value;
			elemRow.append(elemCell);
		});
	}

	// Створення рядків таблиці
	createRow(array) {
		for (let row of array) {
			const elemRow = document.createElement('tr');
			this.elemBody.append(elemRow);

			for (let i = 0; i < this.elemHeader.children[0].children.length; i++) {
				const elemCell = document.createElement('td');
				elemCell.classList.add('modal-trigger');
				elemCell.setAttribute("href", "#modal");
				elemCell.innerHTML = row[i] || '';
				elemCell.addEventListener('click', () => {
					const element = elemCell;
					const options = {
						argForFn: { element },
						defaultValue: element.innerHTML,
						headerText: 'Change the cell',
						btnText: 'OK',
						fnForBtn: ({ element, modalInput }) => {
							Table.previousElement = element;
							Table.previousValue = element.innerHTML;
							element.innerHTML = modalInput;
						}
					};
					this.openModal(options);
				});
				elemRow.append(elemCell);
			}
		}
	}

	// Сортування таблиці
	sortTableByColumn(column, asc = true) {
		const mod = asc ? 1 : -1; // Індитифікатор для сортування за прямим або оберненим порядком
		const rows = Array.from(this.elemBody.querySelectorAll("tr"));

		// Сортування кожного рядка
		const sortedRows = rows.sort((a, b) => {
			let aCol = a.querySelector(`td:nth-child(${column + 1})`).textContent;
			let bCol = b.querySelector(`td:nth-child(${column + 1})`).textContent;
			aCol = parseInt(aCol, 10) || aCol.trim();
			bCol = parseInt(bCol, 10) || bCol.trim();
			return aCol > bCol ? (1 * mod) : (-1 * mod);
		});

		// Видалення всіх рядків таблиці і
		// додавання відсортованих рядків
		this.elemBody.innerHTML = '';
		this.elemBody.append(...sortedRows);

		// Позначеняя колонки за якою зараз відсортовані дані
		this.elemTable.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
		this.elemTable.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
		this.elemTable.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
	}

	// Створення модального вінка
	openModal(options) {
		const { argForFn, defaultValue, fnForBtn, headerText, btnText } = options;

		// Створення модального вінка та необхідних елементів для нього
		const container = document.getElementById('modal-container');
		const elemModal = document.createElement('div');
		elemModal.classList.add('modal');
		elemModal.id = 'modal';
		container.append(elemModal);

		const modalContent = document.createElement('div');
		modalContent.classList.add('modal-content');

		const modalFooter = document.createElement('div');
		modalFooter.classList.add('modal-footer');
		elemModal.append(modalContent, modalFooter);

		const modalHeader = document.createElement('h4');
		modalHeader.innerHTML = headerText;

		const modalInput = document.createElement('input');
		modalInput.setAttribute('type', 'text');
		modalContent.append(modalHeader, modalInput);

		const cancelBtn = document.createElement('a');
		cancelBtn.classList.add('modal-close', 'waves-effect', 'waves-green', 'btn-flat');
		cancelBtn.innerHTML = 'Cancel';

		const saveBtn = document.createElement('a');
		saveBtn.classList.add('modal-close', 'waves-effect', 'waves-green', 'btn-flat');
		saveBtn.innerHTML = btnText;
		modalFooter.append(cancelBtn, saveBtn);

		const modal = M.Modal.init(document.getElementById('modal'));
		modalInput.defaultValue = defaultValue;

		// Обробник для кнопки CANCEL модального вінка
		cancelBtn.addEventListener('click', () => {
			container.innerHTML = '';
		});

		// Обробник для кнопки SAVE модального вінка
		const saveFn = () => {
			argForFn.modalInput = modalInput.value;
			fnForBtn(argForFn);
			container.innerHTML = '';
		};
		saveBtn.addEventListener('click', saveFn);
		// Обробник для Enter
		document.addEventListener("keydown", function(event) {
			if (event.code === "Enter") {
				saveFn();
			  	event.preventDefault();
			}
		});
	}
}

module.exports = Table;

},{}],4:[function(require,module,exports){
'use strict';

const { ModalToSave, ModalToChange, Table, Editor } =  require('./Modal');

let newTable, newEditor;

const btnOpen = document.getElementById('myfile');
btnOpen.addEventListener('change', function() {
    readFile(this);
});

// Функція викликається при натисненні на кнопку OPEN, після вибору файлу
function readFile(input) {
    const file = input.files[0];
    const reader = new FileReader();

    // Читання файлу
    reader.readAsText(file);

    // Після завантаження файла, створюються екземпляри класів Editor i Table
    reader.onload = function() {
        newEditor = new Editor();
        const data = newEditor.parseFile(reader.result);
        newTable = new Table(file.name, data);

        // Обробник для сортавування даних в колонках
        document.querySelectorAll('.sort').forEach(headerCell => {
            headerCell.addEventListener('click', () => {
                const headerIndex = Array.prototype.indexOf.call(
                    headerCell.parentElement.children, headerCell);
                const currentIsAscending = headerCell.classList.contains('th-sort-asc');

                newTable.sortTableByColumn(headerIndex, !currentIsAscending);
            });
        });

        // Обробник для кнопки SAVE, збереження файлу
        const saveBtn = document.getElementById('save');
        saveBtn.addEventListener('click', () => {
            const headers = newTable.elemHeader.querySelectorAll('th');
            const rows = newTable.elemBody.querySelectorAll('tr');
            const text = newEditor.tableToText(headers, rows);
            const filename = newTable.filename;

            const options = {
                argForFn: { filename, text },
                defaultValue: filename,
                headerText: 'Save as',
                btnText: 'Save',
                fnForBtn: ({ filename, text, modalInput }) => {
                    const newFilename = modalInput || filename;
                    newEditor.download(newFilename, text);
                }
            };
            //newTable.openModal(options);
            const modal = new ModalToSave(filename, options.argForFn);
        }, false);

        // Обробник для кнопки UNDO, відміна останньої дії
        const undoBtn = document.getElementById('undo');
        const undoFn = function() {
            const element = Table.previousElement;
            element.innerHTML = Table.previousValue;
        };
        undoBtn.addEventListener('click', undoFn);
        // Обробник для відміни дії при натисканні Ctrl + Z
        document.addEventListener('keydown', event => {
            if (event.ctrlKey && event.code === 'KeyZ') {
                undoFn();
                event.preventDefault();
            }
        });
    };

    // Обробник для помилок, при читанні файлу
    reader.onerror = function() {
        console.log(reader.error);
    };
}

},{"./Modal":2}]},{},[4]);
