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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldError = exports.ChangePasswordInput = exports.UpdateUserInput = exports.CreateUserInput = void 0;
const type_graphql_1 = require("type-graphql");
let CreateUserInput = class CreateUserInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "password", void 0);
CreateUserInput = __decorate([
    type_graphql_1.InputType()
], CreateUserInput);
exports.CreateUserInput = CreateUserInput;
let UpdateUserInput = class UpdateUserInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "password", void 0);
UpdateUserInput = __decorate([
    type_graphql_1.InputType()
], UpdateUserInput);
exports.UpdateUserInput = UpdateUserInput;
let ChangePasswordInput = class ChangePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ChangePasswordInput.prototype, "token", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ChangePasswordInput.prototype, "newPassword", void 0);
ChangePasswordInput = __decorate([
    type_graphql_1.InputType()
], ChangePasswordInput);
exports.ChangePasswordInput = ChangePasswordInput;
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "msg", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
exports.FieldError = FieldError;
//# sourceMappingURL=types.js.map