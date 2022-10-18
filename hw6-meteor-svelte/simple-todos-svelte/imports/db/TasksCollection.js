import { Mongo } from 'meteor/mongo';

// use Mongo for collections
export const TasksCollection = new Mongo.Collection('tasks');