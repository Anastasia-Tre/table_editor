'use strict';

class Table {
	
	static previousElement;
	static previousValue;

    constructor(name, data) {

		this.filename = name;
		
		this.elemTable = document.createElement('table');
		this.elemTable.classList.add('highlight');

		const tableContainer = document.getElementById('table_container');
		tableContainer.innerHTML = '';
		tableContainer.appendChild(this.elemTable);
		
		this.elemHeader = document.createElement('thead');
		this.elemTable.appendChild(this.elemHeader); 
		this.elemBody = document.createElement('tbody');
		this.elemTable.appendChild(this.elemBody); 

		this.createHeader(data.headers);
		this.createRow(data.data);
    }

    createHeader(array) {  
		const elemRow = document.createElement('tr');
		this.elemHeader.appendChild(elemRow);

		array.map( (value) => {
		const elemCell = document.createElement('th');
		elemCell.classList.add('sort');
			elemCell.innerHTML = value;
			elemRow.appendChild(elemCell);
		});    
    }

    createRow(array) {
		for (let row of array) {
			const elemRow = document.createElement('tr');
			this.elemBody.appendChild(elemRow);
			

			for (let i = 0; i < this.elemHeader.children[0].children.length; i++) {
				const elemCell = document.createElement('td');
				elemCell.classList.add('modal-trigger');
				elemCell.addEventListener('click', this.openModal);
				elemCell.setAttribute("href", "#modal")
				elemCell.innerHTML = row[i] || '';
				elemRow.appendChild(elemCell);
			}
			
		}
    }

    sortTableByColumn(column, asc = true) {
        const dirModifier = asc ? 1 : -1;
        const rows = Array.from(this.elemBody.querySelectorAll("tr"));
        
      
        // Sort each row
        const sortedRows = rows.sort((a, b) => {
            let aCol = a.querySelector(`td:nth-child(${ column + 1 })`).textContent;
            let bCol = b.querySelector(`td:nth-child(${ column + 1 })`).textContent;
      
            aCol = parseInt(aCol) || aCol.trim();
            bCol = parseInt(bCol) || bCol.trim();
      
            return aCol > bCol ? (1 * dirModifier) : (-1 * dirModifier);
        });
      
        // Remove all existing TRs from the table
        while (this.elemBody.firstChild) {
            this.elemBody.removeChild(this.elemBody.firstChild);
        }
      
        // Re-add the newly sorted rows
        this.elemBody.append(...sortedRows);
      
        // Remember how the column is currently sorted
        this.elemTable.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
        this.elemTable.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
        this.elemTable.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
    }

    openModal(element) {

		const container = document.getElementById('modal-container');
		
		// переписать эту часть!
		const elemModal1 = `<div id="modal" class="modal">
				<div class="modal-content">
					<h4>Modal Header</h4>
					<input type="text" id="newText">
				</div>
				<div class="modal-footer">
					<a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>
					<a class="modal-close waves-effect waves-green btn-flat" id="ok">OK</a>
				</div>
				</div>`;

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
		modalHeader.innerHTML = 'Change the cell';
		modalContent.appendChild(modalHeader);
		const modalInput = document.createElement('input');
		modalInput.setAttribute('type', 'text');
		modalContent.appendChild(modalInput);

		const cancelBtn = document.createElement('a');
		cancelBtn.classList.add('modal-close', 'waves-effect','waves-green', 'btn-flat');
		// cancelBtn.setAttribute('href', '#!');
		cancelBtn.innerHTML = 'Cancel';
		modalFooter.appendChild(cancelBtn);
		const okBtn = document.createElement('a');
		okBtn.classList.add('modal-close', 'waves-effect','waves-green', 'btn-flat');
		okBtn.innerHTML = 'OK';
		modalFooter.appendChild(okBtn);
		
		//container.innerHTML = elemModal;
		const modal = M.Modal.init(document.getElementById('modal'));
		//const modal = M.Modal.init(elemModal);
		//const newText = document.getElementById('newText');
		modalInput.defaultValue = element.target.innerHTML;
		//const okBtn = document.getElementById('ok');

		cancelBtn.addEventListener('click', () => {
			container.innerHTML = '';
		});
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
