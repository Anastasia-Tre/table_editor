'use strict';

let newTable, newEditor;

// Функція викликається при натисненні на кнопку OPEN, після вибору файлу
function readFile(input) {
    let file = input.files[0];
	let reader = new FileReader();
	
	// Читання файлу
    reader.readAsText(file);
  
	// Після завантаження файла, створюються екземпляри класів Editor i Table
    reader.onload = function() {
		newEditor = new Editor();
		const data = newEditor.parseFile(reader.result);
		newTable = new Table(file.name, data);

		// Обробник для сортавування даних в колонках
		document.querySelectorAll(".sort").forEach(headerCell => {
		headerCell.addEventListener("click", () => {
				const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
				const currentIsAscending = headerCell.classList.contains("th-sort-asc");
			
				newTable.sortTableByColumn(headerIndex, !currentIsAscending);
			});
		});

		// Обробник для кнопки SAVE, збереження файлу
		const saveBtn = document.getElementById('save');
		saveBtn.addEventListener('click', function() {
			const headers = newTable.elemHeader.querySelectorAll("th");
			const rows = newTable.elemBody.querySelectorAll("tr");
			let text = newEditor.tableToText(headers, rows);
			let filename =  newTable.filename;
			openModal(filename, text);
		}, false);
		
		// Обробник для кнопки UNDO, відміна останньої дії
		const undoBtn = document.getElementById('undo');
		undoBtn.addEventListener('click', function() {
			const element = Table.previousElement;
			element.innerHTML = Table.previousValue;
		});

  	};
  
	// Обробник для помилок, при читанні файлу
    reader.onerror = function() {
      	console.log(reader.error);
    };
  
}


// Функція для відкриття модального вікна для вибору імені під яким зберегти файл
function openModal(filename, text) {
	let newFilename = '';

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
	modalHeader.innerHTML = 'Save as';

	const modalInput = document.createElement('input');
	modalInput.setAttribute('type', 'text');
	modalContent.append(modalHeader, modalInput);

	const cancelBtn = document.createElement('a');
	cancelBtn.classList.add('modal-close', 'waves-effect','waves-green', 'btn-flat');
	cancelBtn.innerHTML = 'Cancel';

	const saveBtn = document.createElement('a');
	saveBtn.classList.add('modal-close', 'waves-effect','waves-green', 'btn-flat');
	saveBtn.innerHTML = 'Save';
	modalFooter.append(cancelBtn, saveBtn);
	
	const modal = M.Modal.init(document.getElementById('modal'));
	modalInput.defaultValue = filename;
	
	// Обробник для кнопки CANCEL модального вінка
	// Знищує модальне вікно без збереження файлу 
	cancelBtn.addEventListener('click', () => {
		container.innerHTML = '';
	});

	// Обробник для кнопки SAVE модального вінка
	// Знищує модальне вікно та зберігає файл
	saveBtn.addEventListener('click', () => {
		newFilename = modalInput.value || filename;
		container.innerHTML = '';
		newEditor.download(newFilename, text);
	});

}