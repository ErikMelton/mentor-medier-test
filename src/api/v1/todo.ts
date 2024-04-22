import express from 'express'

import * as todosHandlers from '../../handlers/todo';
import {body, checkSchema, param, Schema} from 'express-validator'

const idIsInteger = param('id').isInt({gt: 0}).withMessage('ID must be a positive integer');
const todoTitleUpdateIsValid = body('title').isString().isLength({min: 1, max: 255}).optional().withMessage('Title should be between 1 and 255 characters');
const todoStatusUpdateIsValid = body('status').isString().isIn(['todo', 'in-progress', 'done']).optional().withMessage('Invalid status');
const todoSchema: Schema<any> = {
  title: {
    in: ['body'],
    isString: true,
    isLength: {
      errorMessage: 'Title should be between 1 and 255 characters',
      options: { min: 1, max: 255 }
    }
  },
  status: {
    in: ['body'],
    isString: true,
    isIn: {
      errorMessage: 'Invalid status',
      options: [['todo', 'in-progress', 'done']]
    },
    optional: true
  }
}

const router = express.Router();

router.get('/', todosHandlers.getAllTodos);
router.post('/', checkSchema(todoSchema), todosHandlers.createTodo);
router.put('/:id', idIsInteger, todoTitleUpdateIsValid, todoStatusUpdateIsValid, todosHandlers.updateTodo);
router.post('/:id/ongoing', idIsInteger, todosHandlers.markTodoAsOngoing);
router.post('/:id/done', idIsInteger, todosHandlers.markTodoAsDone);
router.delete('/:id', idIsInteger, todosHandlers.deleteTodo);


export default router;
