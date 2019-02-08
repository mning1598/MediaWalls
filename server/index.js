const { ApolloServer, UserInputError, gql } = require('apollo-server');
const mongoose = require("mongoose");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const session = require('express-session')

mongoose.connect("mongodb://localhost/test1")



const User = mongoose.model('User', {
	email: {
		type: String,
		validate: {
			validator: async email => await User.where({ email }).countDocuments() === 0,
			message: ({ value }) => `Email ${value} has already been taken.`
		}
	},
	username: { 
		type: String,
		validate: {
			validator: async username => await User.where({ username }).countDocuments() === 0,
			message: ({ value }) => `Username ${value} is already been taken.`
		}
	},
	name: String,
	password: String

})

//User Validation schema 
const userValSchema = Joi.object().keys({
	email: Joi.string().email().required().label('Email'),
	username: Joi.string().alphanum().min(4).max(30).required().label('Username'),
	name: Joi.string().max(254).required().label('Name'),
	password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/).label('Password').options({
		language: {
			string: {
				regex: {
					base: 'must have at least one letter, one number, and must contain at least 8 characters'
				}
			}
		}
	})
})


const Post = mongoose.model('Post', {
	Title: String,
	User: String,
	body: String
})

const typeDefs = gql`
	type Query {
		users: [User!]!
		user(id: ID!):User
		posts: [Post!]!
	}
	type Mutation {
		signUp(email: String!, username: String!, name: String!, password: String!): User
		removeUser(id: ID!): Boolean
		newPost(Title: String!, body: String!, userId: ID!): Post
		removePost(id: ID!): Boolean

	}
	type User {
		id: ID!
		name: String
		username: String
		password: String
		email: String!
		avatarUrl: String
		posts: [Post!]!
	}
	type Post {
		id: ID!
		userId: ID!
		Title: String!
		body: String!
		createdAt: String
	}
`;

const resolvers = {
	Query: {
		users: (root, args, context, info) => {
			//todo: auth, projection, pagination
			return User.find({})
		},
		user: (root, { id }, context, info) => {
			//todo: auth, projection, sanitization
			if(!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(`${id} is not a valid user ID.`)
			}
			return User.findById(id)
		},
		posts: (root, args, context, info) => {
			return Post.find({})
		}
	},
	Mutation: {
		
		signUp: async (root, args, context, info) => {
			//todo: not auth

			//validation
			await Joi.validate(args, userValSchema, { abortEarly: false })
			const password = args.password
			bcrypt.hash(args.password)
			return User.create(args)
		},
		removeUser: async(_, {id}) => {
			await User.findByIdAndRemove(id);
			return true;
		},
		newPost: async(root, args, context, info) => {
			return Post.create(args)
		},

		removePost: async(_, {id}) => {
			await Post.findByIdAndRemove(id);
			return true;
		}

	},
	// User: {
	// 	comments: user => db.comments.filter(comment => comment.userId === user.id)
	// }
	

}

const server = new ApolloServer({ typeDefs, resolvers});
mongoose.connection.once('open', function() {
	server.listen().then(({ url }) => console.log(url))
});

