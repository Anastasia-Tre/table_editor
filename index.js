
let newTable, newEditor;


function openModal(element) {

  const container = document.getElementById('modal-container');

  const elemModal = `<div id="modal" class="modal">
          <div class="modal-content">
            <h4>Modal Header</h4>
            <input type="text" id="newText">
          </div>
          <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>
            <a class="modal-close waves-effect waves-green btn-flat" id="ok">OK</a>
          </div>
        </div>`

  container.innerHTML = elemModal;
  console.log(element);
  const modal = M.Modal.init(document.getElementById('modal'));
  const newText = document.getElementById('newText');
  newText.defaultValue = element.target.innerHTML;
  const okBtn = document.getElementById('ok');
  okBtn.addEventListener('click', () => {
    console.log(element.target.innerHTML , newText.value);
    element.target.innerHTML = newText.value;
    console.log('save');
    container.innerHTML = '';
  });
}



const saveBtn = document.getElementById('save');

saveBtn.addEventListener('click', function() {
  let text = newEditor.tableToText();
  let filename = newTable.filename;
  newEditor.download(filename, text);
}, false);


function readFile(input) {
    let file = input.files[0];
  
    let reader = new FileReader();
  
    reader.readAsText(file);
  
    reader.onload = function() {
    newEditor = new Editor();
		const data = newEditor.parseFile(reader.result);
		newTable = new Table(file.name);
		newTable.createHeader(data.headers);
    newTable.createRow(data.data);
    
    const cells = document.querySelectorAll('.cell');
    Array.from(cells).forEach(function(element) {
      element.addEventListener('click', openModal);
    });

    document.querySelectorAll(".sort").forEach(headerCell => {
      headerCell.addEventListener("click", () => {
          const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
          const currentIsAscending = headerCell.classList.contains("th-sort-asc");
    
          newTable.sortTableByColumn(headerIndex, !currentIsAscending);
      });
    });


  };
  
    reader.onerror = function() {
      	console.log(reader.error);
    };
  
}












