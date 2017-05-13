var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var paths = {
    pages: ['src/*.html']
};
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var cssModules = [
    'node_modules/normalize.css',
    'node_modules/roboto-fontface/css/roboto'
]

gulp.task('copyHtml', ['copyHtmlEn'], function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('copyHtmlEn', function () {
    return gulp.src('src/en/*.html')
        .pipe(gulp.dest('dist/en'));
});

gulp.task('copyAssets', function () {
    return gulp.src('src/assets/**')
        .pipe(gulp.dest('dist/assets'));
});


gulp.task('build', ['default', 'copyAssets', 'sass', 'copyHtml', 'fonts']);


gulp.task('default', ['sass', 'copyHtml'], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/app/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  return gulp.src('src/styles/*.scss')
    
    .pipe(sass({
        outputStyle: 'compressed',
        includePaths: cssModules
    }).on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    // .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('watch', ['default'], function () {
   gulp.watch('src/**/*.+(scss|html|ts)', ['default']);
});


gulp.task('fonts', ['fontsMaterialIcons', 'fontsAwesome'], function() {
  return gulp.src('node_modules/roboto-fontface/fonts/Roboto/*')
    .pipe(gulp.dest('dist/fonts/Roboto'))
});


gulp.task('fontsMaterialIcons', function() {
  return gulp.src('node_modules/material-design-icons/iconfont/*')
    .pipe(gulp.dest('dist/fonts/material-design-icons'))
});

gulp.task('fontsAwesome', function() {
  return gulp.src('node_modules/font-awesome/**')
    .pipe(gulp.dest('dist/fonts/font-awesome'))
});