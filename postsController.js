import errorMessages from './errorMessages.js'
import dbQuerys from './dbQuerys.js'
import { pool as db } from './db.js'
export default {
	async getPosts() {
		try {
			let posts = (await db.query(dbQuerys.getPostsQuery)).rows
			return posts
		} catch {
			throw new Error(errorMessages.getPostsError)
		}
	},
	async getPost(postId) {
		try {
			const posts = await this.getPosts()
			const post = posts.find((post) => post.id === String(postId))
			return post
		} catch {
			throw new Error(errorMessages.getPostError)
		}
	},
	async createPost(post) {
		try {
			db.query(dbQuerys.createPostQuery, [
				post.title,
				post.text,
				post.tags === '' ? [] : post.tags.split(','),
				'/images/' + post.image,
			])
		} catch {
			throw new Error(errorMessages.getCreateError)
		}
	},
	async existPostWithId(postId) {
		return Boolean(await this.getPost(postId))
	},
	async removePost(postId) {
		try {
			db.query(dbQuerys.removePostQuery, [postId])
		} catch {
			throw new Error(errorMessages.removePostError)
		}
	},
	async editPost(newPostData) {
		try {
			db.query(dbQuerys.editPostQuery, [
				newPostData.title,
				newPostData.text,
				newPostData.tags === '' ? [] : newPostData.tags.split(','),
				newPostData.image,
				newPostData.id,
			])
		} catch {
			throw new Error(errorMessages.editPostError)
		}
	},
}
