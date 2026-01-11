import express from "express";
import path from "node:path";
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";

import configureRoutes from "./routes/index.js";

export default function initializeApp() {
  const app = express();

  // static files
  app.use(express.static("public"));

  // view engine
  app.set("view engine", "ejs");
  app.set("views", path.join(process.cwd(), "views"));

  // middlewares
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(cookieParser());

  // session
  app.use(
    session({
      secret: "blog",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(flash());

  // Make flash available to all views
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
  });

  // routes
  configureRoutes(app);

  return app;
}
