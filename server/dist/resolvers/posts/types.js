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
exports.PaginatedPosts = exports.updatePostInput = exports.createPostInput = void 0;
const Post_1 = require("../../models/Post");
const type_graphql_1 = require("type-graphql");
let createPostInput = class createPostInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], createPostInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], createPostInput.prototype, "text", void 0);
createPostInput = __decorate([
    type_graphql_1.InputType()
], createPostInput);
exports.createPostInput = createPostInput;
let updatePostInput = class updatePostInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], updatePostInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], updatePostInput.prototype, "title", void 0);
updatePostInput = __decorate([
    type_graphql_1.InputType()
], updatePostInput);
exports.updatePostInput = updatePostInput;
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    type_graphql_1.Field(() => [Post_1.Post]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    type_graphql_1.ObjectType()
], PaginatedPosts);
exports.PaginatedPosts = PaginatedPosts;
//# sourceMappingURL=types.js.map