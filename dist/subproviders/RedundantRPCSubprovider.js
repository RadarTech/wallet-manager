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
const _ = require("lodash");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");
const subprovider_1 = require("./subprovider");
class RedundantRPCSubprovider extends subprovider_1.Subprovider {
    static _firstSuccessAsync(rpcs, payload, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let lastErr;
            for (const rpc of rpcs) {
                try {
                    const data = yield utils_1.promisify(rpc.handleRequest.bind(rpc))(payload, next);
                    return data;
                }
                catch (err) {
                    lastErr = err;
                    continue;
                }
            }
            if (!_.isUndefined(lastErr)) {
                throw lastErr;
            }
        });
    }
    constructor(endpoints) {
        super();
        this._rpcs = _.map(endpoints, endpoint => {
            return new RpcSubprovider({
                rpcUrl: endpoint,
            });
        });
    }
    // Required to implement this public interface which doesn't conform to our linting rule.
    // tslint:disable-next-line:async-suffix
    handleRequest(payload, next, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const rpcsCopy = this._rpcs.slice();
            try {
                const data = yield RedundantRPCSubprovider._firstSuccessAsync(rpcsCopy, payload, next);
                end(null, data);
            }
            catch (err) {
                end(err);
            }
        });
    }
}
exports.RedundantRPCSubprovider = RedundantRPCSubprovider;
