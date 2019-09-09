//数据加载结束的调用
function dataReady() {
    $('#loadingWrapper').fadeOut();
}

//公告
function showNotice(notice) {
    let noticeDom = $("#noticeDom");

    if (!noticeDom.length || !notice.length) {
        return;
    }

    if (notice.length) {
        let html = '<marquee scrollamount="4" scrolldelay="30" onmouseover="this.stop();" onmouseout="this.start();" >';
        for (let i = 0; i < notice.length; i++) {
            html += notice[i].title + '：&nbsp;&nbsp;&nbsp;&nbsp;' + notice[i].message + '&nbsp;&nbsp;&nbsp;&nbsp;';
        }

        html += '</marquee>';
        noticeDom.html(html);
    } else {
        noticeDom.html('<marquee scrollamount="4" scrolldelay="30" onmouseover="this.stop();" onmouseout="this.start();" >欢迎来到' + pcWebConfig.webName + '</marquee>');
    }
}

//轮播图
function showSlider(imgs) {
    let lbDom = $('#lb_box .swiper-wrapper');

    if (!lbDom.length || !imgs.length) {
        return;
    }

    var sliderHtml = $(imgs.map(function(img) {
        return '<div class="swiper-slide"><img src="' + CONFIG_MAP['imageLink'] + img.imageName1 + '"></div>'
    }).join(''));

    lbDom.html(sliderHtml);

    if (imgs.length > 1) {
        //swiper
        var swiper = new Swiper('.swiper-hall', {
            grabCursor: true, //鼠标手势
            updateOnImagesReady: true, //所有图加载完成后init
            effect: 'fade',
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });

        $(".swiper-container").mouseenter(function() {
            swiper.autoplay.stop();
        }).mouseleave(function() {
            swiper.autoplay.start();
        });

    }
}

//活动
function showActivity(atvList) {

    let actiDom = $('#actiList');

    if (!actiDom.length || !atvList.length) {
        return;
    }

    let atvsHtml = $('<ul>');


    atvsHtml.append(atvList.map((atv) => {
        console.log(atv)
        return ['<li>',
            '<div class="item">',
            '<div class="pic">',
            '<img src="' + CONFIG_MAP['imageLink'] + atv.imageName1 + '">',
            '</div>',
            '<div class="drop hide">',
            '<img src="' + CONFIG_MAP['imageLink'] + atv.imageName2 + '">',
            '</div>',
            '</div>',
            '</li>'
        ].join('');
    }).join(''));

    actiDom.html(atvsHtml);

    //activty slider
    var $actPic = $('#actiList li .pic')

    $actPic.on('click', function() {
        $(this).next('.drop').slideToggle();
    })
}

function showNav(navList) {

    //写死的菜单来动态加下拉
    for (let obj of navList) {
        let gameCateDom = $('#gameMenu .gameCate');
        let firm = obj.gameFirm;

        for (let j = 0; j < gameCateDom.length; j++) {
            let dom = gameCateDom.eq(j);

            if (obj.code == dom.attr('data-code')) {

                //解析子类
                if (firm.length) {
                    let html = '<div class="drop">';
                    firm.map(obj => {
                        if (!obj.open) {
                            html += `
                                <a href="javascript:goGame('${obj.firmType}','${obj.openCode}');">
                                    <span class="gameicon"><img src="/static/img/firmicons/${obj.firmType.toLocaleLowerCase()}.png" alt="${obj.firmName}"></span>
                                    <span class="firmname">${obj.firmName}</span>
                                </a>
                            `;
                        }

                    })

                    html += `</div>`;

                    dom.append(html);
                }

                break;
            }
        }
    }


    //完全根据服务端来设置菜单
    // for (let obj of navList) {
    //     let gameCateDom = $('#gameMenu .gameCate');
    //     let firm = obj.gameFirm;

    //     for (let j = 0; j < gameCateDom.length; j++) {
    //         let dom = gameCateDom.eq(j);

    //         if (obj.code == dom.attr('data-code')) {

    //             //解析子类
    //             if (firm.length) {
    //                 let html = '<div class="drop">';
    //                 firm.map(obj => {

    //                     html += `
    //                         <a href="javascript:goGame('${obj.firmType}');">
    //                             <span class="gameicon"><img src="/static/img/firmicons/${obj.firmCode.toLocaleLowerCase()}.png" alt="${obj.firmName}"></span>
    //                             <span class="firmname">${obj.firmName}</span>
    //                         </a>
    //                     `;
    //                 })

    //                 html += `</div>`;

    //                 dom.append(html);
    //             }

    //             dom.show();
    //             gameCateDom.eq(gameCateDom.length - 1).after(dom[0].outerHTML)
    //             dom.remove();
    //             break;
    //         }
    //     }
    // }

}

function setCpList(cateArr) {
    let tabHtml = ``,
        mainHtml = ``;

    for (const key in cateArr) {
        const cate = cateArr[key];

        tabHtml += `
                <a class="${key == 0 ? 'active' : '' }" href="javascript:;">
                    <p>${cate.name}</p>
                    <span></span>
                </a>
            `;

        if (cate.games) {
            mainHtml += `
                <div class="item ${key != 0 ? 'hide' : '' }">`;
            for (const game of cate.games) {
                mainHtml += `
                    <div class="gamebox" data-id="${game.id}">
                        <div class="logo fl">
                            <img src="/static/img/gameicons/cp/${game.code}.png" alt="${game.name}">
                        </div>
                        <div class="info fl">
                            <p class="f18">${game.name}</p>
                            <p class="issue">--------</p>
                            <p class="count">--:--:--</p>
                        </div>
                        <a  href="javascript:goGame('CP');" class="btn">立即投注</a>
                    </div>
            `;
            }
            mainHtml += `</div>`;
        } else {
            mainHtml += `<div class="item none">暂无可用游戏</div>`;
        }
    }

    $('.tabctrl').html(tabHtml);
    $('.tabmain').html(mainHtml);

    cpCount('.gamebox'); //这里不传也是这个dom

}

function setLiveList(cateData) {
    let firms = cateData.gameFirm,
        html = ``;
    for (let firm of firms) {
        if (firm.open) {
            continue;
        }
        html += `
            <div class="swiper-slide">
            <div class="wrap">
                <div class="pic">
                    <img src="img/thirdicons/firmiconsdetail/live/${firm.firmCode.toLocaleLowerCase()}.png" alt="${firm.firmName}">
                </div>
                <a href="javascript:goGame('${firm.firmType}','${firm.openCode}');" class="link">
                    <p>开始游戏</p>
                    <p>ENTER</p>
                </a>
            </div>
            </div>`;
    }

    html += `
    <div class="swiper-slide">
        <div class="wrap">
            <div class="pic">
                <img src="img/thirdicons/firmiconsdetail/live/hold_on.png" alt="">
            </div>
        </div>
    </div>
    `;

    $('#listlive').html(html);
    if (firms.length >= 2) {
        var swiper = new Swiper('.swiper-live', {
            slidesPerView: '3',
            spaceBetween: 10,
            loop: true,
            speed: 3000,
            grabCursor: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
        });
    } else {
        var swiper = new Swiper('.swiper-live', {
            slidesPerView: '2',
            spaceBetween: 0,
            loop: false,
        });
    }
}

function setByList(cateData) {
    let firms = cateData.gameFirm,
        html = ``;
    for (let firm of firms) {

        if (firm.open) {
            continue;
        }

        html += `
            <div class="swiper-slide">
            <div class="wrap">
                <div class="pic"><img src="img/thirdicons/firmiconsdetail/by/${firm.firmCode.toLocaleLowerCase()}.png" alt="${firm.firmName}"></div>
                <a href="javascript:goGame('${firm.firmType}','${firm.openCode}');" class="link">
                    <p>开始游戏</p>
                    <p>ENTER</p>
                </a>
            </div>
            </div>`;

    }

    html += `
    <div class="swiper-slide">
        <div class="wrap">
            <div class="pic">
                <img src="img/thirdicons/firmiconsdetail/by/hold_on.png" alt="">
            </div>
        </div>
    </div>
    `;

    $('#listby').html(html);
    if (firms.length >= 2) {
        var swiper = new Swiper('.swiper-by', {
            slidesPerView: '3',
            spaceBetween: 10,
            loop: true,
            speed: 3000,
            grabCursor: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
        });
    } else {
        var swiper = new Swiper('.swiper-by', {
            slidesPerView: '2',
            spaceBetween: 0,
            loop: false,
        });
    }
}

function setSpList(cateData) {
    let firms = cateData.gameFirm,
        html = ``;
    for (let firm of firms) {

        if (firm.open) {
            continue;
        }

        html += `
            <div class="swiper-slide">
            <div class="wrap">
                <div class="pic"><img src="img/thirdicons/firmiconsdetail/sp/${firm.firmCode.toLocaleLowerCase()}.png" alt="${firm.firmName}"></div>
                <a href="javascript:goGame('${firm.firmType}','${firm.openCode}');" class="link">
                    <p>开始游戏</p>
                    <p>ENTER</p>
                </a>
            </div>
            </div>`;

    }

    html += `
    <div class="swiper-slide">
        <div class="wrap">
            <div class="pic">
                <img src="img/thirdicons/firmiconsdetail/sp/hold_on.png" alt="">
            </div>
        </div>
    </div>
    `;

    $('#listsp').html(html);

    if (firms.length >= 2) {
        var swiper = new Swiper('.swiper-sp', {
            slidesPerView: "3",
            spaceBetween: 10,
            loop: true,
            speed: 3000,
            grabCursor: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
        });
    } else {
        var swiper = new Swiper('.swiper-sp', {
            slidesPerView: '2',
            spaceBetween: 0,
            loop: false,
        });
    }
}

function setDzList(cateData) {
    let firms = cateData.gameFirm,
        tabHtml = ``,
        mainHtml = ``;

    for (const firm of firms) {

        if (firm.open) {
            continue;
        }

        tabHtml += `
                <a class="${!tabHtml ? 'active' : '' }" href="javascript:;">
                    <p>${firm.firmName}</p>
                </a>
            `;


        if (firm.games) {
            mainHtml += `
                <div class="item ${mainHtml ? 'hide' : '' }">`;
            for (const game of firm.games) {
                if (game.imageName) {
                    mainHtml += `
                    <div class="gamebox">
                        <div class="logo fl">
                            <img src="/static/img/gameicons/dz/${firm.firmCode.toLocaleLowerCase()}/${game.imageName}" alt="${game.chineseName}">
                        </div>
                        <div class="name">
                            <p class="f18">${game.chineseName}</p>
                        </div>
                        <a href="javascript:goGame('${game.firmType}','${firm.openCode}');" class="btn">进入游戏</a>
                    </div>`;
                }

            }
            mainHtml += `</div>`;
        } else {
            mainHtml += `<div class="item none">暂无可用游戏</div>`;
        }
    }

    if (!mainHtml && !tabHtml) {
        tabHtml += `
                <a class="active" href="javascript:;">
                    <p>暂无可用平台</p>
                </a>
            `;

        mainHtml += `<div class="item none">暂无可用游戏</div>`;
    }

    $('.tabctrl').html(tabHtml);
    $('.tabmain').html(mainHtml);
}

function setQpList(cateData) {
    let firms = cateData.gameFirm,
        tabHtml = ``,
        mainHtml = ``;

    for (const firm of firms) {

        if (firm.open) {
            continue;
        }

        tabHtml += `
                <a class="${!tabHtml ? 'active' : '' }" href="javascript:;">
                    <p>${firm.firmName}</p>
                </a>
            `;


        if (firm.games) {
            mainHtml += `
                <div class="item ${mainHtml ? 'hide' : '' }">`;
            for (const game of firm.games) {
                mainHtml += `
                    <div class="gamebox">
                        <div class="logo fl">
                            <img src="/static/img/gameicons/qp/${game.gameType}.png" alt="">
                        </div>
                        <div class="name">
                            <p class="f18">${game.chineseName}</p>
                        </div>
                        <a href="javascript:goGame('${game.firmType}','${game.gameType}');" class="btn">进入游戏</a>
                    </div>
            `;
            }
            mainHtml += `</div>`;
        } else {
            mainHtml += `<div class="item none">暂无可用游戏</div>`;
        }
    }

    if (!mainHtml && !tabHtml) {
        tabHtml += `
                <a class="active" href="javascript:;">
                    <p>暂无可用平台</p>
                </a>
            `;

        mainHtml += `<div class="item none">暂无可用游戏</div>`;
    }

    $('.tabctrl').html(tabHtml);
    $('.tabmain').html(mainHtml);
}

//登陆后界面
let lityObj = null;

function setLogin(isLogin, data) {
    let dom = $('#quickInfo');
    let loginedDom = dom.find('.logined');
    let unloginDom = dom.find('.unlogin');

    if (isLogin) {
        let userNick = userData.testFlag ?'游客' :data.userName ;
        loginedDom.find('.username').text(userNick);
        loginedDom.find('.balance').text(data.money);
        loginedDom.show();
        unloginDom.remove();

        $('.login').fadeOut(() => {
            $(this).remove();
            if (lityObj) {
                lityObj.close();
            }

        });
    } else {
        $('#mainLogin').show();
        unloginDom.show();
    }
}

function reloadBalance() {
    const dom = $('#quickInfo .balance');
    const icon = $('#quickInfo .icon-reload');
    dom.text('--');
    icon.addClass('roll')

    getBlance('CG', function(data) {
            dom.text(data.balance);
            icon.removeClass('roll')
        },
        function(err) {
            alert(err.responseJSON && err.responseJSON.msg || '读取失败', 2);
            icon.removeClass('roll')
        });
}

//如果是点击游戏进入来的，isFromGoGame为true
function toLogin(isFromGoGame) {
    try {
        lityObj = lity('#login-app-download');
    } catch (err) {
        if(isFromGoGame){
            alert(`请先登录`, 2);
        }
        
        $('#userName').focus();
    }
}

$(function() {
    //init
    init({
        webName: '必发',
    });

    //back to top
    if ($('#backtotop').length) {
        var scrollTrigger = 200, // px
            backToTop = function() {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('#backtotop').addClass('show');
                } else {
                    $('#backtotop').removeClass(
                        'show'
                    );
                }
            };

        backToTop();

        $(window).on('scroll', function() {
            backToTop();
        });

        $('#backtotop').on('click', function(e) {
            e.preventDefault();
            $('html,body').animate({
                    scrollTop: 0,
                },
                600
            );
        });
    }

    //float
    $('#float').Float({
        topSide: 180, //距头部
        floatRight: 1, //1为右边，0为左
        side: 10, //边距
        close: '#closeFloat', //关闭按钮的class
    });
    $('.left-btn').on('click', function() {
        $('#aside-nav').css("display", "none");
    })
    //tab
    let tabDom = $('#tab');

    $('body').on(
        'click',
        '#tab .tabctrl a',
        function() {
            let tabMain = tabDom.find(
                '.tabmain .item'
            );

            let btn = $(this);
            let index = btn.index();

            if (btn.hasClass('link')) {
                return;
            }

            btn.addClass('active')
                .siblings()
                .removeClass('active');
            tabMain
                .eq(index)
                .fadeIn()
                .siblings()
                .hide();
        }
    );
});