/*!
 * @scoby/analytics-ts v4.0.0
 * (c) Scoby UG
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var got = require('got');
var buildUrl = require('build-url-ts');
var crypto = require('crypto');
var ipMatching = require('ip-matching');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var got__default = /*#__PURE__*/_interopDefaultLegacy(got);
var buildUrl__default = /*#__PURE__*/_interopDefaultLegacy(buildUrl);

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
        this.ipBlacklistPatterns = [];
        this.whitelistedUrlParameters = [
            'utm_medium',
            'utm_source',
            'utm_campaign',
            'utm_content',
            'utm_term',
        ];
        this.workspaceId = this.getWorkspaceId();
        this.apiHost = "https://".concat(this.workspaceId, ".s3y.io");
    }
    Client.prototype.hash = function (value) {
        var hmac = crypto.createHmac('sha256', this.salt);
        return hmac.update(Buffer.from(value, 'utf-8')).digest('hex');
    };
    Client.prototype.getVisitorId = function (pageView) {
        var visitorId = pageView.visitorId, ipAddress = pageView.ipAddress, userAgent = pageView.userAgent;
        if (visitorId) {
            return this.hash([visitorId, this.workspaceId].join('|'));
        }
        return this.hash([ipAddress, userAgent, this.workspaceId].join('|'));
    };
    Client.prototype.getWorkspaceId = function () {
        var parts = Buffer.from(this.apiKey, 'base64')
            .toString('ascii')
            .split('|');
        if (parts.length > 0) ;
        return parts[0];
    };
    Client.prototype.getRequestedUrl = function (requestedUrl) {
        var _this = this;
        var url = new URL(requestedUrl);
        var searchParams = url.searchParams;
        searchParams.forEach(function (_value, param) {
            if (!_this.whitelistedUrlParameters.includes(param)) {
                url.searchParams.delete(param);
            }
        });
        return url.toString();
    };
    Client.prototype.getReferringUrl = function (referringUrl) {
        var url = new URL(referringUrl);
        return "".concat(url.protocol, "//").concat(url.host);
    };
    Client.prototype.addWhitelistedUrlParameter = function (param) {
        this.whitelistedUrlParameters.push(param);
    };
    Client.prototype.logPageView = function (pageView) {
        return __awaiter(this, void 0, void 0, function () {
            var userAgent, requestedUrl, referringUrl, ipAddress, visitorSegments, queryParams, url, options, statusCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userAgent = pageView.userAgent, requestedUrl = pageView.requestedUrl, referringUrl = pageView.referringUrl, ipAddress = pageView.ipAddress, visitorSegments = pageView.visitorSegments;
                        if (this.isBlockedIp(ipAddress)) {
                            return [2 /*return*/, false];
                        }
                        queryParams = {
                            vid: this.getVisitorId(pageView),
                            ua: userAgent,
                            url: this.getRequestedUrl(requestedUrl),
                        };
                        if (referringUrl) {
                            queryParams['ref'] = this.getReferringUrl(referringUrl);
                        }
                        if (visitorSegments) {
                            queryParams['sg'] = visitorSegments.join(',');
                        }
                        url = buildUrl__default["default"](this.apiHost, {
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
                        return [4 /*yield*/, got__default["default"](url, options).catch(function (error) {
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
    Client.prototype.isBlockedIp = function (ipAddress) {
        for (var _i = 0, _a = this.ipBlacklistPatterns; _i < _a.length; _i++) {
            var pattern = _a[_i];
            if (ipMatching.matches(ipAddress, pattern))
                return true;
        }
        return false;
    };
    Client.prototype.blacklistIpRange = function (pattern) {
        this.ipBlacklistPatterns.push(pattern);
    };
    return Client;
}());

exports.Client = Client;
//# sourceMappingURL=index.js.map
