var gulp     = require('gulp'),
    rename   = require('gulp-rename'),
    sass     = require('gulp-ruby-sass'),
    prefix   = require('gulp-autoprefixer'),
    minify   = require('gulp-minify-css'),
    uglify   = require('gulp-uglify'),
    jshint   = require('gulp-jshint');

//
// Project Paths
//

var base = "watercolor.flamebug.com";

var paths = {

    styles: {
        src: [base + "/Styles/**/*.scss"],
        dest: base + "/Styles/"
    },

    scripts: {
      src: [base + "/Scripts/**/*.js", "!" + base + "/Scripts/**/*.min.js"],
        dest: base + "/Scripts/"
    }

};

//
// Stylesheet Optimization
//

gulp.task('styles', function () {

	return gulp.src(paths.styles.src)
        .pipe(sass({ style: 'expanded' }))
        //.pipe(prefix({
        //    browsers: ['last 2 versions'],
        //    cascade: false
        //}))
        //.pipe(minify())
        .pipe(gulp.dest(paths.styles.dest));

});

//
// Javascript Optimization
//

gulp.task('scripts', function () {

   return gulp.src([paths.scripts.src])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(paths.scripts.dest));

});

//
// File Watcher
//

gulp.task('watch', function () {

	gulp.watch(paths.styles.src, ['styles']);
    gulp.watch(paths.scripts.src, ['scripts']);

});

//
// Default
//

gulp.task('default', ['styles', 'scripts'], function () {

});
