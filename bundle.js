(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

/**
 * Class representing a tool Editor
 */
class Editor {

    /**
     * Create editor
     * @param {string} name - Name of file
     */
    constructor(name) {
        this.filename = name;
    }

    // Метод для перетворення тексту файла в масив даних
    /**
     * Convert a file into two arrays: array of rows of the table
     * and array of the headers of the table
     * @param {string} file - file of data
     * @returns {object} Object with fields: data(rows) and headers
     */
    parseFile(file) {
        const dataArray = file.split(/\r?\n/);
        const data = dataArray.map(value => value.split(/\t/));
        const headers = data.slice(0, 1)[0];
        return { data: data.slice(1), headers };
    }

    // Метод для перетворення таблиці в текст
    /**
     * Convert a table from html to string with tabs for saving in the file
     * @param {object} headers - array of headers of the table
     * @param {object} rows - array of rows of the table
     * @returns {string} String containing table with tabs, ready to download
     */
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
    /**
     * Method for downloading the table
     * @param {string} filename - name of file to save
     * @param {string} text - file to save
     */
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

/**
 * Class representing a Table
 */
class Table {
	
	static previousElement;
	static previousValue;

	// Створення таблиці
	/**
	 * Create a table
	 * @param {object} data - Data of file
	 */
	constructor(data) {

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
	/**
	 * Create a header of table
	 * @param {object} array - Array of headers of the table
	 */
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
	/**
	 * Create rows of table
	 * @param {object} array - Array of rows
	 */
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
	/**
	 * Sort the table
	 * @param {int} column - Number of column, that is sorted
	 * @param {boolean} asc - Identifier for sorting in direct or reverse order
	 */
	sortTableByColumn(column, asc = true) {
		const mod = asc ? 1 : -1; // Індетифікатор для сортування за прямим або оберненим порядком
		const rows = Array.from(this.elemBody.querySelectorAll("tr"));

		// Сортування кожного рядка
		const sortedRows = rows.sort((a, b) => {
			let aCol = a.querySelector(`td:nth-child(${column + 1})`).textContent;
			let bCol = b.querySelector(`td:nth-child(${column + 1})`).textContent;
			aCol = parseInt(aCol, 10) || aCol.trim();
			bCol = parseInt(bCol, 10) || bCol.trim();
			if (typeof aCol !== typeof bCol) {
				if (typeof aColl === 'int') return (-1 * mod);
				else return (1 * mod);
			}
			else if (aCol > bCol) return (1 * mod);
			else return (-1 * mod);
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
	/**
	 * Create a modal window
	 * @param {object} options - Object with fields: {argForFn, defaultValue, fnForBtn, headerText, btnText}
	 */
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
		// Обробник для Enter і Escape
		document.addEventListener('keyup', function(event) {
			if (event.key === 'Enter') {
				saveFn();
			  	event.preventDefault();
			}
			if (event.key === 'Escape') {
				container.innerHTML = '';
				event.preventDefault();
			}
		});
	}
}

module.exports = Table;

},{}],3:[function(require,module,exports){
'use strict';

const Editor = require('./Editor.js');
const Table = require('./Table.js');

let newTable, newEditor;

const btnOpen = document.getElementById('myfile');
btnOpen.addEventListener('change', function() {
    readFile(this);
});

// Функція викликається при натисненні на кнопку OPEN, після вибору файлу
/**
 * Start function of app, execute all main operation with file
 * @param {pbject} input - html object - selected file to work with
 */
function readFile(input) {
    const file = input.files[0];
    const reader = new FileReader();

    // Читання файлу
    reader.readAsText(file);

    // Після завантаження файла, створюються екземпляри класів Editor i Table
    reader.onload = function() {
        newEditor = new Editor(file.name);
        const data = newEditor.parseFile(reader.result);
        newTable = new Table(data);

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
            const filename = newEditor.filename;

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
            newTable.openModal(options);
        });

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

},{"./Editor.js":1,"./Table.js":2}]},{},[3]);
