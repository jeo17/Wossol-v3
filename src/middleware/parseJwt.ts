import { RequestHandler } from 'express';

import { verifyJwt } from '../utils/jwt';

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    console.log("Access denied. No token provided.")

    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const jwt = token.split(' ')[1];
    res.locals = verifyJwt(jwt);
    console.log(" valid token")

    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
