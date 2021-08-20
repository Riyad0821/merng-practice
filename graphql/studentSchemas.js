const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLBoolean = require('graphql').GraphQLBoolean;
const GraphQLFloat = require('graphql').GraphQLFloat;
const StudentModel = require('../models/Student');

const studentType = new GraphQLObjectType({
    name: 'student',
    fields: () => ({
        _id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        dob: {
            type: GraphQLString
        }
    })
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        students: {
            type: new GraphQLList(studentType),
            resolve: () => StudentModel.find({})
        },
        student: {
            type: studentType,
            args: {
                id: {
                    name: '_id',
                    type: GraphQLID
                }
            },
            resolve: (root, args) => StudentModel.findById(args.id)
        }
    })
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addStudent: {
            type: studentType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                phone: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                dob: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, args) => {
                let student = new StudentModel({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                    dob: args.dob
                });
                return student.save();
            }
        },
        updateStudent: {
            type: studentType,
            args: {
                id: {
                    name: '_id',
                    type: new GraphQLNonNull(GraphQLID)
                },
                name: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                phone: {
                    type: GraphQLString
                },
                dob: {
                    type: GraphQLString
                }
            },
            resolve: (root, args) => {
                return StudentModel.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                        dob: args.dob
                    }
                }, {
                    new: true
                });
            }
        },
        deleteStudent: {
            type: studentType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: (root, args) => {
                return StudentModel.findByIdAndRemove(args.id);
            }
        }
    })
});

module.exports = new GraphQLSchema({query: queryType, mutation: mutation});

