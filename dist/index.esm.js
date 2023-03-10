/*!
 * @scoby/analytics-ts v0.1.10
 * (c) Scoby UG
 * Released under the MIT License.
 */

import got from 'got';
import buildUrl from 'build-url-ts';
import { createHmac } from 'crypto';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Client = /** @class */ (function () {
    function Client(apiKey, salt) {
        this.apiKey = apiKey;
        this.salt = salt;
        this.jarId = this.getJarId();
        this.apiHost = "https://".concat(this.jarId, ".s3y.io");
    }
    Client.prototype.hash = function (value) {
        var hmac = createHmac('sha256', this.salt);
        return hmac.update(Buffer.from(value, 'utf-8')).digest('hex');
    };
    Client.prototype.getVisitorId = function (pageView) {
        var visitorId = pageView.visitorId, ipAddress = pageView.ipAddress, userAgent = pageView.userAgent;
        if (visitorId) {
            return this.hash([visitorId, this.jarId].join('|'));
        }
        return this.hash([ipAddress, userAgent, this.jarId].join('|'));
    };
    Client.prototype.getJarId = function () {
        var buffer = new Buffer(this.apiKey, 'base64');
        var parts = buffer.toString('ascii').split('|');
        if (parts.length > 0) ;
        return parts[0];
    };
    Client.prototype.logPageView = function (pageView) {
        return __awaiter(this, void 0, void 0, function () {
            var userAgent, requestedUrl, referringUrl, queryParams, url, options, statusCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userAgent = pageView.userAgent, requestedUrl = pageView.requestedUrl, referringUrl = pageView.referringUrl;
                        queryParams = {
                            vid: this.getVisitorId(pageView),
                            ua: userAgent,
                            url: requestedUrl,
                        };
                        if (referringUrl) {
                            queryParams['ref'] = referringUrl;
                        }
                        url = buildUrl(this.apiHost, {
                            path: '/count',
                            queryParams: queryParams,
                        });
                        options = {
                            timeout: {
                                send: 5000,
                            },
                            headers: {
                                Authorization: "Bearer ".concat(this.apiKey),
                            },
                        };
                        return [4 /*yield*/, got(url, options).catch(function (error) {
                                throw new Error('failed to log page view' + error.message);
                            })];
                    case 1:
                        statusCode = (_a.sent()).statusCode;
                        if (statusCode === 204) {
                            return [2 /*return*/, true];
                        }
                        throw new Error('failed to log page view. Status code: ' + statusCode);
                }
            });
        });
    };
    return Client;
}());

export { Client };
//# sourceMappingURL=index.esm.js.map
