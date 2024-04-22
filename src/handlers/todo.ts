import { Request, Response } from 'express';
import { ToDo } from '../models/todo';
import {validationResult} from 'express-validator';

const checkValidationResult = (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({errors: result.array()});
  }

  return null;
}

export const getAllTodos = async (req: Request, res: Response) => {
  const result = checkValidationResult(req, res);

  if (result) {
    return result;
  }

  ToDo.findAll().then((todos) => {
    res.json(todos);
  }).catch((err) => {
    res.status(400).json({errors: err});
  });
}

export const createTodo = async (req: Request, res: Response) => {
  const result = checkValidationResult(req, res);

  if (result) {
    return result;
  }

  const newTodo = ToDo.build({
    title: req.body.title,
    status: req.body.status
  })
  newTodo.save().then((todo) => {
    res.json(todo);
  }).catch((err) => {
    res.status(400).json({errors: err});
  });
}

export const updateTodo = async (req: Request, res: Response) => {
  const result = checkValidationResult(req, res);

  if (result) {
    return result;
  }

  const id = req.params.id;
  ToDo.findByPk(id).then((todo) => {
    if (!todo) {
      return res.status(400).json({errors: [{msg: 'Todo not found'}]});
    }

    todo.update({
      title: req.body.title,
      status: req.body.status
    }).then((todo) => {
      res.json(todo);
    }).catch((err) => {
      res.json({errors: err});
    })
  }).catch((err) => {
    res.json({errors: err});
  })
};

export const markTodoAsOngoing = async (req: Request, res: Response) => {
  const result = checkValidationResult(req, res);

  if (result) {
    return result;
  }

  const id = req.params.id;
  ToDo.findByPk(id).then(((todo) => {
    if (!todo) {
      return res.status(400).json({errors: [{msg: 'Todo not found'}]});
    }

    todo.update({
      status: 'in-progress'
    }).then((todo) => {
      res.json(todo);
    }).catch((err) => {
      res.json({errors: err});
    })

  }))
};

export const markTodoAsDone = async (req: Request, res: Response) => {
  const result = checkValidationResult(req, res);

  if (result) {
    return result;
  }

  const id = req.params.id;
  ToDo.findByPk(id).then(((todo) => {
    if (!todo) {
      return res.status(400).json({errors: [{msg: 'Todo not found'}]});
    }

    todo.update({
      status: 'done'
    }).then((todo) => {
      res.json(todo);
    }).catch((err) => {
      res.json({errors: err});
    })
  }));
};

export const deleteTodo = async (req: Request, res: Response) => {
  const result = checkValidationResult(req, res);

  if (result) {
    return result;
  }

  const id = req.params.id;
  ToDo.findByPk(id).then(((todo) => {
    if (!todo) {
      return res.status(400).json({errors: [{msg: 'Todo not found'}]});
    }

    todo.destroy().then(() => {
      res.status(204).json();
    }).catch((err) => {
      res.json({errors: err});
    })
  }));
};
