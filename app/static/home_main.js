//全局
let webAppConfig, //路径配置
    pcWebConfig, //初始化的配置
    gameConfig, //游戏配置
    gameDatas, //彩票游戏数据
    userData, //用户信息
    pageCode = () => {
        return $('body').attr('data-code');
    },
    firmGameCode = {
        YOPLAY: 'YP800',
        XIN: '8',
        AGIN: 0,
        HUNTER: 6,
        KT: 0,
        SBTA: 'TASSPTA',
    }; //匹配每个游戏大厅

/**
 * 页面初始化方法
 * @param opt    webname:网站名称,noticeDom:公告的Dom
 */
function init(opt) {
    pcWebConfig = opt;
    //获得路径配置
    let getPathConfig = function() {
        $.ajax({
            type: 'GET',
            url: '/conf/app_config.json?' + Math.random(),
            dataType: 'json',
            success: function(data) {
                webAppConfig = data;
                console.log('geted app_config');
                getConfig();
            },
            error: function(err) {
                console.log('retry to get app_config');
                setTimeout(getPathConfig, 500);
            }
        });
    }();

    /**
     * 获取后台配置
     */

    function getConfig() {
        //改成json
        $.ajax({
            type: 'GET',
            url: webAppConfig.staticPath + 'data/config.json?' + Math.random(),
            dataType: 'json',
            success: function(data) {
                window.CONFIG_MAP = data;
                console.log('geted config');
                //设置界面配置项
                setDomByConfig();
                //获取图片资源配置项
                getPcImgs();
                //获取公告
                getNotice();
                //获取第三方游戏
                getThirdGames();

            },
            error: function(err) {
                console.log('retry to get config');
                setTimeout(getConfig, 500);
            }
        });
    }

    /**
     * 加载图片资源
     */

    function getPcImgs() {
        $.ajax({
            type: 'GET',
            url: webAppConfig.staticPath + 'data/pc-images.json?' + Math.random(),
            dataType: 'json',
            success: function(data) {
                console.log('geted pc-images');

                try {
                    showSlider(data[1] || []);
                } catch (err) {
                    console.log(err);
                    console.log('错误函数--showSlider');
                }

                try {
                    showActivity(data[4] || []);
                } catch (err) {
                    console.log(err);
                    console.log('错误函数--showActivity');
                }

                try {
                    new initJump(data[6] || []);
                } catch (err) {
                    console.log(err);
                }

                let codeObj = data[3] && data[3].length ? data[3][0] : null;

                if (codeObj) {
                    $(".cfgQRLink1").attr('href', codeObj.imageLink1);
                    $(".cfgQR1").attr('src', CONFIG_MAP['imageLink'] + codeObj.imageName1);
                    $(".cfgQRLink2").attr('href', codeObj.imageLink2);
                    $(".cfgQR2").attr('src', CONFIG_MAP['imageLink'] + codeObj.imageName2);
                }
            },
            error: function(err) {
                console.log('retry to get pc-images');
                setTimeout(getPcImgs, 500);
            }
        });
    }

    /**
     * 按配置设置界面
     * 所有配置项先hide起来
     */

    function setDomByConfig() {

        //email 注册项控制
        if (!parseInt(CONFIG_MAP["showRegEmail"])) {
            $('#showRegEmail').remove();
            $('.showRegEmail').remove();
        } else {
            $('#showRegEmail').show();
            $('.showRegEmail').show();
        }

        //QQ 注册项控制
        if (!parseInt(CONFIG_MAP["showRegQQ"])) {
            $('#showRegQQ').remove();
            $('.showRegQQ').remove();
        } else {
            $('#showRegQQ').show();
            $('.showRegQQ').show();
        }

        //手机 注册项控制
        if (parseInt(CONFIG_MAP["showRegMobile"]) || parseInt(CONFIG_MAP["regSMSOpen"])) {
            $('#showRegMobile').show();
            $('.showRegMobile').show();
        } else {
            $('#showRegMobile').remove();
            $('.showRegMobile').remove();
        }

        //验证码 注册项
        if (!parseInt(CONFIG_MAP["webValiCodeOnOrOff2"])) {
            $('#regValiCode').remove();
            $('.regValiCode').remove();
        } else {
            $('#regValiCode').show();
            $('.regValiCode').show();
        }

        //手机验证码 注册项
        if (!parseInt(CONFIG_MAP["regSMSOpen"])) {
            $('#showMobileCode').remove();
            $('.showMobileCode').remove();

        } else {
            $('#showMobileCode').show();
            $('.showMobileCode').show();
            $('#regValiCode').remove();
            $('.regValiCode').remove();
        }

        //验证码 登陆项
        if (!parseInt(CONFIG_MAP["webValiCodeOnOrOff"])) {
            $('#numberCode').show();
            $('#imgCode').remove();
        } else {
            $('#numberCode').remove();
            $('#imgCode').show();
        }

        //联系方式写入
        $(".cfgMainPhone").html(CONFIG_MAP["mainPhone"]);
        $(".cfgMainCustomerQQ").html(CONFIG_MAP["mainCustomerQQ"]);
        $(".cfgMainAgentQQ").html(CONFIG_MAP["mainAgentQQ"]);
        $(".cfgMainEmail").html(CONFIG_MAP["mainEmail"]);

        //导航地址
        $(".cfgNavUrl").html(CONFIG_MAP["navigationUrl"]);
        //手机版地址写入
        $(".showMobileHref").html(showMobileHref());
        //玩家推广链接
        $(".agentUrlbyuserid").val(getUserAgentUrl()).html(getUserAgentUrl());
        //代理推广链接
        $(".agentUrlbyAgentid").val(getAgentUrl(CONFIG_MAP["exclusiveAgentUrl"])).html(getAgentUrl(CONFIG_MAP["exclusiveAgentUrl"]));
        // 本站地址
        $('.origin').val(window.location.origin).html(window.location.origin);

    }

    /**
     * 加载最新消息数据
     */

    function getNotice() {
        let notice;
        getNotice = function() {
            $.ajax({
                type: 'GET',
                url: webAppConfig.staticPath + 'data/messages.json?' + Math.random(),
                dataType: 'json',
                success: function(data) {
                    window.MESSAGES = data;
                    console.log('geted notice');
                    notice = (MESSAGES.type_4 || []).concat(MESSAGES.type_3) || [];

                    try {
                        showNotice(notice);
                    } catch (err) {
                        console.log(err);
                        console.log('错误函数--showNotice');
                    }

                },
                error: function(err) {
                    console.log('retry to get notice');
                    setTimeout(getNotice, 500);
                }
            });
        }();

    };

    /**
     * 加载第三方游戏
     */

    function getThirdGames() {
        $.ajax({
            type: 'GET',
            url: webAppConfig.staticPath + 'data/thirdgames.json?' + Math.random(),
            dataType: 'json',
            success: function(data) {
                console.log('geted thirdgames');
                gameConfig = data;
                resetData();
            },
            error: function(err) {
                console.log('retry to get thirdgames');
                setTimeout(getThirdGames, 500);
            }
        });

        /**
         * 菜单数据重组
         */
        function resetData() {

            //数据重组
            const gameArr = gameConfig.gameCategories.map((obj) => {
                obj.gameFirm = [];
                for (let key in gameConfig.gameFirmMap) {
                    let gameFirm = gameConfig.gameFirmMap[key];
                    if (obj.gameFirmIds.split(',').indexOf(gameFirm.id.toString()) > -1) {

                        gameFirm.games = gameConfig.thirdDictMap[key] ? gameConfig.thirdDictMap[key] : null;
                        gameFirm.openCode = firmGameCode[gameFirm.firmCode];
                        obj.gameFirm.push(gameFirm);
                    }

                }
                return obj;
            })

            try {
                showNav(gameArr);
            } catch (err) {
                console.log(err);
                console.log('错误函数--showNav');
            }

            //页面区分数据
            const page = pageCode();

            //如果是CP页，去请求cp接口
            if (page == 'CP') {

                //获取CP的游戏配置
                getCpCate().then((data) => {
                    let cateData = data,
                        gameMap = cateData.gameMap;
                    //分类数据重组
                    for (let cate of cateData.gameType) {
                        let openGames = [];
                        cate.games.split(',').map((gameId) => {
                            if (gameId && gameMap[gameId].open == 0) {
                                openGames.push(gameMap[gameId]);
                            }
                        })

                        cate.games = openGames;
                    }

                    try {
                        setCpList(cateData.gameType);
                    } catch (err) {
                        console.log(err);
                    }

                }).catch((err) => {
                    console.log(err);
                })

            } else if (page == 'LIVE') {

                try {
                    setLiveList(util.getObjByKey(gameArr, 'code', 'LIVE')[0]);
                } catch (err) {
                    console.log(err);
                }

            } else if (page == 'BY') {

                try {
                    setByList(util.getObjByKey(gameArr, 'code', 'BY')[0]);
                } catch (err) {
                    console.log(err);
                }

            } else if (page == 'SP') {

                try {
                    setSpList(util.getObjByKey(gameArr, 'code', 'SP')[0]);
                } catch (err) {
                    console.log(err);
                }

            } else if (page == 'DZ') {

                try {
                    setDzList(util.getObjByKey(gameArr, 'code', 'DZ')[0]);
                } catch (err) {
                    console.log(err);
                }

            } else if (page == 'QP') {

                try {
                    setQpList(util.getObjByKey(gameArr, 'code', 'QP')[0]);
                } catch (err) {
                    console.log(err);
                }

            }

            try {
                setTimeout(dataReady, 500);
            } catch (err) {
                console.log(err);
            }
        }

    }

    /**
     * 彩票分类
     */
    function getCpCate() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: webAppConfig.staticPath + 'data/gamedatas-v2.json?' + Math.random(),
                dataType: 'json',
                success: function(data) {
                    resolve(data);
                },
                error: function(err) {
                    reject(err);
                }
            });

        })
    }

    /**
     * 登录状态测试
     */
    if ($.cookie('x-session-token')) {
        getUserInfo((isLogin, data) => {
            try {
                setLogin(isLogin, data);
            } catch (err) {
                console.log('缺少登陆函数');
            }
        }, (isLogin, err) => {
            try {
                setLogin(isLogin, err);
            } catch (err) {
                console.log('缺少登陆函数');
            }
        });
    } else {
        try {
            setLogin(false);
        } catch (err) {
            console.log('缺少登陆函数');
        }
    }
};

/**
 * 彩票读秒
 */
function cpCount(dom) {
    let doms = dom ? $(dom) : $('.gamebox'),
        issueData,
        serverTime,
        reqArr = [],
        reqing = false;

    getCpTime().then((data) => {
        issueData = data;
        write();
    })

    function count() {
        serverTime += 1000;
        //没在请求才启动
        if (reqArr.length && !reqing) {
            getNewData();
        }
        write();
    }

    function getNewData() {
        reqing = true;

        getCpTime().then((data) => {
            for (const key in data) {
                let obj = data[key];
                if (reqArr.indexOf(obj.id) > -1 && new Date(issueData[id].lotteryTime) - serverTime > 0) {
                    reqArr.splice(reqArr.indexOf(obj.id), 1);
                }
            }

            if (reqArr.length) {
                setTimeout(getNewData, 1000)
            } else {
                reqing = false;
            }
        })
    }

    function write() {

        doms.each((index, dom) => {

            let $Dom = doms.eq(index),
                id = $Dom.attr('data-id');

            serverTime = !serverTime ? new Date(issueData[id].serverTime).getTime() : serverTime;

            let issue = issueData[id].issue,
                issueDom = $Dom.find('.issue'),
                leftStamp = new Date(issueData[id].lotteryTime) - serverTime,
                countDom = $Dom.find('.count');


            issueDom.text(issue + '期');

            if (leftStamp > 0) {
                countDom.text(timeFormat(leftStamp));
            } else {
                countDom.text('开奖中');

                //开奖了就加进请求队列
                if (reqArr.indexOf(id) == -1) {
                    reqArr.push(id);
                }
            }

        });

        setTimeout(count, 1000)
    }

    function timeFormat(leftStamp) {

        let lastTime = Math.floor(leftStamp / 1000);

        lastTime = Math.abs(lastTime);

        let hour = Math.floor(lastTime / 3600),
            hours = hour < 10 ? '0' + hour : hour;
        let min = Math.floor(lastTime % 3600 / 60),
            mins = min < 10 ? '0' + min : min;
        let sec = Math.floor(lastTime % 3600 % 60),
            secs = sec < 10 ? '0' + sec : sec;


        if (hour) {
            return hours + ':' + mins + ':' + secs;
        } else if (min) {
            return mins + ':' + secs;
        } else {
            return '00:' + secs;
        }
    }
}

/**
 * 彩票时间获取
 */
function getCpTime() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `/api/getAllNextIssue.do?` + Math.random(),
            dataType: 'json',
            success: function(data) {
                resolve(data);
            },
            error: function(err) {
                reject(err);
            }
        });
    })
}

/**
 * 跳转个人中心
 */

function goCenter(path) {
    if (userData.testFlag) {
        alert('请先注册', 2)
        return;
    }
    layer.open({
        type: 2,
        title: '个人中心',
        shadeClose: true,
        id: 'center',
        shade: false,
        anim: 2,
        maxmin: true, //开启最大化最小化按钮
        area: ['1000px', '704px'],
        content: path||'/center'
    });
}

/**
 * 第三方游戏跳转
 */

function goGame(firmType, gameCode) {
    //未登录处理
    if (!userData) {
        try {
            toLogin(1);
        } catch (err) {
            console.log(err);
            console.log('错误函数--toLogin');
            alert('请先登录',2);
        }
        return;
    } else {
        if (userData.testFlag) {
            next();
            return;
        }
    }
    function next() {
        return openGameWin(firmType, gameCode);
    }

    //cp处理
    if (firmType == 'CP') {
        let newPage = next();
        if (parseInt(CONFIG_MAP.thirdTransferOpen)) {
            autoTransfer('CG')
                .then(() => {
                    // 通知game更新余额
                    newPage.postMessage("_balance_", location.origin)
                })
        }
        return;
    }


    //其他 第三方处理
    if (!CONFIG_MAP.thirdOpen) {
        alert('第三方游戏暂未开启');
        return;
    }

    //自动转账控制
    if (parseInt(CONFIG_MAP.thirdTransferOpen)) {
        next();
        autoTransfer(firmType)
            // .then(() => {
            //     next();
            // })
            // .catch(err => {
                
            // })
        return;
    }

    next();
}
function autoTransfer(inPlat) {
    return new Promise((resolve, reject) => {
        showMsg("转换额度中...", 'loading');
        $.ajax({
            type: 'GET',
            url: `/thirdapi/${inPlat}/autoTransfer.do?${Math.random()}`,
            dataType: 'json',
            success: function(data) {
                showMsg(data.msg || '自动转入成功');
                resolve();
            },
            error: function(err) {
                showMsg(err.responseJSON.msg || '转换失败');
                reject(err);
            }
        });

    })
}

function openGameWin(firmType, gameCode) {
    let newPage;
    // newPage = window.open('about:blank', 'cg',
    //     `   
    //             height=${window.screen.height*.7},
    //             width=${window.screen.width*.8},
    //             left=${window.screen.width*.1},
    //             top=${window.screen.height*.15},
    //             location=0,
    //             menubar=0,
    //             resizable=0,
    //             scrollbars=0,
    //             status=0,
    //             titlebar=0,
    //             toolbar=0
    //         `
    // );

    if (firmType == 'CP') {
        newPage = window.open(window.location.origin + '/game');
        return newPage;
    }else{
        newPage = window.open('about:blank');
    }

    $.ajax({
        type: 'GET',
        url: `/thirdapi/${firmType}/login.do?${Math.random()}`,
        data: {
            gameCode: gameCode || 0
        },
        dataType: 'json',
        success: function(data) {
            if (data.success == true) {
                if (newPage) {
                    newPage.location.href = data.msg;
                } else {
                    alert('页面非正常关闭', 2);
                }
            } else {
                newPage.close();
                alert(data.msg, 2);
            }
        },
        error: function(err) {
            console.log(err);
            newPage.close();
            alert('当前游戏未开启', 2);
        }
    });
}

/**
 * 试玩登陆
 */
function guestLogin() {
    showMsg("正在登录中...", 'loading');
    $.ajax({
        type: 'POST',
        url: '/api/guestLogin.do',
        data: {
            account: '!guest!',
            password: hex_md5('!guest!')
        },
        dataType: 'json',
        success: function(data) {
            if (data && data.token) {
                closeMsg();
                showMsg('登录成功','color');
                setTimeout(function() {
                    window.location.href = './cp.html';
                }, 1000)
            } else {
                alert(data.msg || "登录失败", 2);
            }
        },
        error: function(response) {
            var obj = $.parseJSON(response.responseText + "");
            alert(obj.msg || "登录失败", 2);
        }
    });
}


/**
 * 账号密码登陆
 */

function loginForm() {
    var userName = $('#userName').val();
    if (userName == "") {
        alert("帐号不能为空", 2);
        return false;
    }

    var userPwd = $('#userPwd').val();
    if (userPwd == "") {
        alert("密码不能为空", 2);
        return false;
    }

    let params = {
        account: userName,
        password: hex_md5(userPwd),
        loginSrc: 0
    };
    if ($('#loginVcode').length) {
        let loginVcode = $('#loginVcode').val();

        if (loginVcode == "") {
            alert("验证码不能为空", 2);
            return false;
        }

        if ($('#numberCode').length && loginVcode != $('#numberCode').text()) {
            alert("验证码不匹配", 2);
            return false;
        }

        if ($('#imgCode').length) {
            params.valiCode = loginVcode;
        }
    }

    login(params);
}

function login(params) {
    showMsg("正在登录中...", 'loading');

    $.ajax({
        type: 'POST',
        url: '/api/login.do',
        data: params,
        dataType: 'json',
        success: function(data) {
            if (data && data.token) {
                closeMsg();
                showMsg('登录成功','color');
                setTimeout(function() {
                    window.location.href = './cp.html';
                }, 1000)

            } else {
                alert(data.msg || "登录失败", 2);
                changeImgCode();
                changeNumberCode();
            }
        },
        error: function(response) {
            var obj = $.parseJSON(response.responseText + "");
            alert(obj.msg, 2);
            changeImgCode();
            changeNumberCode();
        }
    });
    return false;
}

/**
 * 退出登陆
 */
function loginOut() {
    confirm('确认退出？', () => {
        $.ajax({
            type: 'GET',
            url: '/api/logout.do',
            success: function(data) {
                if (location.pathname != "index.html") {
                    window.location.href = "index.html";
                } else {
                    location.reload();
                }
            },
            error: function(response) {
                var obj = $.parseJSON(response.responseText + "");
                alert(obj.msg, 2);

            }
        });
    });
}

//代理注册
function agentRegister() {

    //用户名
    var username = $('#username').val();
    if (username == "") {
        alert('账号名称不能为空', 2);
        return;
    }

    var filter = /^[0-9a-zA-Z]{6,15}$/;
    if (!filter.test(username)) {
        alert('用户名6~15位数字或字母', 2);
        return;
    }

    //密码
    var password = $('#password').val();
    var p1 = $('#passwdse').val();

    var filter = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    if (!password || !filter.test(password)) {
        alert('密码为6~20位数字字母组合');
        $('#password').focus();
        return;
    }

    if (password == username) {
        alert('账号与密码不能相同。');
        $('#password').focus();
        return;
    }

    if (password != p1) {
        alert('输入的密码不一致，请重新输入。');
        $('#passwdse').focus();
        return;
    }
    // var password = $('#password').val();
    // var p1 = $('#passwdse').val();
    // if (!password) {
    //     alert('密码不能为空', 2);
    //     return;
    // }

    // if (password.length < 6) {
    //     alert('密码不能小于6个字符。', 2);
    //     return;
    // }

    // if (password.length > 20) {
    //     alert('密码不能大于20个字符。', 2);
    //     return;
    // }

    // if (password != p1) {
    //     alert('输入的密码不一致，请重新输入。', 2);
    //     return;
    // }

    // if (password == username) {
    //     alert('账号与密码不能相同。', 2);
    //     return;
    // }

    //真实姓名
    var fullName = $('#fullName').val();
    if (fullName == "") {
        alert('真实姓名不能为空', 2);
        return;
    }

    var filter = /^[\u4E00-\u9FA5]{2,20}$/;
    if (!filter.test(fullName)) {
        alert('请输入正确的真实姓名', 2);
        return;
    }

    //邮箱
    var email = $('#email').val();
    if ($('#email').length) {
        if (email == "") {
            alert('电子邮箱不能为空', 2);
            return;
        }

        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(email)) {
            alert('您的电子邮件格式不正确', 2);
            return;
        }
    }

    //QQ
    var qq = $('#qq').val();
    if ($('#qq').length) {
        if (qq == "") {
            alert('QQ号码不能为空', 2);
            return;
        }

        var filter = /^[1-9]\d{5,15}$/;
        if (!filter.test(qq)) {
            alert('qq号码不正确', 2);
            return;
        }
    }

    //手机号码
    var phone = $('#phone').val();
    if ($('#phone').length) {
        if (phone == "") {
            alert('手机号码不能为空', 2);
            $('#phone').focus();
            return;
        }

        var filter = /[\d]{11}/;
        if (!filter.test(phone)) {
            alert('手机号码不正确', 2);
            $('#phone').focus();
            return;
        }
    }

    //取款密码
    var fundPwd = null;
    if ($('#fundPwd').length) {
        // 输入方式的提款密码
        fundPwd = $('#fundPwd').val();

        if (fundPwd.length != 4) {
            alert('请设置4位数字取款密码', 2);
            return;
        }
    } else {
        //取款密码
        var pwd1 = $('#pwd1').val();
        var pwd2 = $('#pwd2').val();
        var pwd3 = $('#pwd3').val();
        var pwd4 = $('#pwd4').val();
        if (pwd1 == '-' || pwd2 == '-' || pwd3 == '-' || pwd4 == '-') {
            alert('请设置取款密码', 2);
            return;
        }

        fundPwd = pwd1.toString() + pwd2.toString() + pwd3.toString() + pwd4.toString();
    }

    //同意协议
    if ($("#tycbx").length && !$("#tycbx").is(":checked")) {
        alert("未同意开户条约", 2);
        return;
    }

    //验证码
    var valiCode = $('#valiCode').val();
    if ($('.regValiCode').length || $('#regValiCode').length) {
        if (valiCode.length != 4) {
            alert('请输入验证码。', 2);
            return;
        }
    }

    var data = {
        userName: username,
        password: hex_md5(password),
        fullName: fullName,
        email: email,
        phone: phone,
        qq: qq,
        valiCode: valiCode,
        fundPwd: hex_md5(fundPwd),
        regWay: 2
    };

    showMsg("加盟申请提交中...", 'loading');
    $.ajax({
        type: 'POST',
        url: '/api/agent.do',
        dataType: 'json',
        data: data,
        success: function(data) {
            if (data && data.success) {
                alert('注册成功，请联系管理员审核', 1);
            } else {
                alert(data.msg, 2);
            }

        },
        error: function(response) {
            //var obj = $.parseJSON(response.responseText + "");
            alert(response.msg, 2);
            changeImgCode();

        }
    });
}

//注册
function doRegister() {
    //推荐人
    var superUserName = $('#regRecoUserName').val();
    if ($('#regRecoUserName').hasClass('must') && superUserName == "") {
        alert('推荐人账号必填', 2);
        return;
    }

    //用户名
    var username = $('#regUsername').val();
    if (username == "") {
        alert('账号名称不能为空', 2);
        return;
    }

    var filter = /^[0-9a-zA-Z]{6,15}$/;
    if (!filter.test(username)) {
        alert('用户名6~15位数字或字母', 2);
        return;
    }

    //密码
    var password = $('#regPassword').val();
    var p1 = $('#password1').val();

    var filter = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    if (!password || !filter.test(password)) {
        alert('密码为6~20位数字字母组合');
        $('#regPassword').focus();
        return;
    }

    if (password == username) {
        alert('账号与密码不能相同。');
        $('#regPassword').focus();
        return;
    }

    if (password != p1) {
        alert('输入的密码不一致，请重新输入。');
        $('#password1').focus();
        return;
    }
    // var password = $('#regPassword').val();
    // var p1 = $('#password1').val();
    // if (!password) {
    //     alert('密码不能为空', 2);
    //     return;
    // }

    // if (password.length > 20) {
    //     alert('密码不能大于20个字符。', 2);
    //     return;
    // }

    // if (password.length < 6) {
    //     alert('密码不能小于6个字符。', 2);
    //     return;
    // }

    // if (password != p1) {
    //     alert('输入的密码不一致，请重新输入。', 2);
    //     return;
    // }

    // if (password == username) {
    //     alert('账号与密码不能相同。', 2);
    //     return;
    // }

    //真实姓名
    var fullName = $('#fullName').val();
    if (!fullName) {
        alert('真实姓名不能为空', 2);
        return;
    }

    var filter = /^[\u4E00-\u9FA5]{2,20}$/;
    if (!filter.test(fullName)) {
        alert('请输入正确的真实姓名', 2);
        return;
    }

    //邮箱
    var email = $('#email').val();
    if ($('#email').length) {
        if (email == "") {
            alert('电子邮箱不能为空', 2);
            return;
        }

        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(email)) {
            alert('您的电子邮件格式不正确', 2);
            return;
        }
    }

    //QQ
    var qq = $('#qq').val();
    if ($('#qq').length) {
        if (qq == "") {
            alert('QQ号码不能为空', 2);
            return;
        }

        var filter = /^[1-9]\d{5,15}$/;
        if (!filter.test(qq)) {
            alert('qq号码不正确', 2);
            return;
        }
    }

    //手机号码
    var phone = $('#phone').val();
    if ($('#phone').length) {
        if (phone == "") {
            alert('手机号码不能为空', 2)
            return;
        }

        var filter = /[\d]{11}/;
        if (!filter.test(phone)) {
            alert('手机号码不正确', 2);
            return;
        }
    }

    //手机验证码
    var smsText = $('#smsText').val();
    if ($('#smsText').length) {
        if (smsText == "") {
            alert('请输入手机验证码', 2);
            return;
        }
    }

    //提款密码
    var fundPwd = null;
    if ($('#fundPwd').length) {
        // 输入方式的提款密码
        fundPwd = $('#fundPwd').val();

        if (fundPwd.length != 4) {
            alert('请设置4位数字取款密码', 2);
            return;
        }
    } else {

        //取款密码
        var pwd1 = $('#pwd1').val();
        var pwd2 = $('#pwd2').val();
        var pwd3 = $('#pwd3').val();
        var pwd4 = $('#pwd4').val();
        if (pwd1 == '-' || pwd2 == '-' || pwd3 == '-' || pwd4 == '-') {
            alert('请设置取款密码', 2);
            return;
        }

        fundPwd = pwd1.toString() + pwd2.toString() + pwd3.toString() + pwd4.toString();
    }

    //验证码
    var valiCode = $('#valiCode').val();
    if ($('.regValiCode').length || $('#regValiCode').length) {
        if (valiCode.length != 4) {
            alert('请正确输入验证码。', 2);
            return;
        }
    }

    var data = {
        userName: username,
        password: hex_md5(password),
        superUserName: superUserName,
        fullName: fullName,
        email: email,
        phone: phone,
        qq: qq,
        fundPwd: hex_md5(fundPwd),
        valiCode: valiCode,
        regWay: 2,
        smsText: smsText
    }


    //协议
    if ($("#tycbx").length && !$("#tycbx").is(":checked")) {
        alert("未同意开户条约", 2);
        return;
    }

    showMsg("注册信息提交中...", 'loading');

    $.ajax({
        type: 'POST',
        url: '/api/reg.do',
        //      dataType : 'json',
        data: data,
        success: function(data) {
            $.cookie('token', data);
            $.removeCookie('att');
            $.removeCookie('user');
            showMsg("注册成功",'color');
            setTimeout(function() {
                window.location.href = './cp.html';
            }, 1000)

        },
        error: function(response) {
            var obj = $.parseJSON(response.responseText + "");
            alert(obj.msg, 2);
            changeImgCode();
        }
    });
}


/**
 * 用户信息获取,测试登陆状态
 */
function getUserInfo(successFuc, errFuc) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/api/init.do',
        success: function(data) {
            userData = data;
            if (successFuc) {
                successFuc(true, data);
            }
        },
        error: function(response) {
            var err = $.parseJSON(response.responseText + "");
            if (errFuc) {
                errFuc(false, err);
            }

        }
    });
}

/**
 * 获取额度
 * firmType
 * dom
 */
function getBlance(firmType, cb, errCb) {
    if (firmType == 'CG') {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: `/game/getLotteryData.do`,
            success: function(data) {
                cb(data);
            },
            error: function(err) {
                errCb(err);
            }
        });


    } else {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: `/thirdapi/${firmType}/getBalance.do`,
            success: function(data) {
                cb();
            },
            error: function(err) {
                errCb(err);
            }
        });
    }
}

/**
 * 假验证码
 */
function changeNumberCode() {
    var codeDom = document.getElementById('numberCode');
    if (!codeDom) {
        return;
    }

    var number = '';
    for (var i = 0; i < 4; i++) {
        number += parseInt(Math.random() * 10);
    }
    codeDom.innerHTML = number;
}

/**
 * 真验证码跳出窗口
 */
// var showLoginValiCode = function(opt) {
//     this.params = opt.params;
//     this.init();
// }

// showLoginValiCode.prototype.init = function() {
//     this.createDom();
// }

// showLoginValiCode.prototype.createDom = function() {
//     var that = this;
//     var html = '<div id="authjumpbox">' +
//         '<p style="background: #ebf5ff;padding: 0 5px;line-height: 28px;color: #013295;font-size: 12px;">为保护您的账号安全，本次登录需输入验证字符。</p>' +
//         '<p style="margin:10px 0 20px 0;position:relative;">' +
//         '<input maxlength="4" id="jumpvaliCode" autocomplete="off" style="text-indent: 10px;color: #000;display: block;width: 100%;border: 1px solid #ccc;height: 38px;box-sizing: border-box;" type="text" placeholder="请输入验证码" />' +
//         '<img src="" class="imgCode" title="点击更换" style="position: absolute;right: 1px;left:auto;left: auto;bottom: auto;top: 1px;height: 36px;cursor: pointer;"></p>' +
//         '<p style="text-align: center;">' +
//         '<a href="javascript:;" class="close" style="background: #d6d6d6;color: #333;display: inline-block;width: 40%;height: 36px;border-radius: 30px;line-height: 36px;font-size: 16px;margin: 0 10px;">取消</a>' +
//         '<a href="javascript:;" class="submit" style="background: #37a0e3;color: #fff;display: inline-block;width: 40%;height: 36px;border-radius: 30px;line-height: 36px;font-size: 16px;margin: 0 10px;">确认</a>' +
//         '</p>' +
//         '</div>';

//     layer.open({
//         content: html,
//         title: '',
//         btn: null,
//         closeBtn: 0
//     });

//     changeImgCode();
//     this.setCtrl();
// }

// showLoginValiCode.prototype.setCtrl = function() {
//     var that = this;
//     $('#jumpvaliCode').focus();

//     $('#authjumpbox .close').one('click', function() {
//         closeMsg();
//     })

//     $('#authjumpbox .submit').one('click', function() {
//         that.submit();
//     })

//     $('#jumpvaliCode').on('keypress', function(e) {
//         if (e.keyCode == 13) {
//             $('#jumpvaliCode').unbind();
//             that.submit();
//         }
//     })
// }

// showLoginValiCode.prototype.submit = function() {
//     var valiCode = $('#jumpvaliCode').val();
//     if (valiCode.length != 4) {
//         alert("请正确填写验证码", 2);
//         $('#jumpvaliCode').focus();
//         return false;
//     }

//     this.params.valiCode = valiCode;
//     login(this.params);

// }

//更换后端验证码
function changeImgCode(dom) {
    if ($('.imgCode').length == 0) {
        return;
    }
    var dom = dom ? dom : $('.imgCode');
    dom.attr('src', '/api/getValidateCode.do?_=' + Math.random());
}



//公共函数

/**
 * 右键禁止
 */
document.oncontextmenu = function(e) {
    e.preventDefault();
};
$(document).mousedown(function(e) {
    if (e.button == 2) {

    }
})


/**
 * 显示手机链接
 */

function showMobileHref() {
    return location.origin + '/mobile';
}


/**
 * 微信客服
 */
function openWxWin() {
    if (!CONFIG_MAP || !CONFIG_MAP.mainWxUrl) {
        alert("客服微信未配置，请联系管理员", 2);
        return;
    }
    window.open(CONFIG_MAP.mainWxUrl);
}

/**
 * 在线客服
 */
function BBOnlineService() {
    console.log(CONFIG_MAP)
    if (!CONFIG_MAP || !CONFIG_MAP.zxkfUrl) {
        alert("客服未配置，请联系管理员", 2);
        return;
    }

    var agentFlag = $.cookie('agent'),
        osUrl;

    if (agentFlag && agentFlag == 1 && CONFIG_MAP.agentZxkfUrl) {
        osUrl = CONFIG_MAP["agentZxkfUrl"];
    } else {
        osUrl = CONFIG_MAP["zxkfUrl"];
    }

    window.open(osUrl, 'Service', "width=1039,height=728,status=no,scrollbars=no");

}


/**
 * QQ客服
 */
function qqService() {
    if (!CONFIG_MAP || !CONFIG_MAP.mainCustomerQQ && !CONFIG_MAP.mainQQUrl) {
        alert("客服QQ未配置，请联系管理员", 2);
        return;
    }
    var link = CONFIG_MAP.mainQQUrl ? CONFIG_MAP.mainQQUrl : 'http://wpa.qq.com/msgrd?v=3&uin=' + CONFIG_MAP["mainCustomerQQ"] + '&site=web&menu=yes';
    window.open(link);
}

/**
 * 代理QQ客服
 */
function agentService() {
    if (!CONFIG_MAP || !CONFIG_MAP.mainAgentQQ) {
        alert("代理qq未配置，请联系管理员", 2);
        return;
    }
    window.open('http://wpa.qq.com/msgrd?v=3&uin=' + CONFIG_MAP.mainAgentQQ + '&site=web&menu=yes');
}

/**
 * 发客服邮箱
 */
function emailService() {
    if (!CONFIG_MAP || !CONFIG_MAP.mainEmail) {
        alert("邮箱未配置，请联系管理员", 2);
        return;
    }
    window.location.href = ('mailto:' + CONFIG_MAP["mainEmail"]);
}

/**
 * 取回密码
 */
function getPwd() {
    alert("帐户密码遗失请与在线客服联系！");
}

// 导航网
function navigation() {
    if (!CONFIG_MAP || !CONFIG_MAP.navigationUrl) {
        alert("导航未配置，请联系管理员", 2);
        return;
    }
    window.open(CONFIG_MAP.navigationUrl);
}

// 直播网
function kjzb() {
    if (!CONFIG_MAP || !CONFIG_MAP.showKjzb) {
        alert("客服QQ未配置，请联系管理员", 2);
        return;
    }
    window.open(CONFIG_MAP.showKjzb);
}

/**
 * 获取用户推广地址
 * @returns {String}
 */
function getUserAgentUrl() {
    var user_url = document.location.protocol + '//' + location.hostname + '/?user=替换成您的会员账号';
    return user_url;
};

/**
 * 获取代理推广地址
 * @returns {String}
 */
function getAgentUrl() {

    var arg = arguments[0],
        intr_url;

    if (arg && arg != null) {
        intr_url = arg + '/?att=替换成您的代理账号';
    } else {
        intr_url = document.location.protocol + '//' + location.hostname + '/?att=替换成您的代理账号';
    }

    return intr_url;
};


/**
 * 打开代理登录页面
 */
function agentLogin() {
    window.open('/agent/login.html');
};

/**
 * 转向手机端
 */

function toMobile() {
    window.open(location.origin + '/mobile');
}

/**
 * 显示手机链接
 */

function showMobileHref() {
    return location.origin + '/mobile';
}


/**
 * 设为首页
 */

function addFavoriteHome(obj, url) {
    try {
        obj.style.behavior = 'url(#default#homepage)';
        obj.setHomePage(url);
    } catch (e) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'", 2);
            }
        } else {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【" + url + "】设置为首页。", 2);
        }
    }
}

/**
 * 页面收藏
 */

function AddFavorite(title, url) {
    try {
        window.external.addFavorite(url, title);
    } catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
        } catch (e) {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加", 2);
        }
    }
}

//改装tip
//type:loading 加载，没有type就没有图标
window.showMsg = (msg, type) => {
    let opt = {};

    switch (type) {
        case 'loading':
            opt = { icon: 16, title: '', btn: null, time: 30, shade: [0.3, '#ccc'], shadeClose: true };
            break;
        case 'color':
            msg = `<span style="color:#fff">${msg}</span>`;
            opt = {title: '', btn: null, time: 2000};
            break;   
        default:
            opt = { title: '', btn: null, time: 2000 };
    }
    layer.msg(msg, opt);
}

window.closeMsg = () => {
    layer.closeAll('dialog');
}

//改装alert
//type1,正确 type2,错误
window.alert = (msg, type) => {
    let opt = {};

    switch (type) {
        case 1:
            opt = { icon: type, title: '提示', shadeClose: true };
            break;
        case 2:
            opt = { icon: type, title: '', btn: null, shadeClose: true };
            break;
        default:
            opt = { title: '', btn: null, shadeClose: true };
    }

    layer.alert(msg, opt);
}

//改装confirm
//传个回调操作
window.confirm = (msg, cb) => {
    const opt = { icon: 3, title: '提示', btn: ['确认', '取消'], shadeClose: true };
    layer.alert(msg, opt, (index) => {
        layer.close(index);
        cb();
    });
}


//临时绑定enter做处理,只执行一次，如果不传回调无法执行
function tempBindEnter(func) {

    if (!func) {
        console.log('arguments miss');
        return;
    }

    var that = $(this);
    that.keydown(function(e) {
        that.unbind();
        var key = window.event ? e.keyCode : e.which;
        if (key.toString() == "13") {
            func();
            return false;
        }

    });
}


//pc广告弹窗
var initJump = function(data) {
    this.data = data;
    this.init();
};

initJump.prototype.init = function() {
    if (!this.data || !this.data.length) {
        return;
    }

    if (localStorage.getItem('jpImgUrlPc') == this.data[0].imageName1) {
        return;
    }

    this.createDom();
}

initJump.prototype.createDom = function() {
    var that = this;

    var html = '<div id="adjumpbox" style="position:fixed;width:100%;height:100%;left:0;top:0;z-index: 19880808;background:rgba(0,0,0,.3)">' +
        '<div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);width: 600px;">' +
        '<a  href="' + this.data[0].imageLink + '" target="_blank">' +
        '<img style="width:100%" src="' + CONFIG_MAP.imageLink + this.data[0].imageName1 + '" alt="" />' +
        '</a>' +
        '<div class="close" style="color: #fff;background: #333;position: absolute;right: 0;top: 0;width: 30px;height: 30px;line-height: 30px;text-align: center;border-radius: 50%;cursor: pointer;border: 1px solid #fff;">X</div>' +
        '</div>' +
        '</div>';

    $('body').append(html);

    $('body').on('click', '#adjumpbox .close', function() {
        $('#adjumpbox').remove();
        localStorage.setItem('jpImgUrlPc', that.data[0].imageName1);
    })

    $('body').on('mouseenter', '#adjumpbox .close', function() {
        $(this).css({ 'background': '#fff', 'color': '#666' });
    })

    $('body').on('mouseleave', '#adjumpbox .close', function() {
        $(this).css({ 'background': '#333', 'color': '#fff' });
    })
}

/**
 * 绑定加载后的事件
 */
$(function() {
    var urlPara = HttpUtil.GetUrlPara(),
        intr = urlPara.att || urlPara.intr || '';

    if (intr) {
        $('#recoTr').hide();
        $.cookie('att', intr);
        $.removeCookie('user');
        $('#regRecoUserName').val(intr);
        $('#regRecoUserName').removeClass('must');
    } else if (urlPara.user) {
        $.cookie('user', urlPara.user);
        $.removeCookie('att');
        $('#regRecoUserName').val(urlPara.user).attr('readonly', 'readonly');
        $('#recoTr').show();
        $('#regRecoUserName').removeClass('must');
    } else {
        var cookieIntr = $.cookie('att'),
            cookieUser = $.cookie('user');

        if (cookieIntr) {
            $('#recoTr').hide();
            $.removeCookie('user');
            $('#regRecoUserName').val(cookieIntr);
            $('#regRecoUserName').removeClass('must');
        } else if (cookieUser) {
            $('#regRecoUserName').val(cookieUser).attr('readonly', 'readonly');
            $('#recoTr').show();
            $('#regRecoUserName').removeClass('must');
        }
    }

    $('body').on('click', '.imgCode', function() {
        changeImgCode($(this));
    });
    changeImgCode();

    $('#numberCode').click(function() {
        changeNumberCode();
    });
    changeNumberCode();
});