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
	 * @constructor
	 * @param {string} name - Name of file
	 * @param {object} data - Data of file
	 */
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
	/**
	 * Create a modal window
	 * @param {object} options - Object of params {argForFn, defaultValue, fnForBtn, headerText, btnText}
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
