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
exports.PostModel = exports.Post = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
let Post = class Post {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], Post.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typegoose_1.Prop({ type: String, required: true }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typegoose_1.Prop({ type: String, required: true }),
    __metadata("design:type", String)
], Post.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typegoose_1.Prop({ type: Number, required: false, default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "points", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    typegoose_1.Prop({ ref: User_1.User, required: true }),
    __metadata("design:type", Object)
], Post.prototype, "creator", void 0);
Post = __decorate([
    typegoose_1.modelOptions({
        options: { customName: 'Post' },
        schemaOptions: { timestamps: true },
    }),
    type_graphql_1.ObjectType()
], Post);
exports.Post = Post;
exports.PostModel = typegoose_1.getModelForClass(Post);
//# sourceMappingURL=Post.js.map