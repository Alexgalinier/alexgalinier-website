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

    buildEmail(letter, deferred, letterIndex == (letters.length - 1));
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

/**
 * Private
 */

function buildEmail(data, promise, doResolve) {
  gulp.src([srcFolder+'templates/email.html', srcFolder+'templates/email-browser.html'])
    .pipe(replace(/#LANG#/g, data.lang))
    .pipe(replace(/#TITLE#/g, data.title))
    .pipe(replace(/#VISUALIZE#/g, data.visu))
    .pipe(replace(/#LINK-TO-BROWSER-EMAIL#/g, 'http://alexgalinier.com/pro/emails/'+data.name+'-browser.html'))
    .pipe(replace(/#SUBJECT#/g, data.subject))
    .pipe(replace(/#DATE#/g, data.date))
    .pipe(replace(/#PARAG_1#/g, data.prg_1))
    .pipe(replace(/#PARAG_2#/g, data.prg_2))
    .pipe(replace(/#PARAG_3#/g, data.prg_3))
    .pipe(replace(/#PARAG_4#/g, data.prg_4))
    .pipe(replace(/#FINAL#/g, data.final))
    .pipe(replace(/#LINK_TO_PDF_TEXT#/g, data.pdf_link_text))
    .pipe(replace(/#LINK_TO_PDF#/g, data.pdf_link))
    .pipe(minifyHTML())
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('email', data.name);
    }))
    .pipe(gulp.dest(buildFolder))
    .on('end', function() {
      if (doResolve) {
        promise.resolve();
      }
    });
}