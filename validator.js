import Joi from 'joi'
import errorMessages from './errorMessages.js'
import 'dotenv/config'
import postsController from './postsController.js'
const validator = (schema) => (payload) => schema.validate(payload)
const validatorAsync = (schema) => (payload) => schema.validateAsync(payload)

const postValidation = {
	title: Joi.string().required(),
	text: Joi.string().required(),
	image: Joi.string().allow('').required(),
	tags: Joi.string()
		.allow('')
		.custom((value, helpers) => {
			if (value === value.split(',')[0]) {
				return helpers.error('any.custom')
			}
			return value
		})
		.required()
		.messages({ 'any.custom': errorMessages.noneExistentId }),
}
const passcodeValidation = {
	passcode: Joi.string()
		.valid(process.env.PASSCODE)
		.required()
		.messages({ 'any.invalid': errorMessages.wrongPasscode }),
}

const idValidation = {
	id: Joi.number()
		.positive()
		.required()
		.external(async (value, helpers) => {
			if (!(await postsController.existPostWithId(value))) {
				return helpers.error('any.custom')
			}
		})
		.messages({ 'any.custom': errorMessages.noneExistentId }),
}
const postSchema = Joi.object(postValidation).append(passcodeValidation)
const editSchema = Joi.object(postValidation)
	.append(idValidation)
	.append(passcodeValidation)
const removeSchema = Joi.object(idValidation).append(passcodeValidation)

export const validatePost = validator(postSchema)
export const validateEdit = validatorAsync(editSchema)
export const validateRemove = validatorAsync(removeSchema)
