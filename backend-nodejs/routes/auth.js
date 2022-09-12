const express = require('express');
const cors = require('cors');
const { User } = require('../models/index').Models;
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const KAKAO_ID = '29ec7a66579f65c6ba3efa0d673d5b6a';
const { JWT_SECRET } = require('./middlewares');

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
 *      UserRequestDTO:
 *        properties:
 *          email:
 *            type: string
 *          nick:
 *            type: string
 *          password:
 *            type: string
 *      KakaoOAuthDTO:
 *        properties:
 *          code:
 *            type: string
 *          redirectUri:
 *            type: string
 *      UserEntity:
 *        properties:
 *          email:
 *            type: string
 *          id:
 *            type: integer
 *          nick:
 *            type: string
 *          password:
 *            type: string
 *          provider:
 *            type: string
 *          snsId:
 *            type: string
 */

/**
 * @swagger
 *  /auth/signup:
 *    post:
 *      summary: 유저 등록
 *      tags:
 *        - auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserRequestDTO'
 *      responses:
 *        '200':
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserEntity'
 *        '400':
 *          description: Failed
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  error:
 *                    type: string
 */
router.post('/signup', async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email, provider: 'local' } });
    if (exUser) {
      return res.status(400).json({
        error: 'Email already exists',
      });
    }
    await User.create({
      email,
      nick,
      password,
      provider: 'local',
    });
    const user = await User.findOne({ where: { email, provider: 'local' } });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

/**
 * @swagger
 *  /auth/signin:
 *    post:
 *      summary: 유저 로그인
 *      tags:
 *        - auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserRequestDTO'
 *      responses:
 *        '200':
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  token:
 *                    type: string
 *                  user:
 *                    $ref: '#/components/schemas/UserEntity'
 *        '400':
 *          description: Failed
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  error:
 *                    type: string
 */
router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email, provider: 'local' } });
    if (exUser) {
      if (exUser.password === password) {
        const token = jwt.sign(
          {
            id: exUser.id,
          },
          JWT_SECRET,
          {
            expiresIn: '10m', // 분
            issuer: 'todo api',
          }
        );
        return res.json({ token, user: exUser });
      }
    }
    return res.status(400).json({
      error: 'Login failed',
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

/**
 * @swagger
 *  /auth/kakao:
 *    post:
 *      summary: 카카오 로그인
 *      tags:
 *        - auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/KakaoOAuthDTO'
 *      responses:
 *        '200':
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  token:
 *                    type: string
 *                  user:
 *                    $ref: '#/components/schemas/UserEntity'
 *        '400':
 *          description: Failed
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  error:
 *                    type: string
 */
router.post('/kakao', async (req, res, next) => {
  const { code, redirectUri } = req.body;
  try {
    console.log(code, redirectUri);
    const kakaoId = KAKAO_ID;
    console.log(kakaoId);

    const config = {
      client_id: kakaoId,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
    };
    const params = new URLSearchParams(config).toString();
    const requestUrl = `https://kauth.kakao.com/oauth/token?${params}`;
    const kakaoTokenRequest = await (
      await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json', // 이 부분을 명시하지않으면 text로 응답을 받게됨
        },
      })
    ).json();
    if ('access_token' in kakaoTokenRequest) {
      // 엑세스 토큰이 있는 경우 API에 접근
      const { access_token } = kakaoTokenRequest;
      const userRequest = await (
        await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-type': 'application/json',
          },
        })
      ).json();

      const provider = 'kakao';
      const sns_id = userRequest.id.toString();
      const email = userRequest.kakao_account.email;
      const nick = userRequest.kakao_account.profile.nickname;

      let user = await User.findOne({
        where: { provider: provider, sns_id: sns_id },
      });
      if (user === null) {
        user = {
          email: email,
          nick: nick,
          provider: provider,
          sns_id: sns_id,
        };
        await User.create(user);
      }
      const token = jwt.sign(
        {
          id: user.id,
        },
        JWT_SECRET,
        {
          expiresIn: '10m', // 분
          issuer: 'todo api',
        }
      );
      console.log('성공', token);
      return res.json({ token, user });
    }
    return res.status(400).json({
      error: 'Login failed',
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

module.exports = router;
