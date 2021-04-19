"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const isAuth = ({ context }, next) => {
    try {
        if (!context.req.session.userId) {
            throw new Error('no autenticado');
        }
        return next();
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map