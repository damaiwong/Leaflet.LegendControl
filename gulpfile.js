'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util');

gulp.task('lint', function () {
    return gulp.src('src/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('build', ['lint'], function () {
    var b = browserify({
        entries: 'entry.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('src/*.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});
