
class Table {
    constructor(name) {
      this.logs = [];
      this.filename = name;
      
      this.elemTable = document.createElement('table');
      this.elemTable.classList.add('highlight');
      this.elemTable.id = 'dataTable';
      const tableContainer = document.getElementById('table_container');
      tableContainer.innerHTML = '';
      tableContainer.appendChild(this.elemTable);
      
      this.elemHeader = document.createElement('thead');
      this.elemTable.appendChild(this.elemHeader); 
      this.elemBody = document.createElement('tbody');
      this.elemTable.appendChild(this.elemBody); 

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
        elemCell.classList.add('cell', 'modal-trigger');
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

}


