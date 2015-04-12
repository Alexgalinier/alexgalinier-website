/* ------------------------------
 * IMPORTS
 * ------------------------------ */
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var del = require('del');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');

/* ------------------------------
 * VARIABLES
 * ------------------------------ */
//Paths
var buildFolder = 'dist/';
var srcFolder = 'src/';
var stylesFolder = srcFolder + 'styles/';
var imagesFolder = srcFolder + 'images/';

var reload = browserSync.reload;

/* ------------------------------
 * TASKS
 * ------------------------------ */
gulp.task('styles', ['styles:clean'], function () {
  return sass(stylesFolder+'theme/alexgalinier.sass', {sourcemap: false, container: 'styles'}) //Define a container to avoir error on multiple sass execution
    .pipe(plumber())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(buildFolder));
});

gulp.task('styles:clean', function () {
  return del([buildFolder+'alexgalinier\\.css']);
});

gulp.task('images', function () {
  return gulp.src(imagesFolder+'*')
    .pipe(imagemin())
    .pipe(gulp.dest(buildFolder+'images'));
});

gulp.task('images:clean', function () {
  return del([buildFolder+'images/']);
});

gulp.task('fonts', ['fonts:clean'], function() {
  return gulp.src(srcFolder+'fonts/*')
    .pipe(gulp.dest(buildFolder+'fonts'))
});

gulp.task('fonts:clean', function() {
  return del([buildFolder+'fonts/*']);
});

gulp.task('index', function() {
  return gulp.src(srcFolder+'index.html')
    .pipe(gulp.dest(buildFolder))
});

gulp.task('index:clean', function() {
  return del([buildFolder+'index.html']);
});

gulp.task('serve', ['build'], function() {
  browserSync({
    server: buildFolder
  });

  watch(srcFolder+'**/*', function() {
    gulp.start('serve-reload');
  });
});

gulp.task('serve-reload', ['build'], function() {
  reload();
});

gulp.task('build', ['styles', 'images', 'fonts', 'index']);
