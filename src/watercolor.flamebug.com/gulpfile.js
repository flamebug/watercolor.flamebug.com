/// <binding Clean='clean' ProjectOpened='watch' />
var gulp = require('gulp'),
    rimraf = require("rimraf"),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    sassdoc = require('sassdoc'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    bump = require('gulp-bump'),
    fs = require("fs");

eval("var project = " + fs.readFileSync("./project.json"));

var paths = {

    bower:   "./bower_components/",
 
    lib:     project.webroot + "/lib/",   
    scripts: project.webroot + "/scripts/",
    sass:    project.webroot + "/sass/",
    css:     project.webroot + "/css/"

};

var options = {

    sass: {
        parameters: {
            sourcemap: true,
            style: "expanded",
            loadPath: [
                paths.lib,
                paths.sass
            ]
        },
        error: function (err) {
            console.error('Error!', err.message);
        }
    }

};

//
// Stylesheet Optimization
//

gulp.task('styles', function () {

    return sass(paths.sass, options.sass.parameters)
        .on('error', options.sass.error)
        .pipe(prefix())
        //.pipe(minify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.css))

});

//
// Generate Sass Documentation
//

gulp.task('sassdoc', function () {
    
  return gulp.src(paths.sass + "**/*.scss")
    .pipe(sassdoc());
    
});

//
// Clean Script Library
//

gulp.task("clean", function (cb) {

    rimraf(paths.lib, cb);

});

//
// Copy Bower Components to Script Library
//

gulp.task("copy", ["clean"], function () {

    var bower = {
        "jquery": "jquery/jquery*.{js,map}",
        "prism": "prism/**/prism.{js,css}",
        "normalize.css": "normalize.css/normalize.css"
    }

    for (var destinationDir in bower) {

        gulp.src(paths.bower + bower[destinationDir])
            .pipe(gulp.dest(paths.lib + destinationDir));

    }

});

//
// File Watcher
//

gulp.task('watch', function () {

    return gulp.watch(paths.sass + "**/*.scss", ['styles']);

});

//
// Bump Version
//

gulp.task('bump', function () {

    gulp.task('bump', function(){
      gulp.src(['./bower.json', './package.json'])
      .pipe(bump())
      .pipe(gulp.dest('./'));
    });

});

//
// Bump Version Minor
//

gulp.task('bump-minor', function () {

    gulp.task('bump', function(){
      gulp.src(['./bower.json', './package.json'])
      .pipe(bump({type: 'minor'}))
      .pipe(gulp.dest('./'));
    });

});

//
// Bump Version Major
//

gulp.task('bump-major', function () {

    gulp.task('bump', function(){
      gulp.src(['./bower.json', './package.json'])
      .pipe(bump({type: 'major'}))
      .pipe(gulp.dest('./'));
    });

});

//
// Build
//

gulp.task('build', ['styles', 'bump'], function () {});

//
// Release
//

gulp.task('release', ['styles', 'bump-minor'], function () {});

//
// Prepare
//

gulp.task('prepare', ['copy', 'styles'], function () {});

//
// Default
//

gulp.task('default', ['styles', 'watch'], function () {});

