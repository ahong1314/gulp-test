module.exports = function() {
    var fs = require('fs'),
        path = require('path');

    var gulp = require('gulp'),
        less = require('gulp-less'),
        sass = require('gulp-sass'),
        uglify = require('gulp-uglify-es').default,
        cssmin = require('gulp-clean-css'),
        fileinclude = require('gulp-file-include'),
        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'),
        cache = require('gulp-cache'),
        concat = require('gulp-concat'),
        gutil = require('gulp-util'),
        babel = require('gulp-babel');

    var os = require('os');

    var defaultDir = 'platform/',
        packObjName = arguments[0],
        packObjDir = 'app/' + packObjName,
        globalObjDir = 'app/global';

    defaultDir += packObjName


    //判断是否有该项目包
    fs.exists('app/' + packObjName, function(exists) {
        if (!exists) {
            console.log('app包内不存在该项目');
            return;
        } else {
            gulpTasks.init();
        }
    });

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

    //打包
    var gulpTasks = {
        init: function() {
            var that = this;
            // 删除临时文件夹
            console.log('清空临时文件夹');
            deleteFolderRecursive(defaultDir);
            setTimeout(function() {
                that.html();
            }, 1000)
        },
        html: function() {
            var that = this;
            gulp.src([packObjDir + '/**/*.html', globalObjDir + '/*.html', '!' + globalObjDir + '/include/*'])
                .pipe(fileinclude({
                    prefix: '@@',
                    basepath: '@file'
                }))
                .pipe(gulp.dest(defaultDir))
                .on('end', function() {
                    console.log('编译html完成');
                    that.sass();
                });
        },
        sass: function() {
            var that = this;
            gulp.src([packObjDir + "/**/*.scss", packObjDir + "/**/*.sass", globalObjDir + "/**/*.scss", globalObjDir + "/**/*.sass"])
                .pipe(sass())
                .pipe(cssmin({
                    rebase: false
                }))
                .pipe(gulp.dest(defaultDir))
                .on('end', function() {
                    console.log('编译sass完成');
                    that.less();
                });
        },
        less: function() {
            var that = this;
            gulp.src([packObjDir + "/**/*.less", globalObjDir + "/**/*.less"])
                .pipe(less())
                .pipe(cssmin({
                    rebase: false
                }))
                .pipe(gulp.dest(defaultDir))
                .on('end', function() {
                    console.log('编译less完成');
                    that.css();
                });
        },
        css: function() {
            var that = this;
            gulp.src([packObjDir + "/**/*.css", globalObjDir + "/**/*.css"])
                .pipe(cssmin({
                    rebase: false
                }))
                .pipe(gulp.dest(defaultDir))
                .on('end', function() {
                    console.log('压缩css完成');
                    that.img();
                });
        },
        img: function() {
            var that = this;
            gulp.src([packObjDir + '/**/*.{png,jpg,gif,ico}', globalObjDir + '/**/*.{png,jpg,gif,ico}', '!' + globalObjDir + '/img/*'])
                .pipe(cache(imagemin({
                    optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
                    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                    multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
                    svgoPlugins: [{ removeViewBox: false }], //不要移除svg的viewbox属性
                    use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
                })))
                .pipe(gulp.dest(defaultDir))
                .on('end', function() {
                    console.log('压缩图片完成');
                    that.copy();
                });
        },
        copy: function() {
            var that = this;
            gulp.src([
                    packObjDir + "/**/*.swf",
                    packObjDir + "/**/*.eot",
                    packObjDir + "/**/*.svg",
                    packObjDir + "/**/*.ttf",
                    packObjDir + "/**/*.woff",
                    packObjDir + "/**/*.woff2",
                    packObjDir + "/**/*.otf",
                    packObjDir + "/**/*.mp4",
                    packObjDir + "/**/*min.js"
                ])
                .pipe(gulp.dest(defaultDir))
                .on('end', function() {
                    console.log('复制杂项完成');
                    that.js();
                });
        },
        js: function() {
            var that = this;
            gulp.src([packObjDir + "/**/*.js", globalObjDir + "/**/*.js",'!/**/*min.js'])
                .pipe(babel({
                    // presets: ['@babel/env']
                    presets: ['es2015']
                }))
                .pipe(uglify({
                    mangle: { reserved: ['require', 'exports', 'module', '$'] }, //排除混淆关键字,false to skip mangling names.
                    compress: true //类型：Boolean 默认：true 是否完全压缩
                    //preserveComments: 'all' //保留所有注释
                }))
                .on('error', function(err) {
                    gutil.log(gutil.colors.red('[Error]'), err.toString());
                })
                .pipe(gulp.dest(defaultDir))
                .on('end', function() {
                    console.log('编译js完成');
                    that.concatJs();
                });
        },
        concatJs: function() {
            var that = this;
            gulp.src([
                    'app/static/lib/jquery/jquery-1.11.2.min.js',
                    'app/static/lib/jquery/jquery.cookie.js',
                    'app/static/lib/util/md5.js',
                    'app/static/lib/util/httpUtil.js',
                    'app/static/util.js',
                    'app/static/home_main.js'
                ])
                .pipe(concat('home_main.min.js'))
                .pipe(uglify({
                    mangle: { reserved: ['require', 'exports', 'module', '$'] }, //排除混淆关键字,false to skip mangling names.
                    compress: true, //类型：Boolean 默认：true 是否完全压缩
                    // preserveComments: 'all' //保留所有注释
                }))
                .on('error', function(err) {
                    gutil.log(gutil.colors.red('[Error]'), err.toString());
                })
                .pipe(gulp.dest(defaultDir + '/js/'))
                .on('end', function() {
                    console.log('合并js完成');
                    that.include();
                });
        },
        include: function() {
            var that = this;
            gulp.src([
                    'app/include/commonJs.html'
                ])
                .pipe(gulp.dest(defaultDir + '/include/'))
                .on('end', function() {
                    console.log('include替换完成');
                    that.readMe();
                });
        },
        readMe: function() {
            fs.writeFile(
                path.join(defaultDir.toString(), packObjName.toString()),
                `
                打包时间 ： ${new Date}
                打包系统 ： ${os.platform}
                打包用户 ： ${os.hostname}
                `,
                function(err) {
                    if (err) throw err;
                    console.log("说明文件写入完成");
                });
        }
    }
};