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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const Post_1 = require("../../models/Post");
const type_graphql_1 = require("type-graphql");
const types_1 = require("./types");
const isAuth_1 = require("../../middleware/isAuth");
const User_1 = require("../../models/User");
let PostResolver = class PostResolver {
    textSnippet(root) {
        return root.text.slice(0, 50);
    }
    getPosts(limit, cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            const realLimit = Math.min(50, limit);
            const realLimitHasMore = realLimit + 1;
            let filter = {};
            if (cursor) {
                filter = { createdAt: { $lt: cursor } };
            }
            const posts = yield Post_1.PostModel.find(filter)
                .sort({ createdAt: -1 })
                .limit(realLimitHasMore)
                .populate('creator');
            return {
                posts: posts.slice(0, realLimit),
                hasMore: posts.length === realLimitHasMore,
            };
        });
    }
    getPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Post_1.PostModel.findById(postId).populate('creator');
        });
    }
    createPost(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = new Post_1.PostModel(Object.assign(Object.assign({}, input), { creator: req.session.userId }));
            yield post.save();
            return post;
        });
    }
    updatePost({ req }, input) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield Post_1.PostModel.findById(input.id);
                if (((_a = post === null || post === void 0 ? void 0 : post.creator) === null || _a === void 0 ? void 0 : _a.toString()) !== req.session.userId) {
                    throw new Error('NO ES EL DUENO');
                }
                if (!post) {
                    return null;
                }
                const updatedPost = yield Post_1.PostModel.findByIdAndUpdate(input.id, input, {
                    new: true,
                });
                return updatedPost;
            }
            catch (err) {
                console.error(err.message);
                return null;
            }
        });
    }
    deletePost({ req }, postId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield Post_1.PostModel.findById(postId).select('creator');
                if (((_a = post === null || post === void 0 ? void 0 : post.creator) === null || _a === void 0 ? void 0 : _a.toString()) !== req.session.userId) {
                    throw new Error('NO ES EL DUENO');
                }
                yield User_1.UserModel.findByIdAndUpdate(req.session.userId, {
                    $pull: { votedPosts: { postId } },
                });
                yield Post_1.PostModel.deleteOne({ _id: postId });
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    vote({ req }, postId, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isUpvote = value !== -1;
                const user = yield User_1.UserModel.findById(req.session.userId);
                const userVotedPost = user === null || user === void 0 ? void 0 : user.votedPosts.filter((post) => post.postId === postId);
                const objUserVote = {
                    postId: postId,
                    voteValue: value,
                };
                if (userVotedPost[0]) {
                    yield User_1.UserModel.findByIdAndUpdate(req.session.userId, {
                        $pull: { votedPosts: { postId: objUserVote.postId } },
                    });
                    yield User_1.UserModel.findByIdAndUpdate(req.session.userId, {
                        $push: { votedPosts: objUserVote },
                    });
                    if (userVotedPost[0].voteValue !== value) {
                        yield Post_1.PostModel.findByIdAndUpdate(postId, isUpvote ? { $inc: { points: 1 } } : { $inc: { points: -1 } });
                    }
                    return true;
                }
                yield User_1.UserModel.findByIdAndUpdate(req.session.userId, {
                    $push: { votedPosts: objUserVote },
                });
                yield Post_1.PostModel.findByIdAndUpdate(postId, isUpvote ? { $inc: { points: 1 } } : { $inc: { points: -1 } });
                return true;
            }
            catch (err) {
                console.error(err.message);
                return false;
            }
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "textSnippet", null);
__decorate([
    type_graphql_1.Query(() => types_1.PaginatedPosts),
    __param(0, type_graphql_1.Arg('limit', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('cursor', () => Date, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPosts", null);
__decorate([
    type_graphql_1.Query(() => Post_1.Post, { nullable: true }),
    __param(0, type_graphql_1.Arg('postId', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPost", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.createPostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, types_1.updatePostInput]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('postId')),
    __param(2, type_graphql_1.Arg('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
PostResolver = __decorate([
    type_graphql_1.Resolver(Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map