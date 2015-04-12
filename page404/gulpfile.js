/* ------------------------------
 * IMPORTS
 * ------------------------------ */
var gulp = require('gulp');
var ftp = require( 'vinyl-ftp' );
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var minifyHTML = require('gulp-minify-html');
var minifyInline = require('gulp-minify-inline');
var rename = require("gulp-rename");

/* ------------------------------
 * VARIABLES
 * ------------------------------ */
//Paths
var buildFolder = 'dist/';
var srcFolder = 'src/';

var reload = browserSync.reload;

/* ------------------------------
 * TASKS
 * ------------------------------ */

gulp.task('build', function() {
  return gulp.src([srcFolder+'index.html'])
    .pipe(minifyHTML())
    .pipe(minifyInline())
    .pipe(gulp.dest(buildFolder));
});

gulp.task('serve', ['build'], function() {
  browserSync({
    server: buildFolder+'/'
  });

  watch(srcFolder+'**/*', function() {
    gulp.run('serve-reload');
  });
});

gulp.task('serve-reload', ['build'], function() {
  reload();
});

gulp.task('deploy', ['build'], function () {
  var conn = ftp.create( {
    host: require('./../sensitive-data').ftp.host,
    user: require('./../sensitive-data').ftp.user,
    pass: require('./../sensitive-data').ftp.pass
  });

  return gulp.src(buildFolder+'index.html')
    .pipe(conn.dest('/www/static/'))
    .pipe(conn.dest('/www/static/images/'))
    .pipe(conn.dest('/www/static/plongee/'))
    .pipe(conn.dest('/www/static/videos/'))
    .pipe(conn.dest('/www/static/documents/'))
    .pipe(conn.dest('/www/pro/'))
    .pipe(conn.dest('/www/pro/emails/'))
    .pipe(conn.dest('/www/sites/'))
    .pipe(rename("404.html"))
    .pipe(conn.dest('/www/'));
});