"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0xproject/utils");
/*
 * A version of the base class Subprovider found in providerEngine
 * This one has an async/await `emitPayloadAsync` and also defined types.
 * Altered version of: https://github.com/MetaMask/provider-engine/blob/master/subproviders/subprovider.js
 */
class Subprovider {
    // Ported from: https://github.com/MetaMask/provider-engine/blob/master/util/random-id.js
    static getRandomId() {
        const extraDigits = 3;
        // 13 time digits
        const datePart = new Date().getTime() * Math.pow(10, extraDigits);
        // 3 random digits
        const extraPart = Math.floor(Math.random() * Math.pow(10, extraDigits));
        // 16 digits
        return datePart + extraPart;
    }
    static createFinalPayload(payload) {
        const finalPayload = Object.assign({ 
            // defaults
            id: Subprovider.getRandomId(), jsonrpc: '2.0', params: [] }, payload);
        return finalPayload;
    }
    setEngine(engine) {
        this.engine = engine;
    }
    emitPayloadAsync(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalPayload = Subprovider.createFinalPayload(payload);
            const response = yield utils_1.promisify(this.engine.sendAsync, this.engine)(finalPayload);
            return response.result;
        });
    }
}
exports.Subprovider = Subprovider;
