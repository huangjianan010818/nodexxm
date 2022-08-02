function ajax(options) {
  //默认值
  let defaults = {
    type: "get",
    url: "",
    async: true,
    data: {},
    header: {
      "content-Type": "application/x-www-form-urlencoded",
    },
    success: function () {},
    error: function () {},
  };
  //使用用户传递参数替换默认值的参数
  Object.assign(defaults, options);
  //创建ajax对象
  let xhr = new XMLHttpRequest();
  //参数拼接变量
  let params = "";
  for (var attr in defaults.data) {
    //参数拼接
    params += attr + "=" + defaults.data[attr] + "&";
  }
  //去掉参数中最后一个&
  params = params.substr(0, params.length - 1);

  //如果请求方式是get
  if (defaults.type == "get") {
    //将参数拼接在URL地址后面
    defaults.url += "?" + params;
  }
  //配置ajax请求
  xhr.open(defaults.type, defaults.url, defaults.async);
  //如果请求方式是post
  if (defaults.type == "post") {
    //设置请求头信息
    xhr.setRequestHeader("content-Type", defaults.header["content-Type"]);
    //如果想服务器端传递的参数类型为json
    if (defaults.header["content-Type"] == "application/json") {
      //将json对象转成json字符串
      xhr.send(JSON.stringify(defaults.data));
    } else {
      xhr.send(params);
    }
  } else {
    xhr.send();
  }
  //请求加载完成
  xhr.onload = function () {
    //获取服务器端返回的数据类型
    var contentType = xhr.getAllResponseHeaders("content-type");
    //获取服务器端返回的响应数据
    var responseText = xhr.responseText;
    //如果服务器端返回的数据是json类型
    if (contentType.includes("application/json")) {
      //将json字符串转换为json对象
      responseText = JSON.parse(responseText);
    }
    if (xhr.status == 200) {
      //调用成功的回调函数,并将结果传递给函数
      defaults.success(responseText, xhr);
    } else {
      //调用失败的回调函数，将xhr对象传递给回调函数
      defaults.error(responseText, xhr);
    }
    //当网络中断时
    xhr.onerror = function () {
      defaults.error(xhr);
    };
  };
}
