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
