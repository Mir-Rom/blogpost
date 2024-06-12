import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import paths from './paths.js'
import errorMessages from './errorMessages.js'
import { charset } from './constants.js'
import { pool as db } from './db.js'
export default {
	async getPosts() {
		try {
			let posts = await fs.readFile(paths.postsFile, charset)
			posts = JSON.parse(posts)
			return posts
		} catch {
			throw new Error(errorMessages.getPostsError)
		}
	},
	async getPost(postId) {
		try {
			const posts = await this.getPosts()
			const post = posts.find((post) => post.id === postId)
			return post
		} catch {
			throw new Error(errorMessages.getPostsError)
		}
	},
	async createPost(post) {
		try {
			db.query(
				'INSERT INTO posts (post_title, post_text, post_tags, post_image_path) VALUES($1,$2,$3,$4) RETURNING *',
				[post.title, post.text, post.tags, '/images/' + post.image]
			)
		} catch {
			throw new Error(errorMessages.getPostError)
		}
	},
	async existPostWithId(postId) {
		return Boolean(this.getPost(postId))
	},
	async removePost(postId) {
		try {
			if (!this.existPostWithId()) throw new Error()
			const posts = await this.getPosts()
			const filteredPosts = await posts.filter((post) => post.id !== postId)
			fs.writeFile(paths.postsFile, JSON.stringify(filteredPosts))
		} catch {
			throw new Error(errorMessages.removePostError)
		}
	},
	async editPost(postId, newPostData) {
		try {
			if (!this.existPostWithId()) throw new Error()
			const posts = await getPosts()
			posts[postId] = { ...posts[postId], ...newPostData }
			fs.writeFile(paths.postsFile, JSON.stringify(posts))
		} catch {
			throw new Error(errorMessages.editPostError)
		}
	},
}
