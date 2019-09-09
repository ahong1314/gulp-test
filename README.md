编辑目录   ./app
输出目录   ./platform

启动全体编辑模式：  根目录下运行 npm start 根据提示输入想要编辑的包名，如必发  输入bf

单独快速编辑模式：  npm run dev 项目名 例：npm run dev bf

编辑模式下修改app包内任意文件,实时显示到浏览器

启动打包模式：  根目录下运行 run run build 项目名  例：npm run build bf

————————————————————————————————————————————————————————————————
参数配置：
————————————————————————————————————————————————————————————————
显示信息类：

客服电话：.cfgMainPhone
客服QQ：.cfgMainCustomerQQ
代理QQ：.cfgMainAgentQQ
客服邮箱：.cfgMainEmail
导航地址：.cfgNavUrl
手机版地址：.showMobileHref
玩家推广链接：.agentUrlbyuserid  //支持val,html
代理推广链接：.agentUrlbyAgentid //支持val,html
本站地址：.origin
app二维码：.cfgQR  //只支持img
app二维码链接：.cfgQRLink  //嵌套在二维码外的A标签

————————————————————————————————————————————————————————————————
跳转类：（优先使用A标签）

微信客服：openWxWin()
在线客服：BBOnlineService()
QQ客服：qqService()
代理QQ：agentService()
发客服邮件：emailService()
忘记密码：getPwd()
导航网：navigation()
直播网：kjzb()
试玩登陆：guestLogin()
代理登陆：agentLogin()
跳转手机版：toMobile()

————————————————————————————————————————————————————————————————
功能类：
设为首页：addFavoriteHome(this,window.location.host)
页面收藏：AddFavorite('名称',window.location.href)
————————————————————————————————————————————————————————————————
注册显示类
邮箱 .showRegEmail/#showRegEmail
QQ   .showRegQQ/#showRegQQ
手机  .showRegMobile/#showRegMobile
图片验证码 .regValiCode/#regValiCode
手机验证码 .showMobileCode/#showMobileCode

————————————————————————————————————————————————————————————————
必须设置的函数

活动写入：showActivity //arguments[0]为活动数组
首页轮播图：showSlider //arguments[0]为轮播图数组
公告显示：showNotice 	 //arguments[0]为公告数组
头部菜单：showNav //arguments[0]为菜单数组
登陆处理：logined //arguments[0]为登陆是否成功，arguments[1]为用户信息，登陆成功时才存在

初始化函数
init({
  webName: "必发"
});









