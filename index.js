'use strict';

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
			let filename = newTable.filename;
			newEditor.download(filename, text);
		}, false);
		
		const undoBtn = document.getElementById('undo');
		undoBtn.addEventListener('click', function() {
			const element = prElement;
			element.innerHTML = prOldValue;
			console.log(element);
		});

  	};
  
    reader.onerror = function() {
      	console.log(reader.error);
    };
  
}
