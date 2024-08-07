// ==UserScript==
// @name         Login Override
// @version      1.0
// @description  Overrides the login function on a given website
// @match        http://pass.sdu.edu.cn/cas/login?*
// @match        https://pass.sdu.edu.cn/cas/login?*
// @match        https://pass-sdu-edu-cn-s.atrust.sdu.edu.cn:81/cas/login?*
// @match        https://pass-sdu-edu-cn.atrust.sdu.edu.cn:81/cas/login?*
// @match        https://webvpn.sdu.edu.cn/https/77726476706e69737468656265737421e0f6528f69236c45300d8db9d6562d/cas/login?*
// @require      https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/2.1.0/fingerprint2.min.js
// @grant        none
// ==/UserScript==
const YOUR_CUSTOM_DEVICE_FINGERPRINT = "SOMETHING_UNIQUE";

(function () {
  "use strict";

  // Override the login function
  function login() {
    var $u = $("#un"),
      $p = $("#pd");

    var u = $u.val();

    if (u == "") {
      $u.focus();
      $u.parent().addClass("login_error_border");
      return;
    }

    var p = $p.val();
    if (p == "") {
      $p.focus();
      $p.parent().addClass("login_error_border");
      return;
    }

    $u.attr("disabled", "disabled");
    $p.attr("disabled", "disabled");

    var lt = $("#lt").val();

    $("#ul").val(u.length);
    $("#pl").val(p.length);
    $("#rsa").val(strEnc(u + p + lt, "1", "2", "3"));
    var details_s = YOUR_CUSTOM_DEVICE_FINGERPRINT;
    var murmur = YOUR_CUSTOM_DEVICE_FINGERPRINT;
    var murmur_s = Fingerprint2.x64hash128(details_s, 31);
    var murmur_md5 = hex_md5(details_s);
    $.post(
      "device",
      {
        d: murmur,
        d_s: murmur_s,
        d_md5: murmur_md5,
        m: "1",
        u: strEnc(u, "1", "2", "3"),
        p: strEnc(p, "1", "2", "3"),
      },
      function (ret) {
        if (ret.info == "validErr" || ret.info == "notFound") {
          location.reload();
        } else if (ret.info == "bind") {
          //二次验证  绑定设备
          $("#phone").val(ret.m);
          phone(murmur_s, details_s);
        } else if (ret.info == "mobileErr") {
          //手机有误
          $("#errormsg2").show().text("尚未绑定手机");
        } else if (ret.info == "binded" || ret.info == "pass") {
          //直接提交
          $("#loginForm")[0].submit();
        }
      },
      "json"
    ).error(function (xhr, status, info) {
      if (is_weixin()) {
      }
    });
  }
  // Override the original login function with the modified one
  window.login = login;
})();
