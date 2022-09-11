const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();
const authRouter = require('./routes/auth');
const todoRouter = require('./routes/todo');

const { sequelize } = require('./models');

const { swaggerUi, spec } = require('./swagger');

const app = express();
app.set('port', process.env.PORT || 8081);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/todo', todoRouter);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(spec));

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
