const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    //console.log(token, req.headers.authorization);
    req.decoded = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    return res.status(403).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    });
  }
};
