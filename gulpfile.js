var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

gulp.task('copyHtml', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('copyAssets', function () {
    return gulp.src('src/assets/**')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('default', ['copyHtml', 'copyAssets', 'sass'], function () {
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
    //.pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  return gulp.src('src/styles/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('watch', ['default'], function () {
   gulp.watch('src/**/*.+(scss|html|ts)', ['default']);
});
