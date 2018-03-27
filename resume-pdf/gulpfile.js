/* ------------------------------
 * IMPORTS
 * ------------------------------ */
var gulp = require('gulp');
var Q = require('q');
var sass = require('gulp-sass');
var del = require('del');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');
var rename = require("gulp-rename");

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
  return gulp.src(stylesFolder+'theme/alexgalinier.sass')
    .pipe(sass().on('error', sass.logError))
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
  var deferred = Q.defer(),
    resumes = require('./src/resumes.js').resumes;

  buildIndex(resumes[0], 'index', '<div class="page">', deferred, false);
  buildIndex(resumes[0], 'resume-fr-print', '<div class="page print-page">', deferred, false);
  buildIndex(resumes[1], 'resume-en-mail', '<div class="page">', deferred, false);
  buildIndex(resumes[1], 'resume-en-print', '<div class="page print-page">', deferred, true);

  return deferred.promise;
});

gulp.task('serve', ['build'], function() {
  browserSync({
    server: buildFolder
  });

  //watch(srcFolder+'**/*', function() {
    //gulp.start('serve-reload');
  //});
});

gulp.task('serve-reload', ['build'], function() {
  reload();
});

gulp.task('build', ['styles', 'images', 'fonts', 'index']);

/**
 * Privates
 */

function buildIndex(data, name, printDiv, promise, doResolve) {
  gulp.src([srcFolder+'index.html'])
    .pipe(replace(/#PRINT_DIV#/g, printDiv))
    //Profile
    .pipe(replace(/#PROFILE#/g, data.profile))
    .pipe(replace(/#PROFILE_DESC_1#/g, data.profile_desc_1))
    .pipe(replace(/#PROFILE_DESC_2#/g, data.profile_desc_2))
    //Skills
    .pipe(replace(/#SKILLS#/g, data.skills))
    .pipe(replace(/#SKILLS_PRO#/g, data.skills_pro))
    .pipe(replace(/#SKILLS_PRJ_MNG#/g, data.skills_prj_mng))
    .pipe(replace(/#SKILLS_REL#/g, data.skills_rel))
    .pipe(replace(/#SKILLS_REL_LEAD#/g, data.skills_rel_lead))
    .pipe(replace(/#SKILLS_REL_TEAM#/g, data.skills_rel_team))
    .pipe(replace(/#SKILLS_REL_CREA#/g, data.skills_rel_crea))
    .pipe(replace(/#SKILLS_REL_COMM#/g, data.skills_rel_comm))
    .pipe(replace(/#SKILLS_LANG#/g, data.skills_lang))
    .pipe(replace(/#SKILLS_LANG_FR#/g, data.skills_lang_fr))
    .pipe(replace(/#SKILLS_LANG_EN#/g, data.skills_lang_en))
    //Experiences
    .pipe(replace(/#EXPERIENCES#/g, data.experiences))
    .pipe(replace(/#EXPERIENCES_NEXT#/g, data.experiences_next))

    .pipe(replace(/#TITLE_1#/g, data.title_1))
    .pipe(replace(/#DATE_1#/g, data.date_1))
    .pipe(replace(/#TEXT_1#/g, data.text_1))
    .pipe(replace(/#TITLE_2#/g, data.title_2))
    .pipe(replace(/#DATE_2#/g, data.date_2))
    .pipe(replace(/#TEXT_2#/g, data.text_2))
    .pipe(replace(/#TITLE_3#/g, data.title_3))
    .pipe(replace(/#DATE_3#/g, data.date_3))
    .pipe(replace(/#TEXT_3#/g, data.text_3))
    .pipe(replace(/#TITLE_4#/g, data.title_4))
    .pipe(replace(/#DATE_4#/g, data.date_4))
    .pipe(replace(/#TEXT_4#/g, data.text_4))
    .pipe(replace(/#TITLE_5#/g, data.title_5))
    .pipe(replace(/#DATE_5#/g, data.date_5))
    .pipe(replace(/#TEXT_5#/g, data.text_5))
    .pipe(replace(/#TITLE_6#/g, data.title_6))
    .pipe(replace(/#DATE_6#/g, data.date_6))
    .pipe(replace(/#TEXT_6#/g, data.text_6))
    .pipe(replace(/#TITLE_7#/g, data.title_7))
    .pipe(replace(/#DATE_7#/g, data.date_7))
    .pipe(replace(/#TEXT_7#/g, data.text_7))
    .pipe(replace(/#TITLE_8#/g, data.title_8))
    .pipe(replace(/#DATE_8#/g, data.date_8))
    .pipe(replace(/#TEXT_8#/g, data.text_8))
    //Hobbies
    .pipe(replace(/#HOBBIES_1#/g, data.hobbies_1))
    .pipe(replace(/#HOBBIES_2#/g, data.hobbies_2))
    .pipe(replace(/#HOBBIES_3#/g, data.hobbies_3))
    //Studies
    .pipe(replace(/#STUDIES#/g, data.studies))
    .pipe(replace(/#STUDIES_DATE_1#/g, data.studies_date_1))
    .pipe(replace(/#STUDIES_DATE_2#/g, data.studies_date_2))
    //Notables
    .pipe(replace(/#NOTABLES#/g, data.notables))
    .pipe(replace(/#NOTABLES_DESC_1#/g, data.notables_desc_1))
    .pipe(replace(/#NOTABLES_DESC_2#/g, data.notables_desc_2))
    .pipe(replace(/#NOTABLES_DESC_3#/g, data.notables_desc_3))
    .pipe(replace(/#NOTABLES_DESC_4#/g, data.notables_desc_4))
    .pipe(replace(/#NOTABLES_TITLE_5#/g, data.notables_title_5))
    .pipe(replace(/#NOTABLES_DESC_5#/g, data.notables_desc_5))
    //Ref
    .pipe(replace(/#REF#/g, data.ref))
    .pipe(replace(/#REF_DESC_3#/g, data.ref_desc_3))
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('index', name);
    }))
    .pipe(gulp.dest(buildFolder))
    .on('end', function() {
      if (doResolve) {
        promise.resolve();
      }
    });
}
