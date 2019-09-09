module.exports = function() {
    var path = require('path'),
        fs = require('fs');

    var gulp = require('gulp'),
        less = require('gulp-less'),
        sass = require('gulp-sass'),
        browserSync = require('browser-sync').create(),
        reload = browserSync.reload,
        serveStatic = require('serve-static'),
        ssi = require('@cxteam/browsersync-ssi'),
        plumber = require('gulp-plumber');

    var defaultDir = 'temp';
    var devDir = arguments[0];
    var platformDir = defaultDir + '/' + devDir;

    console.log(devDir)

    var deleteFolderRecursive = function(path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function(file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else {
                    // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    // 临时打包
    var gulpTasks = {
        init: function() {
            var that = this;
            // 删除临时文件夹
            deleteFolderRecursive(defaultDir);
            console.log('初始化开始');
            setTimeout(function() {
                gulp.src(["app/include/**/*.*"])
                    .pipe(gulp.dest(defaultDir + '/include'))
                    .on('end', function() {
                        console.log('拷贝文件至temp目录');
                    });

                gulp.src(["app/static/**/*.*"])
                    .pipe(gulp.dest(defaultDir + '/static'))
                    .on('end', function() {
                        console.log('拷贝文件至temp目录');
                    });

                gulp.src(["app/conf/**/*.*"])
                    .pipe(gulp.dest(defaultDir + '/conf'))
                    .on('end', function() {
                        console.log('拷贝文件至temp目录');
                    });


                gulp.src([
                        "app/" + devDir + "/**/*.*",
                        "!app/" + devDir + "/**/*.scss",
                        "!app/" + devDir + "/**/*.sass",
                        "!app/" + devDir + "/**/*.less"
                    ])
                    .pipe(gulp.dest(platformDir))
                    .on('end', function() {
                        console.log('拷贝文件至temp目录');
                        that.scss();
                    });
            }, 1000)
        },
        scss: function() {
            var that = this;
            gulp.src([
                    "app/" + devDir + "/**/*.scss", 
                    "app/" + devDir + "/**/*.sass"
                ])
                .pipe(sass())
                .pipe(gulp.dest(platformDir))
                .on('end', function() {
                    console.log('编译scss文件');
                    that.less();
                });
        },
        less: function() {
            var that = this;
            gulp.src(["app/" + devDir + "/**/*.less"])
                .pipe(less())
                .pipe(gulp.dest(platformDir))
                .on('end', function() {
                    console.log('编译less文件');
                    that.server();
                });
        },
        server: function() {
            browserSync.init({
                proxy: 'http://cxcpw.me',
                startPath: "/" + devDir,
                middleware: [
                    {
                        route: '',
                        handle: ssi({
                            baseDir: 'temp',
                            ext: '.html',
                            version: '2.18.8',
                        }),
                    },
                    {
                        route: '',
                        handle: serveStatic('temp'),
                    },
                ],
            });
            
            console.log('开启实时服务');
            console.log('初始化结束');
        }
    };

    gulpTasks.init();

    //监控任务

    //sass
    gulp.watch(["app/" + devDir + "/**/*.sass", "app/" + devDir + "/**/*.scss"]).on('change', function(event) {

        gulp.src(event.path, { base: 'app' })
            .pipe(plumber())
            .pipe(sass())
            .pipe(gulp.dest(defaultDir))
            .pipe(reload({ stream: true }));
    });

    //css
    gulp.watch(["app/" + devDir + "/**/*.css"]).on('change', function(event) {

        gulp.src(event.path, { base: 'app' })
            .pipe(plumber())
            .pipe(gulp.dest(defaultDir))
            .pipe(reload({ stream: true }));
    });

    //less
    gulp.watch("app/" + devDir + "/**/*.less").on('change', function(event) {

        gulp.src(event.path, { base: 'app' })
            .pipe(plumber())
            .pipe(less())
            .pipe(gulp.dest(defaultDir))
            .pipe(reload({ stream: true }));
    });

    //js
    gulp.watch("app/" + devDir + "/**/*.js").on('change', function(event) {

        gulp.src(event.path, { base: 'app' })
            .pipe(plumber())
            .pipe(gulp.dest(defaultDir))
            .on('end', function() {
                console.log('js更新完成');
                reload();
            });
    });

    //html
    gulp.watch("app/" + devDir + "/**/*.html").on('change', function(event) {

        gulp.src(event.path, { base: 'app' })
            .pipe(plumber())
            .pipe(gulp.dest(defaultDir))
            .on('end', function() {
                console.log('html更新完成');
                reload();
            });
    });

    //img
    gulp.watch("app/" + devDir + "/**/*.{png,jpg,gif,ico}").on('change', function(event) {

        gulp.src(event.path, { base: 'app' })
            .pipe(plumber())
            .pipe(gulp.dest(defaultDir))
            .on('end', function() {
                console.log('图片更新完成');
                reload();
            });
    });

};