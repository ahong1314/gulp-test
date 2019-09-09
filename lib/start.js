module.exports = function() {
    const path = require('path'),
        fs = require('fs');

    const gulp = require('gulp'),
        less = require('gulp-less'),
        sass = require('gulp-sass'),
        browserSync = require('browser-sync').create(),
        reload = browserSync.reload,
        serveStatic = require('serve-static'),
        ssi = require('@cxteam/browsersync-ssi');
        plumber = require('gulp-plumber'),
        babel = require('gulp-babel');

    var defaultDir = 'temp';

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
            console.log('清空临时文件夹');
            deleteFolderRecursive(defaultDir);
            console.log('初始化开始');
            setTimeout(function() {
                gulp.src(["app/**/*.*", "!app/**/*.scss", "!app/**/*.sass", "!app/**/*.less"])
                    .pipe(gulp.dest(defaultDir))
                    .on('end', function() {
                        console.log('拷贝文件至temp目录');
                        that.scss();
                    });
            }, 1000)
        },
        scss: function() {
            var that = this;
            try {
                gulp.src(["app/**/*.scss", "app/**/*.sass"])
                    .pipe(sass())
                    .pipe(gulp.dest(defaultDir))
                    .on('end', function() {
                        console.log('编译scss文件');
                        that.less();
                    });
            } catch (err) {
                console.log(err);
                that.less()
            }
        },
        less: function() {
            var that = this;
            try {
                gulp.src(["app/**/*.less"])
                    .pipe(less())
                    .pipe(gulp.dest(defaultDir))
                    .on('end', function() {
                        console.log('编译less文件');
                        that.server();
                    });
            } catch (err) {
                that.server();
            }
        },
        server: function() {
            browserSync.init({
                proxy: "http://www.cxcpw.me",
                middleware: [{
                    route: "",
                    handle: ssi({
                        baseDir: 'temp',
                        ext: '.html',
                        version: '2.18.8'
                    })
                }, {
                    route: "",
                    handle: serveStatic('temp')
                }]
            });

            console.log('开启实时服务');
            console.log('初始化结束');
        }
    };

    gulpTasks.init();

    //监控任务

    //sass
    gulp.watch(["app/**/*.sass", "app/**/*.scss"]).on('change', (event) => {
        gulp.src(event, { base: 'app' })
            .pipe(plumber())
            .pipe(sass())
            .pipe(gulp.dest(defaultDir))
            .pipe(reload({ stream: true }));
    });

    //css
    gulp.watch(["app/**/*.css"]).on('change', (event) => {
        gulp.src(event, { base: 'app' })
            .pipe(plumber())
            .pipe(gulp.dest(defaultDir))
            .pipe(reload({ stream: true }));
    });

    //less
    gulp.watch("app/**/*.less").on('change', (event) => {
        gulp.src(event, { base: 'app' })
            .pipe(plumber())
            .pipe(less())
            .pipe(gulp.dest(defaultDir))
            .pipe(reload({ stream: true }));
    });

    //js
    gulp.watch("app/**/*.js").on('change', (event) => {
        gulp.src(event, { base: 'app' })
            .pipe(plumber())
            // .pipe(babel({
            //         // presets: ['@babel/env']
            //         presets: ['es2015']
            //     }))
            .pipe(gulp.dest(defaultDir))
            .on('end', function() {
                console.log('js更新完成');
                reload();
            });
    });

    //json
    gulp.watch("app/**/*.json").on('change', (event) => {
        gulp.src(event, { base: 'app' })
            .pipe(plumber())
            .pipe(gulp.dest(defaultDir))
            .on('end', function() {
                console.log('json更新完成');
                reload();
            });
    });

    //html
    gulp.watch("app/**/*.html").on('change', (event) => {
        gulp.src(event, { base: 'app' })
            .pipe(plumber())
            .pipe(gulp.dest(defaultDir))
            .on('end', function() {
                console.log('html更新完成');
                reload();
            });
    });

    //img
    gulp.watch("app/**/*.{png,jpg,gif,ico,swf}").on('change', (event) => {
        gulp.src(event, { base: 'app' })
            .pipe(plumber())
            .pipe(gulp.dest(defaultDir))
            .on('end', function() {
                console.log('图片更新完成');
                reload();
            });
    });
};