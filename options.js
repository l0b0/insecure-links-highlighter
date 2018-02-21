/*
Copyright 2018 Victor Engmark

This file is part of Insecure Links Highlighter.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function saveOptions(event) {
    event.preventDefault();
    browser.storage.local.set({
        borderColor: document.querySelector("#borderColor").value
    });
}

function restoreOptions() {
    browser.storage.local
        .get()
        .then(setOptions, onError);

    function setOptions(options) {
        options = Object.assign({}, defaultOptions, options);
        document.querySelector("#borderColor").value = options.borderColor;
    }

    function onError(error) {
        throw error;
    }
}

function setDefaultsAndRestoreOptions() {
    browser.storage.local.set(defaultOptions);
    restoreOptions();
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", setDefaultsAndRestoreOptions);
