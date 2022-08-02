function jsonp(options) {
  //动态创建script标签
  var script = document.createElement("script");
  //拼接字符串变量
  var parames = "";
  for (var attr in options.data) {
    parames += "&" + attr + "=" + options.data[attr];
  }
  var fnName = "myjsonp" + Math.random().toString().replace(".", "");
  //把fnName函数变为全局函数
  window[fnName] = options.success;
  //srcipt标签添加src属性
  script.src = options.url + "?callback=" + fnName + parames;
  //把srcipt标签放入到页面中
  document.body.appendChild(script);
  //给script标签添加onload事件
  script.onload = function () {
    document.body.removeChild(script);
  };
}
