/* ------------------------------
 * IMPORTS
 * ------------------------------ */
var gulp = require('gulp');
var Q = require('q');
var gutil = require('gulp-util');
var ftp = require( 'vinyl-ftp' );
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var minifyHTML = require('gulp-minify-html');
var replace = require('gulp-replace');
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
  var deferred = Q.defer(),
    letters = require('./src/letters.js').letters,
    letter;

  for(var letterIndex in letters) {
    letter = letters[letterIndex];

    gulp.src([srcFolder+'templates/email.html', srcFolder+'templates/email-browser.html'])
      .pipe(replace(/#LANG#/g, letter.lang))
      .pipe(replace(/#TITLE#/g, letter.title))
      .pipe(replace(/#VISUALIZE#/g, letter.visu))
      .pipe(replace(/#LINK-TO-BROWSER-EMAIL#/g, 'http://alexgalinier.com/pro/emails/'+letter.name+'-browser.html'))
      .pipe(replace(/#SUBJECT#/g, letter.subject))
      .pipe(replace(/#DATE#/g, letter.date))
      .pipe(replace(/#PARAG_1#/g, letter.prg_1))
      .pipe(replace(/#PARAG_2#/g, letter.prg_2))
      .pipe(replace(/#PARAG_3#/g, letter.prg_3))
      .pipe(replace(/#PARAG_4#/g, letter.prg_4))
      .pipe(replace(/#FINAL#/g, letter.final))
      .pipe(replace(/#LINK_TO_PDF#/g, letter.pdf_link))
      .pipe(minifyHTML())
      .pipe(rename(function (path) {
        path.basename = path.basename.replace('email', letter.name);
      }))
      .pipe(gulp.dest(buildFolder))
      .on('end', function() {
        deferred.resolve();
      });
  }

  return deferred.promise;
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

  return gulp.src(buildFolder+'**/*')
    .pipe(conn.dest('/www/pro/emails/'));
});