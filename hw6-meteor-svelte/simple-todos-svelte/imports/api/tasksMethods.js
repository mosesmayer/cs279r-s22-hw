import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; // ensures that we are receiving the correct input types
import { TasksCollection } from '../db/TasksCollection';

Meteor.methods({
    'tasks.insert'(text) { // creates new method that inserts task with `text` as content
        check(text, String); // type checking

        if (!this.userId) { // ensures we have a user logged in
            throw new Meteor.Error('Not authorized.');
        }

        TasksCollection.insert({
            text,
            createdAt: new Date(),
            userId: this.userId,
        })
    },

    'tasks.remove'(taskId) {
        check(taskId, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        // checks to see if we have a task made by the correct user; otherwise, denies access
        const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

        if (!task) {
            throw new Meteor.Error('Access denied.');
        }

        TasksCollection.remove(taskId);
    },

    'tasks.setIsChecked'(taskId, isChecked) {
        check(taskId, String); // more typechecking
        check(isChecked, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        // attempts to retrieve the task in question
        const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

        if (!task) {
            throw new Meteor.Error('Access denied.');
        }

        // toggles whether the task is set
        TasksCollection.update(taskId, {
            $set: {
                isChecked
            }
        });
    }
});