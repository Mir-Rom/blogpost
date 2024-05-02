import Joi from 'joi'
const validator = (schema) => (payload) => schema.validate(payload)

const postValidation = {
	title: Joi.string().required(),
	text: Joi.string().required(),
	image: Joi.string().allow('').required(),
	tags: Joi.string().allow('').required(),
}
const passcodeValidation = {
	passcode: Joi.string()
		.required()
		.valid('7890b64eedcf03848d6f427d11fb177ca470927320b6d83c8beba0a626d0b399')
		.messages({ 'any.invalid': 'wrong passcode' }),
}

const idValidation = { id: Joi.string().required().guid() }
const postSchema = Joi.object(postValidation).append(passcodeValidation)
const editSchema = Joi.object(postValidation)
	.append(idValidation)
	.append(passcodeValidation)
const removeSchema = Joi.object(idValidation).append(passcodeValidation)

export const validatePost = validator(postSchema)
export const validateEdit = validator(editSchema)
export const validateRemove = validator(removeSchema)
