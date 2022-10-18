import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';

// tells server that they can send tasks to client
Meteor.publish('tasks', function publishTasks() {
    return TasksCollection.find({ userId: this.userId });
});