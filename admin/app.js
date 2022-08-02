//导入express框架
const express = require("express");
//创建web服务器
const app = express();
const path = require("path");
const session = require("express-session");

app.use(
  session({
    secret: "itheima",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //有效时间一天
    },
  })
);
app.use(express.static(path.join(__dirname, "./public")));
//导入路由
const admin = require("./router/admin");
//注册路由
app.use("/admin", admin);
app.set("views engine", "art");
// //设置渲染后art的模板时，使用的模板引擎是什么
app.engine("art", require("art-template"));

//启用监听
app.listen(666, () => {
  console.log("http://localhost:666/login.html");
});
