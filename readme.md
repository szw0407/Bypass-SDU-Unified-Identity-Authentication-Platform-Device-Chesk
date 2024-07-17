# Bypass device check on SDU UAP website

让山东大学统一身份认证网站的登录更加方便！

在2023年，山东大学终于引入了2FA（双因素认证）机制，但是统一身份认证网站简直就是一个屎山，存在各种细节上的问题，使得这个安全性保障事实上是非常难以使用的。他存在以下几个问题：

1. 设备检查基于浏览器指纹：也就是说，对于任何浏览器只要有浏览器内核更新或者一些参数变化，都会直接导致指纹改变，从而经常需要重新绑定；但是由于绑定设备上限是20个，还会影响之前已经绑定过的指纹，实际上就毫无“信任设备”的能力；
2. 经常无法正常使用WebVPN和零信任访问：由于WebVPN和零信任访问会导致域名变化，从而导致`Fingerprint2`等库无法正常加载（可能受到 CORS 限制），从而无法登录；
3. 无法正常使用广告拦截插件：由于广告拦截插件会阻止一些跟踪脚本的加载，从而导致`Fingerprint2`库无法正常加载，也无法正常弹出输入验证码的对话框，从而无法登录。已经发现，Ublock Origin, AdGuard, Adblock Plus等插件都会导致这个问题；

此外，事实上这个网站还存在一些安全性的问题，比如加密算法使用的是DES，而经常被拉起的是HTTP而不是HTTPS的站点，这都很容易被中间人攻击而影响安全性。当然这个就不在本脚本能解决的范围内了。

脚本用于绕过 SDU [统一身份认证网站](https://pass.sdu.edu.cn)的设备检查，使得可以通过用户自己指定一个浏览器“指纹”来登录，从而让升级浏览器、更换设备或浏览器等操作变得更加方便——无需再次接受短信验证码了！

同时，由于使用[WebVPN](https://webvpn.sdu.edu.cn)等网站，或者使用Ublock Origin等广告拦截插件，可能会使得在部分情况下，登录所需的`Fingerprint2`库无法正常加载，导致无法登录。这个脚本也可以解决这个问题。

## 使用方法

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或其他用户脚本管理器
2. 创建新脚本
3. 将 `main.js` 中的内容复制到新脚本中
4. 修改最上面的`YOUR_CUSTOM_DEVICE_FINGERPRINT`，作为你自定义的设备指纹
5. 保存

## 注意事项

- 建议不要将你的设备指纹分享给他人，也强烈建议不要使用默认的设备指纹
- 建议第一次在不使用WebVPN、广告拦截插件的情况下先使用这个脚本登录信息服务平台，在登录过程中绑定设备指纹，然后就可以正常使用WebVPN、开启广告拦截插件或者更新浏览器，而不需要重新绑定了
- 如果你的设备指纹被更改，你需要重新绑定设备指纹
- 如果更换了设备和浏览器，也需要将指纹更换成你之前绑定过的那一个——或者重新绑定一个新设备指纹
