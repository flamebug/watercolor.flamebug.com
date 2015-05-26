/// <binding Clean='clean' ProjectOpened='watch' />
var gulp = require('gulp'),
    rimraf = require("rimraf"),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    fs = require("fs");

eval("var project = " + fs.readFileSync("./project.json"));

var paths = {

    bower: "./bower_components/",
    lib: "./" + project.webroot + "/lib/",
    styles: project.webroot + "/styles/",
    scripts: project.webroot + "/scripts/"

};

var sassOpts = {

    parameters: {
        sourcemap: true,
        style: "expanded"
    },
    error: function (err) {
        console.error('Error!', err.message);
    }

};

//
// Stylesheet Optimization
//

gulp.task('styles', function () {

    return sass(paths.styles, sassOpts.parameters)
        .on('error', sassOpts.error)
        .pipe(prefix())
        //.pipe(minify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles))

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
        "prism": "prism/prism.js"
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

    return gulp.watch(paths.styles + "**/*.scss", ['styles']);

});

//
// Default
//

gulp.task('default', ['styles', 'watch'], function () { });

