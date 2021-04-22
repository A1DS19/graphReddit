"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INIT_DB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const INIT_DB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.DATABASE_URL, {
            dbName: 'graphReddit',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        mongoose_1.default.set('debug', (collectionName, method, query, doc) => {
            console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
        });
        console.log(`DB CONNECTED`);
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
});
exports.INIT_DB = INIT_DB;
//# sourceMappingURL=mongo.js.map