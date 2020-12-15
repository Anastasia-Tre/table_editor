
'use strict';

const Editor = require('./Editor');
const Table = require('./Table');

class Modal {
    constructor() {
    }

    createElem() {
        this.container = document.getElementById('modal-container');
        const elemModal = document.createElement('div');
        elemModal.classList.add('modal');
        elemModal.id = 'modal';
        this.container.append(elemModal);

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');
        elemModal.append(modalContent, modalFooter);

        const modalHeader = document.createElement('h4');
        modalHeader.innerHTML = this.headerText;

        const modalInput = document.createElement('input');
        modalInput.setAttribute('type', 'text');
        modalContent.append(modalHeader, modalInput);

        const { cancelBtn, saveBtn } = this.createBtn();
        modalFooter.append(cancelBtn, saveBtn);

        const modal = M.Modal.init(document.getElementById('modal'));
        modalInput.defaultValue = this.defaultValue;
    }

    createBtn() {
        const cancelBtn = document.createElement('a');
        cancelBtn.classList.add('modal-close', 'waves-effect', 'waves-green', 'btn-flat');
        cancelBtn.innerHTML = 'Cancel';

        // Обробник для кнопки CANCEL модального вінка
        cancelBtn.addEventListener('click', () => {
            this.container.innerHTML = '';
        });

        const saveBtn = document.createElement('a');
        saveBtn.classList.add('modal-close', 'waves-effect', 'waves-green', 'btn-flat');
        saveBtn.innerHTML = this.btnText;

        // Обробник для кнопки SAVE модального вінка
        saveBtn.addEventListener('click', this.FnForBtn);
        // Обробник для Enter
        document.addEventListener('keydown', event => {
            if (event.code === 'Enter') {
                this.FnForBtn();
                event.preventDefault();
            }
        });

        return { cancelBtn, saveBtn };
    }
    FnForBtn() {}
}

class ModalToSave extends Modal {
    constructor(defaultValue, argForFn) {
        super();
        this.headerText = 'Save as';
        this.btnText = 'Save';
        this.defaultValue = defaultValue;
        this.argForFn = argForFn;
    }

    FnForBtn() {
        const { filename, text, modalInput } = this.argForFn;
        return (filename, text, modalInput) => {
            const newFilename = modalInput || filename;
            Editor.download(newFilename, text);
        };
    }
}

class ModalToChange extends Modal {
    constructor(defaultValue, argForFn) {
        super();
        this.headerText = 'Change the cell';
        this.btnText = 'OK';
        this.defaultValue = defaultValue;
        this.argForFn = argForFn;
    }

    FnForBtn() {
        const { element, modalInput } = this.argForFn;
        return (element, modalInput) => {
            Table.previousElement = element;
            Table.previousValue = element.innerHTML;
            element.innerHTML = modalInput;
        };
    }
}

module.exports = { ModalToSave, ModalToChange, Table, Editor };
