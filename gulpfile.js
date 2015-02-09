var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    gulp_util = require('gulp-util'),
    nodeunit = require('gulp-nodeunit-runner'),
    debowerify = require('debowerify');

gulp.task('browserify', function () {
    gulp.src(['lib/readthedocs.js'])
        .pipe(browserify({
            transform: ['debowerify']
        }))
        .on('error', function (event) {
            gulp_util.log(event.message);
            gulp_util.beep();
        })
        .pipe(gulp.dest('dist/'));
});

/* Tasks */
gulp.task('build', ['browserify']);

gulp.task('dev', ['build', 'watch']);

gulp.task('test', function () {
    gulp.src(['tests/*.js'])
        .pipe(nodeunit())
});

gulp.task('watch', function () {
    gulp.watch('lib/*.js', ['build']);
});

gulp.task('default', ['test', 'build']);
