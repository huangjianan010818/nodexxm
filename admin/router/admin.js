//搭配如express模块
const express = require("express");
const admin = express.Router();
const db = require("../model/mysql");
const querystring = require("querystring");

const mw1 = (req, res, next) => {
  var str = "";
  req.on("data", (value) => {
    str += value;
  });
  req.on("end", () => {
    req.body = querystring.parse(str);
    next();
  });
};

admin.post("/login", mw1, (req, res) => {
  var sql = "select * from user where userName = ? and pwd = ?";
  db.query(sql, [req.body.username, req.body.pwd], (err, result) => {
    if (result != null && result.length > 0) {
      console.log("修改成功");
      console.log(result[0]);
      updateStatus(0, result[0]);
      result[0].status = 0;
      req.session.admin = result[0];

      //跳转到列表页面
      res.send({
        status: 0,
        message: "登录成功",
        admin: result[0],
      });
    } else {
      res.send({
        status: 1,
        message: "登录失败",
        admin: [],
      });
    }
  });
});
//添加用户接口
admin.post("/add", mw1, (req, res) => {
  var bool = false;
  console.log(req.body.adminName);
  var sql = "select * from user where userName = ?";
  db.query(sql, req.body.adminName, (err, result) => {
    if (err) console.log(err.message);

    if (result.length == 0) {
      bool = true;
    }

    if (!bool) {
      res.send({
        status: 1,
        msg: "用户名已存在",
      });
    } else {
      var sql =
        "insert into user(userName,pwd,email,job,status) values (?,?,?,?,?)";
      db.query(
        sql,
        [
          req.body.adminName,
          req.body.pwd,
          req.body.email,
          req.body.job,
          req.body.status,
        ],
        (err, result) => {
          if (err) console.log(err.message);
          //成功
          if (result.affectedRows > 0) {
            console.log(33);
            res.send({
              status: 0,
              msg: "用户添加成功",
            });
          } else {
            console.log(44);
            res.send({
              status: 1,
              msg: "添加失败",
            });
          }
        }
      );
    }
  });
});
//添加普通用户接口
admin.post("/addland", mw1, (req, res) => {
  var bool = false;
  console.log(req.body.adminName);
  var sql = "select * from user where userName = ?";
  db.query(sql, req.body.adminName, (err, result) => {
    if (err) console.log(err.message);

    if (result.length == 0) {
      bool = true;
    }

    if (!bool) {
      res.send({
        status: 1,
        msg: "用户名已存在",
      });
    } else {
      var sql = "insert into user(userName,pwd,email) values (?,?,?)";
      db.query(
        sql,
        [req.body.adminName, req.body.pwd, req.body.email],
        (err, result) => {
          if (err) console.log(err.message);
          //成功
          if (result.affectedRows > 0) {
            console.log(33);
            res.send({
              status: 0,
              msg: "用户添加成功",
            });
          } else {
            console.log(44);
            res.send({
              status: 1,
              msg: "添加失败",
            });
          }
        }
      );
    }
  });
});

admin.get("/getInfo", (req, res) => {
  if (req.session.admin.status != 0) {
    return res.send({ status: 1, message: "用户未登录" });
  }
  var sql = "select * from user";
  db.query(sql, (err, result) => {
    if (err) console.log(err.message);
    res.send({
      status: 0,
      message: "success",
      username: req.session.admin.userName,
      adminList: result,
    });
  });
});
admin.get("/del", (req, res) => {
  console.log(req.query);
  var sql = "delete from user where userName = ?";
  db.query(sql, req.query.adminName, (err, result) => {
    if (err) console.log(err.message);
    if (result.affectedRows > 0) {
      res.send({
        status: 0,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 1,
        msg: "删除失败",
      });
    }
  });
});
//更新状态
function updateStatus(status, user) {
  console.log(user);
  var sql = "update user set status = ? where userName = ? ";
  db.query(sql, [status, user.userName], (err, result) => {
    console.log(result);
    if (result.affectedRows === 1) {
      console.log("修改成功");
    }
  });
}

module.exports = admin;
