'use strict';

const Editor = require('./Editor.js');
const Table = require('./Table.js');

let newTable, newEditor;

const btnOpen = document.getElementById('myfile');
btnOpen.addEventListener('change', function() {
    readFile(this);
});

// Функція викликається при натисненні на кнопку OPEN, після вибору файлу
/**
 * Start function of app, execute all main operation with file
 * @param {object} input - html object - selected file to work with
 */
function readFile(input) {
    const file = input.files[0];
    const reader = new FileReader();

    // Читання файлу
    reader.readAsText(file);

    // Після завантаження файла, створюються екземпляри класів Editor i Table
    reader.onload = function() {
        newEditor = new Editor(file.name);
        const data = newEditor.parseFile(reader.result);
        newTable = new Table(data);

        // Обробник для сортавування даних в колонках
        document.querySelectorAll('.sort').forEach(headerCell => {
            headerCell.addEventListener('click', () => {
                const headerIndex = Array.prototype.indexOf.call(
                    headerCell.parentElement.children, headerCell);
                const currentIsAscending = headerCell.classList.contains('th-sort-asc');

                newTable.sortTableByColumn(headerIndex, !currentIsAscending);
            });
        });

        // Обробник для кнопки SAVE, збереження файлу
        const saveBtn = document.getElementById('save');
        saveBtn.addEventListener('click', () => {
            const headers = newTable.elemHeader.querySelectorAll('th');
            const rows = newTable.elemBody.querySelectorAll('tr');
            const text = newEditor.tableToText(headers, rows);
            const filename = newEditor.filename;

            const options = {
                argForFn: { filename, text },
                defaultValue: filename,
                headerText: 'Save as',
                btnText: 'Save',
                fnForBtn: ({ filename, text, modalInput }) => {
                    const newFilename = modalInput || filename;
                    newEditor.download(newFilename, text);
                }
            };
            newTable.openModal(options);
        });

        // Обробник для кнопки UNDO, відміна останньої дії
        const undoBtn = document.getElementById('undo');
        const undoFn = function() {
            const element = Table.previousElement;
            element.innerHTML = Table.previousValue;
        };
        undoBtn.addEventListener('click', undoFn);
        // Обробник для відміни дії при натисканні Ctrl + Z
        document.addEventListener('keydown', event => {
            if (event.ctrlKey && event.code === 'KeyZ') {
                undoFn();
                event.preventDefault();
            }
        });
    };

    // Обробник для помилок, при читанні файлу
    reader.onerror = function() {
        console.log(reader.error);
    };
}
