const express = require('express');
const cors = require('cors');
const { Todo } = require('../models/index').Models;
const { verifyToken } = require('./middlewares');

const router = express.Router();

router.use(async (req, res, next) => {
  cors({
    origin: req.get('origin'),
    credentials: true,
  })(req, res, next);
});

/**
 * @swagger
 *  components:
 *    schemas:
 *      TodoDTO:
 *        properties:
 *          done:
 *            type: boolean
 *          id:
 *            type: integer
 *          title:
 *            type: string
 *      ResponseDTOOfListOfTodoDTO:
 *        properties:
 *          error:
 *            type: string
 *          data:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/TodoDTO'
 */

/**
 * @swagger
 *  /todo:
 *    get:
 *      summary: retrieveTodoList
 *      tags:
 *        - todo
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResponseDTOOfListOfTodoDTO'
 */
router.get('/', verifyToken, async (req, res, next) => {
  const user_id = req.decoded.id;
  const todos = await Todo.findAll({ where: { user_id: user_id } });
  res.json({ error: null, data: todos });
});

/**
 * @swagger
 *  /todo:
 *    put:
 *      summary: createTodo
 *      tags:
 *        - todo
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TodoDTO'
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResponseDTOOfListOfTodoDTO'
 */
router.put('/', verifyToken, async (req, res, next) => {
  const user_id = req.decoded.id;
  const todo = req.body;
  todo.user_id = user_id;
  console.log(todo.done);
  if (todo.done === null || todo.done === undefined) todo.done = false;
  await Todo.create(todo);
  const todos = await Todo.findAll({ where: { user_id: user_id } });
  res.json({ error: null, data: todos });
});

/**
 * @swagger
 *  /todo:
 *    delete:
 *      summary: deleteTodo
 *      tags:
 *        - todo
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TodoDTO'
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResponseDTOOfListOfTodoDTO'
 */
router.delete('/', verifyToken, async (req, res, next) => {
  const user_id = req.decoded.id;
  const { id } = req.body;
  await Todo.destroy({ where: { id } });
  const todos = await Todo.findAll({ where: { user_id: user_id } });
  res.json({ error: null, data: todos });
});

/**
 * @swagger
 *  /todo:
 *    patch:
 *      summary: updateTodo
 *      tags:
 *        - todo
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TodoDTO'
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ResponseDTOOfListOfTodoDTO'
 */
router.patch('/', verifyToken, async (req, res, next) => {
  const user_id = req.decoded.id;
  const todo = req.body;
  const id = todo.id;
  await Todo.update(todo, { where: { id } });
  const todos = await Todo.findAll({ where: { user_id: user_id } });
  res.json({ error: null, data: todos });
});

module.exports = router;
