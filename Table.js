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

		array.map( (value) => {
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
				elemCell.addEventListener('click', this.openModal);
				elemCell.setAttribute("href", "#modal")
				elemCell.innerHTML = row[i] || '';
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
            let aCol = a.querySelector(`td:nth-child(${ column + 1 })`).textContent;
            let bCol = b.querySelector(`td:nth-child(${ column + 1 })`).textContent;
            aCol = parseInt(aCol) || aCol.trim();
            bCol = parseInt(bCol) || bCol.trim();
            return aCol > bCol ? (1 * mod) : (-1 * mod);
        });
      
		// Видалення всіх рядків таблиці і
		// додавання відсортованих рядків
		this.elemBody.innerHTML = '';
		this.elemBody.append(...sortedRows);
		
		// Позначеняя колонки за якою зараз відсортовані дані
        this.elemTable.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
        this.elemTable.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
        this.elemTable.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
    }

	// Створення модального вінка
    openModal(element) {
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
		modalHeader.innerHTML = 'Change the cell';

		const modalInput = document.createElement('input');
		modalInput.setAttribute('type', 'text');
		modalContent.append(modalHeader, modalInput);

		const cancelBtn = document.createElement('a');
		cancelBtn.classList.add('modal-close', 'waves-effect','waves-green', 'btn-flat');
		cancelBtn.innerHTML = 'Cancel';

		const okBtn = document.createElement('a');
		okBtn.classList.add('modal-close', 'waves-effect','waves-green', 'btn-flat');
		okBtn.innerHTML = 'OK';
		modalFooter.append(cancelBtn, okBtn);
		
		const modal = M.Modal.init(document.getElementById('modal'));
		modalInput.defaultValue = element.target.innerHTML;

		// Обробник для кнопки CANCEL модального вінка
		// Знищує модальне вікно без внесення змін в таблицю
		cancelBtn.addEventListener('click', () => {
			container.innerHTML = '';
		});

		// Обробник для кнопки SAVE модального вінка
		// Знищує модальне вікно та зберігає файл
		okBtn.addEventListener('click', () => {
			
			// тут this берется события, а не класса, поетому 
			// лучше использовать статические свойства метода
			// для реализации коректной работы
			// prElement = element.target;
			Table.previousElement = element.target;
			Table.previousValue = element.target.innerHTML;
			// prOldValue = element.target.innerHTML;

			element.target.innerHTML = modalInput.value;
			container.innerHTML = '';
		});
	  }
	  
}
