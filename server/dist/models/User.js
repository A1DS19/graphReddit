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
exports.UserModel = exports.User = exports.VotedPost = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
let VotedPost = class VotedPost {
};
__decorate([
    type_graphql_1.Field(() => String),
    typegoose_1.Prop({ type: String, required: true }),
    __metadata("design:type", String)
], VotedPost.prototype, "postId", void 0);
__decorate([
    type_graphql_1.Field(() => Number),
    typegoose_1.Prop({ type: Number, required: true }),
    __metadata("design:type", Number)
], VotedPost.prototype, "voteValue", void 0);
VotedPost = __decorate([
    type_graphql_1.ObjectType()
], VotedPost);
exports.VotedPost = VotedPost;
let User = class User {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], User.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typegoose_1.Prop({ type: String, unique: true, required: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.Prop({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(() => [VotedPost]),
    typegoose_1.Prop({ type: VotedPost, required: false, default: [] }),
    __metadata("design:type", Array)
], User.prototype, "votedPosts", void 0);
User = __decorate([
    typegoose_1.modelOptions({
        options: { customName: 'User' },
        schemaOptions: { timestamps: true },
    }),
    type_graphql_1.ObjectType()
], User);
exports.User = User;
exports.UserModel = typegoose_1.getModelForClass(User);
//# sourceMappingURL=User.js.map