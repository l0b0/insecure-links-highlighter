/*
Copyright 2018 Victor Engmark

This file is part of Insecure Links Highlighter.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function saveOptions(event) {
    event.preventDefault();

    let borderColorElement = document.querySelector('#borderColor'),
        borderColor = borderColorElement.value,
        borderColorMessageElementId = 'borderColorMessage',
        messageElement = document.querySelector('#' + borderColorMessageElementId);

    if (messageElement !== null) {
        messageElement.remove();
    }
    if (!isValidColorString(borderColor)) {
        let messageElement = document.createElement('p'),
            message = browser.i18n.getMessage('invalidBorderColorMessage', borderColor),
            messageTextNode = document.createTextNode(message);
        messageElement.id = borderColorMessageElementId;
        messageElement.classList.add('error');
        messageElement.appendChild(messageTextNode);
        borderColorElement.parentElement.parentElement.insertAdjacentElement('afterend', messageElement);
        return;
    }

    browser.storage.local.set({
        borderColor: borderColor,
        elementsWithEventHandlersAreInsecure: document.querySelector('#elementsWithEventHandlersAreInsecure').checked,
    });
}

function restoreOptions() {
    browser.storage.local
        .get(defaultOptions)
        .then(setOptions, onError);

    function setOptions(options) {
        document.querySelector('#borderColor').value = options.borderColor;
        if (options.elementsWithEventHandlersAreInsecure) {
            document.querySelector('#elementsWithEventHandlersAreInsecure').setAttribute('checked', 'checked');
        }
    }

    function onError(error) {
        throw error;
    }
}

function setDefaultsAndRestoreOptions() {
    browser.storage.local.set(defaultOptions);
    restoreOptions();
}

function isValidColorString(color) {
    if (['', 'inherit', 'transparent'].includes(color)) {
        return false;
    }

    let imageElement = document.createElement('img');
    imageElement.style.color = 'rgb(0, 0, 0)';
    imageElement.style.color = color;
    if (imageElement.style.color !== 'rgb(0, 0, 0)') {
        return true;
    }
    imageElement.style.color = 'rgb(255, 255, 255)';
    imageElement.style.color = color;
    return imageElement.style.color !== 'rgb(255, 255, 255)';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector('form').addEventListener('reset', setDefaultsAndRestoreOptions);
