'use strict';

class Editor {
    parseFile(file) {
        const dataArray = file.split(/\r?\n/);
        const data = dataArray.map((value) => value.split(','));
        const headers = data.slice(0, 1)[0];
        return { data: data.slice(1), headers };
    }

    tableToText(headers, rows) {
        let text = '';
        
        for (let i = 0; i < headers.length; i++) {
			const elem = headers[i];
			const cell = elem.innerHTML;
			text += (i == headers.length-1) ? cell : cell + ',';
        }
        text += '\n';
      
        for (let i = 0; i < rows.length; i++) {
			const elem = rows[i];
			const cellsOfRow = elem.children;
			for (let j = 0; j < cellsOfRow.length; j++) {
				const cell = cellsOfRow[j].innerHTML;
				text += (j == cellsOfRow.length-1) ? cell : cell + ',';
			}
			text += (i == rows.length-1) ? '' : '\n';
        }
        return text;
	}
	

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
