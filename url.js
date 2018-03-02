/*
Copyright 2018 Victor Engmark

This file is part of Insecure Links Highlighter.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function (exports) {
    'use strict';

    const protocolPrefixRegex = new RegExp('^[a-z]+://'),

        // Known secure protocols handled by the browser
        internalSecureProtocols = ['https'],

        // Presumed secure since they are handled externally (see network.protocol-handler.external.[protocol])
        externallyHandledProtocols = ['mailto', 'news', 'nntp', 'snews'],

        // Presumed secure, commonly handled by add-ons or externally
        expectedExternallyHandledProtocols = ['tel'],

        secureProtocols = [].concat(
            internalSecureProtocols,
            externallyHandledProtocols,
            expectedExternallyHandledProtocols
        );

    function isSecureURL(url, protocol) {
        const urlProtocol = url.split(':', 1)[0].toLowerCase();

        if (secureProtocols.includes(urlProtocol)) {
            return true;
        }

        return !hasExplicitProtocol(url) && (protocol === 'file:' || protocol === 'https:');
    }

    function hasExplicitProtocol(url) {
        return protocolPrefixRegex.test(url.toLowerCase());
    }

    exports.hasExplicitProtocol = hasExplicitProtocol;
    exports.isSecureURL = isSecureURL;
}(this));
