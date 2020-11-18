'use strict';

// добавить коментариев

let newTable, newEditor;


function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
  
    reader.onload = function() {
    	newEditor = new Editor();
		const data = newEditor.parseFile(reader.result);
		newTable = new Table(file.name, data);

		document.querySelectorAll(".sort").forEach(headerCell => {
		headerCell.addEventListener("click", () => {
				const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
				const currentIsAscending = headerCell.classList.contains("th-sort-asc");
			
				newTable.sortTableByColumn(headerIndex, !currentIsAscending);
			});
		});

		const saveBtn = document.getElementById('save');
		saveBtn.addEventListener('click', function() {
			const headers = newTable.elemHeader.querySelectorAll("th");
			const rows = newTable.elemBody.querySelectorAll("tr");
			let text = newEditor.tableToText(headers, rows);
			let filename =  newTable.filename;
			openModal(filename, text);
		}, false);
		
		const undoBtn = document.getElementById('undo');
		undoBtn.addEventListener('click', function() {
			const element = Table.previousElement;
			element.innerHTML = Table.previousValue;
		});

  	};
  
    reader.onerror = function() {
      	console.log(reader.error);
    };
  
}


function openModal(filename, text) {
	console.log('zaschol');
	let newFilename = '';
	const container = document.getElementById('modal-container');

	const elemModal = document.createElement('div');
	elemModal.classList.add('modal');
	elemModal.id = 'modal';
	container.appendChild(elemModal);
	const modalContent = document.createElement('div');
	modalContent.classList.add('modal-content');
	elemModal.appendChild(modalContent);
	const modalFooter = document.createElement('div');
	modalFooter.classList.add('modal-footer');
	elemModal.appendChild(modalFooter);

	const modalHeader = document.createElement('h4');
	modalHeader.innerHTML = 'Save as';
	modalContent.appendChild(modalHeader);
	const modalInput = document.createElement('input');
	modalInput.setAttribute('type', 'text');
	modalContent.appendChild(modalInput);

	const cancelBtn = document.createElement('a');
	cancelBtn.classList.add('modal-close', 'waves-effect','waves-green', 'btn-flat');
	cancelBtn.innerHTML = 'Cancel';
	modalFooter.appendChild(cancelBtn);
	const saveBtn = document.createElement('a');
	saveBtn.classList.add('modal-close', 'waves-effect','waves-green', 'btn-flat');
	saveBtn.innerHTML = 'Save';
	modalFooter.appendChild(saveBtn);
	
	const modal = M.Modal.init(document.getElementById('modal'));
	modalInput.defaultValue = filename;
	
	cancelBtn.addEventListener('click', () => {
		container.innerHTML = '';
	});
	saveBtn.addEventListener('click', () => {
		
		newFilename = modalInput.value || filename;
		container.innerHTML = '';
		newEditor.download(newFilename, text);
	});

}