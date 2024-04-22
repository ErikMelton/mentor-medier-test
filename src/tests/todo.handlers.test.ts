import request from 'supertest';

import app from '../index';
import sequelize from '../db';

const test_todo_data = {
  title: 'Test Todo',
  status: 'todo'
};

describe('ToDo API', () => {
  beforeEach(async () => {
    await sequelize.sync({force: true});
  });

  it('should get all todos when there are none', async () => {
    const res = await request(app).get('/todo/');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/todo/')
      .send(test_todo_data);

    expect(res.status).toBe(200);
    expect(res.body.id).toBeTruthy();
    expect(res.body.title).toBe('Test Todo');
    expect(res.body.status).toBe('todo');
  });

  it('should get all created todos', async () => {
    await request(app)
      .post('/todo/')
      .send(test_todo_data);

    await request(app)
      .post('/todo/')
      .send(test_todo_data);

    const res = await request(app).get('/todo/');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should update a todo successfully', async () => {
    const createRes = await request(app)
      .post('/todo/')
      .send(test_todo_data);

    const updateRes = await request(app)
      .put(`/todo/${createRes.body.id}`)
      .send({ title: 'Updated Todo', status: 'in-progress' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe('Updated Todo');
    expect(updateRes.body.status).toBe('in-progress');
  });

  it('should update a todo successfully with only title', async () => {
    const createRes = await request(app)
      .post('/todo/')
      .send(test_todo_data);

    const updateRes = await request(app)
      .put(`/todo/${createRes.body.id}`)
      .send({ title: 'Updated Todo' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe('Updated Todo');
    expect(updateRes.body.status).toBe('todo');
  });

  it('should update a todo successfully with only status', async () => {
    const createRes = await request(app)
      .post('/todo/')
      .send(test_todo_data);

    const updateRes = await request(app)
      .put(`/todo/${createRes.body.id}`)
      .send({ status: 'in-progress' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe('Test Todo');
    expect(updateRes.body.status).toBe('in-progress');
  });

  it('should fail to update a todo with invalid status', async () => {
    const createRes = await request(app)
      .post('/todo/')
      .send({ title: 'Test Todo', status: 'todo' });

    const updateRes = await request(app)
      .put(`/todo/${createRes.body.id}`)
      .send({ title: 'Updated Todo', status: 'invalid-status' });

    expect(updateRes.status).toBe(400);
    expect(updateRes.body.errors[0].msg).toBe('Invalid status');
  });

  it('should fail to update a todo with invalid title', async () => {
    const createRes = await request(app)
      .post('/todo/')
      .send({ title: 'Test Todo', status: 'todo' });

    const updateRes = await request(app)
      .put(`/todo/${createRes.body.id}`)
      .send({ title: '' });

    expect(updateRes.status).toBe(400);
    expect(updateRes.body.errors[0].msg).toBe('Title should be between 1 and 255 characters');

    const updateRes2 = await request(app)
      .put(`/todo/${createRes.body.id}`)
      .send({ title: 'a'.repeat(256) });

    expect(updateRes2.status).toBe(400);
  });

  it('should fail to update a todo with invalid id', async () => {
    const updateRes = await request(app)
      .put(`/todo/123`)
      .send({ title: 'Updated Todo', status: 'in-progress' });

    expect(updateRes.status).toBe(400);
    expect(updateRes.body.errors[0].msg).toBe('Todo not found');
  });

  it('should mark a todo as ongoing', async () => {
    const createRes = await request(app)
      .post('/todo/')
      .send({ title: 'Test Todo', status: 'todo' });

    const updateRes = await request(app)
      .post(`/todo/${createRes.body.id}/ongoing`);

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('in-progress');
  });

  it('should fail to mark a todo as ongoing with invalid id', async () => {
    const updateRes = await request(app)
      .post(`/todo/123/ongoing`);

    expect(updateRes.status).toBe(400);
    expect(updateRes.body.errors[0].msg).toBe('Todo not found');
  });

  it('should mark a todo as done', async () => {
    const createRes = await request(app)
      .post('/todo/')
      .send({ title: 'Test Todo', status: 'todo' });

    const updateRes = await request(app)
      .post(`/todo/${createRes.body.id}/done`);

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('done');
  });

  it('should fail to mark a todo as done with invalid id', async () => {
    const updateRes = await request(app)
      .post(`/todo/123/done`);

    expect(updateRes.status).toBe(400);
    expect(updateRes.body.errors[0].msg).toBe('Todo not found');
  });

  it('should delete a todo', async () => {
    const createRes = await request(app)
      .post('/todo/')
      .send({ title: 'Test Todo', status: 'todo' });

    const deleteRes = await request(app)
      .delete(`/todo/${createRes.body.id}`);

    expect(deleteRes.status).toBe(204);
    expect(deleteRes.body).toEqual({});
  });

  it('should fail to delete a todo with invalid id', async () => {
    const deleteRes = await request(app)
      .delete(`/todo/123`);

    expect(deleteRes.status).toBe(400);
    expect(deleteRes.body.errors[0].msg).toBe('Todo not found');
  });
});