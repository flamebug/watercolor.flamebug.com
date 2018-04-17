/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    uglify = require("gulp-uglify");

var webroot = "./wwwroot/";

var paths = {
    css: webroot + "styles/css/",
    sass: webroot + "styles/sass/",
};

var options = {
    sass: {
        parameters: {
            outputStyle: "expanded",
			includePaths: ["wwwroot/styles/lib/", "wwwroot/styles/sass/"]
        }
    },
};

gulp.task("clean:css", function (cb) {
    rimraf(paths.css, cb);
});

gulp.task("clean", ["clean:css"]);

gulp.task('build:sass', ['clean:css'], function () {
	return gulp.src(paths.sass + "**/*.scss")
		.pipe(sourcemaps.init())
        .pipe(sass(options.sass.parameters)
            .on('error', sass.logError)
            //.on('error', options.sass.error)
        )
		//.pipe(prefix())
        //.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.css));
});

gulp.task('build', ['build:sass'], function () {});

gulp.task('watch', function () {
    gulp.watch(paths.sass + "**/*.scss", ['build:sass']);
});


