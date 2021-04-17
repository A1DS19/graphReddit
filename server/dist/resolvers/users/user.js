"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const User_1 = require("../../entities/User");
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const sendEmail_1 = require("../../util/sendEmail");
const uuid_1 = require("uuid");
const types_1 = require("./types");
const constants_1 = require("../../constants");
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserResolver = class UserResolver {
    me({ em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.session.userId) {
                    return null;
                }
                return yield em.findOne(User_1.User, { id: req.session.userId });
            }
            catch (err) {
                return null;
            }
        });
    }
    createUser(input, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input.email.length <= 5) {
                return { errors: [{ field: 'email', msg: 'Email debe tener 5 o mas caracteres' }] };
            }
            if (input.password.length <= 2) {
                return {
                    errors: [{ field: 'password', msg: 'Contrasena debe tener 5 o mas caracteres' }],
                };
            }
            const existingUser = yield em.findOne(User_1.User, { email: input.email.toLowerCase() });
            if (existingUser) {
                return { errors: [{ field: 'email', msg: 'Email ya existe' }] };
            }
            const hashedPassword = yield argon2_1.default.hash(input.password);
            const user = em.create(User_1.User, {
                email: input.email.toLowerCase(),
                password: hashedPassword,
            });
            try {
                yield em.persistAndFlush(user);
                req.session.userId = user.id;
                return { user };
            }
            catch (err) {
                console.error(err);
                return { errors: [{ field: 'server', msg: err.message }] };
            }
        });
    }
    loginUser(input, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield em.findOne(User_1.User, {
                    email: input.email.toLowerCase(),
                });
                if (!existingUser) {
                    return {
                        errors: [
                            {
                                field: 'email',
                                msg: 'Datos invalidos',
                            },
                        ],
                    };
                }
                const isValid = yield argon2_1.default.verify(existingUser.password, input.password);
                if (!isValid) {
                    return {
                        errors: [
                            {
                                field: 'password',
                                msg: 'Datos invalidos',
                            },
                        ],
                    };
                }
                req.session.userId = existingUser.id;
                return { user: existingUser };
            }
            catch (err) {
                console.error(err);
                return { errors: [{ field: 'server', msg: err.message }] };
            }
        });
    }
    logout({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => req.session.destroy((err) => {
                res.clearCookie(process.env.COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            }));
        });
    }
    forgotPassword({ em, redis }, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield em.findOne(User_1.User, { email });
                if (!user) {
                    return true;
                }
                const token = uuid_1.v4();
                yield redis.set(constants_1.FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3);
                yield sendEmail_1.sendEmail(email, 'Olvido la contrasena', `<a href="http://localhost:3000/auth/reset-password/${token}">Click aqui para resetear contrasena</a>`);
                return true;
            }
            catch (err) {
                return {
                    errors: [{ field: '', msg: err.message }],
                };
            }
        });
    }
    changePassword(input, { redis, em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.newPassword.length <= 2) {
                    return {
                        errors: [
                            { field: 'newPassword', msg: 'Contrasena debe tener 5 o mas caracteres' },
                        ],
                    };
                }
                const key = constants_1.FORGET_PASSWORD_PREFIX + input.token;
                const userId = yield redis.get(key);
                if (!userId) {
                    return {
                        errors: [{ field: 'token', msg: 'token expirado' }],
                    };
                }
                const user = yield em.findOne(User_1.User, { id: userId });
                if (!user) {
                    return {
                        errors: [{ field: 'token', msg: 'Usuario no existe' }],
                    };
                }
                user.password = yield argon2_1.default.hash(input.newPassword);
                yield em.persistAndFlush(user);
                req.session.userId = user.id;
                yield redis.del(key);
                return { user };
            }
            catch (err) {
                return {
                    errors: [{ field: 'server', msg: err.message }],
                };
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse, { nullable: true }),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.CreateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.CreateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "loginUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.ChangePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map