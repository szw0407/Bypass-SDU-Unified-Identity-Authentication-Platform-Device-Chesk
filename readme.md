# Bypass device check on SDU UAP website

脚本用于绕过 SDU [统一身份认证网站](https://pass.sdu.edu.cn)的设备检查，使得可以通过用户自己指定一个浏览器“指纹”来登录，从而让升级浏览器、更换设备或浏览器等操作变得更加方便——无需再次接受短信验证码了！

## 使用方法

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或其他用户脚本管理器
2. 创建新脚本
3. 将 `main.js` 中的内容复制到新脚本中
4. 修改最上面的`YOUR_CUSTOM_DEVICE_FINGERPRINT`，作为你自定义的设备指纹
5. 保存
