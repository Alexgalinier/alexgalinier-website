/* ------------------------------
 * IMPORTS
 * ------------------------------ */
var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var sass = require('gulp-ruby-sass');
var inject = require('gulp-inject');
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');

/* ------------------------------
 * VARIABLES
 * ------------------------------ */
//Paths
var buildFolder = 'dist/';
var srcFolder = 'src/';
var stylesFolder = srcFolder + 'styles/';
var scriptsFolder = srcFolder + 'scripts/';
var imagesFolder = srcFolder + 'images/';
var templatesFolder = srcFolder + 'templates/';
var bowerFolder = 'bower_components/'

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
  return gulp.src([buildFolder+'alexgalinier\\.css'])
    .pipe(clean());
});

gulp.task('styles-critical', ['styles-critical:clean'], function () {
  return sass(stylesFolder+'/theme/alexgalinier-critical.sass', {sourcemap: false, container: 'styles-critical'})  //Define a container to avoir error on multiple sass execution
    .pipe(plumber())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(buildFolder));
});

gulp.task('styles-critical:clean', function () {
  return gulp.src([buildFolder+'alexgalinier-critical\\.css'])
    .pipe(clean());
});

gulp.task('scripts-lib-critical', ['scripts-lib-critical:clean'], function () {
  return gulp.src([bowerFolder+'lazyloader/dist/lazy.1.0.0.min.js', bowerFolder+'bower-webfontloader/webfont.js'])
    .pipe(concat('lib-critical.js'))
    .pipe(gulp.dest(buildFolder));
});

gulp.task('scripts-lib-critical:clean', function () {
  return gulp.src([buildFolder+'lib-critical\\.js'])
    .pipe(clean());
});

gulp.task('scripts', ['scripts:clean'], function () {
  return gulp.src([
      scriptsFolder+'lib/html.js',
      scriptsFolder+'lib/router.js',
      scriptsFolder+'lib/http.js',
      scriptsFolder+'components/content.js',
      scriptsFolder+'components/menu.js',
      scriptsFolder+'components/langSwitcher.js',
      scriptsFolder+'main.js'
    ])
    .pipe(concat('alexgalinier.js'))
    .pipe(gulp.dest(buildFolder));
});

gulp.task('scripts:clean', function () {
  return gulp.src([buildFolder+'lib-critical\\.js'])
    .pipe(clean());
});

gulp.task('templates', ['templates:clean'], function () {
  return gulp.src(templatesFolder+'**/*')
    .pipe(minifyHTML({
      comments: true
    }))
    .pipe(gulp.dest(buildFolder+'templates'));
});

gulp.task('templates:clean', function () {
  return gulp.src([buildFolder+'templates/'])
    .pipe(clean());
});

gulp.task('images', ['images:clean'], function () {
  return gulp.src(imagesFolder+'*')
    .pipe(imagemin())
    .pipe(gulp.dest(buildFolder+'images'));
});

gulp.task('images:clean', function () {
  return gulp.src([buildFolder+'images/'])
    .pipe(clean());
});

gulp.task('inject', ['styles-critical', 'scripts-lib-critical'], function () {
  return gulp.src(srcFolder+'index.html')
    .pipe(inject(gulp.src(buildFolder+'alexgalinier-critical.css'), {
      starttag: '<!-- inject:alexgalinier-critical:css -->',
      transform: function (filePath, file) {
        return '<style>'+file.contents.toString('utf8')+'</style>'
      }
    }))
    .pipe(inject(gulp.src(scriptsFolder+'critical.js'), {
      starttag: '<!-- inject:alexgalinier-critical:js -->',
      transform: function (filePath, file) {
        return '<script>'+file.contents.toString('utf8')+'</script>'
      }
    }))
    .pipe(minifyHTML({
      comments: true
    }))
    .pipe(gulp.dest(buildFolder));
});

gulp.task('fonts', ['fonts:clean'], function() {
  return gulp.src(srcFolder+'fonts/*')
    .pipe(gulp.dest(buildFolder+'fonts'))
});

gulp.task('fonts:clean', function() {
  return gulp.src([buildFolder+'fonts/*'])
    .pipe(clean());
});

gulp.task('humantxt', ['humantxt:clean'], function() {
  return gulp.src(srcFolder+'humans.txt')
    .pipe(gulp.dest(buildFolder))
});

gulp.task('humantxt:clean', function() {
  return gulp.src([buildFolder+'humans\\.txt'])
    .pipe(clean());
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

gulp.task('build', ['inject', 'scripts', 'styles', 'images', 'templates', 'humantxt', 'fonts']);

gulp.task('deploy', ['build'], function () {
  var conn = ftp.create( {
    host: require('./../sensitive-data').ftp.host,
    user: require('./../sensitive-data').ftp.user,
    pass: require('./../sensitive-data').ftp.pass
  });

  return gulp.src(buildFolder+'**/*')
    .pipe(conn.dest('/www'));
});