// Gulp modules
var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    csslint     = require('gulp-csslint'),
    del         = require('del'),
    foreach     = require('gulp-foreach'),
    gutil       = require('gulp-util'),
    imagemin    = require('gulp-imagemin'),
    jshint      = require('gulp-jshint'),
    // less        = require('gulp-less'),
    minifyCss   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-ruby-sass'),
    uglify      = require('gulp-uglify'),
    watch       = require('gulp-watch');

// Define directory structure
var dirs = {
    src: 'assets/src/',
    dist: 'assets/'
};

var config = {
    src: {
        assets:     dirs.src,
        css:        dirs.src + 'css/',
        fonts:      dirs.src + 'fonts/',
        imgs:       dirs.src + 'imgs/',
        js:         dirs.src + 'js/',
        libs:       dirs.src + 'libs/',
    },
    watch: {
        css:        dirs.src + 'css/**/*.{less,scss,css}',
        js:         dirs.src + 'js/**/*.js',
        imgs:       dirs.src + 'imgs/**/*.{gif,jpg,jpeg,png,svg}'
    },
    dist: {
        assets:     dirs.dist,
        css:        dirs.dist + 'css/',
        fonts:      dirs.dist + 'fonts/',
        imgs:       dirs.dist + 'imgs/',
        js:         dirs.dist + 'js/',
        libs:       dirs.dist + 'libs/'
    }

};

// Set the environment
var Env = {
    isDev: gutil.env.dev,
    isProd: gutil.env.prod
};

/***
Clean output dir
***/
gulp.task(
    'del', [
        'delcss',
        'deljs',
        'delimgs'
    ]
);
gulp.task('delcss', function() {
    del(config.dist.css + '*.css');
});
gulp.task('deljs', function() {
    del(config.dist.js + 'application.js');
    del(config.dist.js + 'application.min.js');
});
gulp.task('delimgs', function() {
    del(config.dist.imgs + '**/*.{gif,jpg,jpeg,png,svg}');
});

/***
Sass -> CSS
***/
gulp.task('sass', ['iesass', 'ie9sass', 'ie8sass'], function() {
    return sass(config.src.css + 'application.css.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(rename('application.css'))
        .pipe(gulp.dest(config.dist.css));
});

gulp.task('iesass', function () {
    return sass(config.src.css + 'ie.css.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(rename('ie.css'))
        .pipe(gulp.dest(config.dist.css));
});
gulp.task('ie9sass', function () {
    return sass(config.src.css + 'ie-9.css.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(rename('ie-9.css'))
        .pipe(gulp.dest(config.dist.css));
});
gulp.task('ie8sass', function () {
    return sass(config.src.css + 'ie-8.css.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(rename('ie-8.css'))
        .pipe(gulp.dest(config.dist.css));
});

/***
Un-CSS
***/
gulp.task('uncss', ['sass'], function () {
    return gulp.src(config.dist.css + '*.css')
        .pipe(uncss({
            html: ['./*.{html,php}']
        }))
        .pipe(gulp.dest(config.dist.css));
});

/***
Minify CSS
***/
gulp.task('minifycss', ['csslint'], function() {
    gulp.src(config.dist.css + 'application.css')
        .pipe(rename('application.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(config.dist.css));
    gulp.src(config.dist.css + 'ie.css')
        .pipe(rename('ie.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(config.dist.css));
    gulp.src(config.dist.css + 'ie-9.css')
        .pipe(rename('ie-9.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(config.dist.css));
    gulp.src(config.dist.css + 'ie-8.css')
        .pipe(rename('ie-8.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(config.dist.css));
});

/***
Lint complied CSS
***/
gulp.task('csslint', ['sass'], function() {
    return gulp.src(config.dist.css + 'application.css')
        .pipe(csslint())
        .pipe(csslint.reporter(cssLintReporter));
});

var cssLintReporter = function(file) {
    gutil.log(gutil.colors.yellow('CSS Lint: ' + file.csslint.errorCount + ' errors') + ' in ' + gutil.colors.magenta(file.path));

    file.csslint.results.forEach(function(result) {
        gutil.log(gutil.colors.yellow('Line ' + result.error.line + ': ') + result.error.message);
    });
};

/***
Concatenate JS
***/
gulp.task('concatjs', ['deljs'], function() {
    return gulp.src(config.src.js +'/**/*.js')
        .pipe(concat('application.js'))
        .pipe(gulp.dest(config.dist.js));
});

/***
Minify JS
***/
gulp.task('minifyjs', ['jshint'], function() {
    return gulp.src(config.dist.js + 'application.js')
        .pipe(rename('application.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist.js));
});

/***
JS hint
***/
gulp.task('jshint', ['concatjs'], function() {
    return gulp.src(config.dist.js + 'application.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
});

/**
Minify images
***/
gulp.task('imagemin', ['delimgs'], function () {
    return gulp.src(config.src.imgs + '**/*.{gif,jpg,jpeg,png,svg}')
        .pipe(imagemin())
        .pipe(gulp.dest(config.dist.imgs));
});

gulp.task(
    'default', [
        'minifycss',
        'minifyjs',
        'imagemin'
    ]
);

gulp.task('serve', ['default'], function () {
    gutil.log('Initiating watch');
    gulp.watch(config.watch.css, { interval: 1000 }, ['default']);
    gulp.watch(config.watch.js, { interval: 1000 }, ['default']);
    gulp.watch(config.watch.imgs, { interval: 1000 }, ['default']);
});