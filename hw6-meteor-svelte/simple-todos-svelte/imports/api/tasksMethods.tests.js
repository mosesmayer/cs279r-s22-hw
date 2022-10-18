import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';

if (Meteor.isServer) {
    describe('Tasks', () => {
        describe('methods', () => {
            const userId = Random.id();
            let taskId;

            beforeEach(() => {
                // ensures database is in a state before starting
                // here we try to have a database with just one task
                TasksCollection.remove({});
                taskId = TasksCollection.insert({ // create task with random userid for each test
                    text: 'Test Task',
                    createdAt: new Date(),
                    userId,
                });
            });

            // Structure is it('TASK_MESSAGE', () => {task function.})
            // Can use mockMethodCall with a context to mock as an authenticated user
            // use assert as imported from chai

            it('can delete owned task', () => {
                // mocks authenticated user
                mockMethodCall('tasks.remove', taskId, { context: { userId } });

                assert.equal(TasksCollection.find().count(), 0);
            });

            it(`can't delete task without an user authenticated`, () => { // no context, so no authentication
                const fn = () => mockMethodCall('tasks.remove', taskId);
                assert.throw(fn, /Not authorized/);
                assert.equal(TasksCollection.find().count(), 1);
            });

            it(`can't delete task from another owner`, () => {
                const fn = () => // call remove on task with another user ID
                    mockMethodCall('tasks.remove', taskId, {
                        context: { userId: 'somebody-else-id' },
                    });
                assert.throw(fn, /Access denied/);
                assert.equal(TasksCollection.find().count(), 1);
            });

            it('can change the status of a task', () => {
                // tests to see if updated task is different from original
                const originalTask = TasksCollection.findOne(taskId);
                mockMethodCall('tasks.setIsChecked', taskId, !originalTask.isChecked, {
                    context: { userId },
                });

                const updatedTask = TasksCollection.findOne(taskId);
                assert.notEqual(updatedTask.isChecked, originalTask.isChecked);
            });

            it('can insert new tasks', () => {
                const text = 'New Task';
                mockMethodCall('tasks.insert', text, {
                    context: { userId },
                });

                const tasks = TasksCollection.find({}).fetch();
                assert.equal(tasks.length, 2);
                assert.isTrue(tasks.some(task => task.text === text));
            });
        });
    });
}