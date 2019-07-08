var gulp = require('gulp');
var yarn = require('gulp-yarn');
var babel = require('gulp-babel');

gulp.task('babel', () =>
    gulp.src(['../reactjs/js/*.js'])
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('../reactjs/public/js'))
);

gulp.task('watcher', function(cb) {
    return gulp.watch(['../reactjs/js/*.js'], function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	  return gulp.src(['./package.json', './yarn.lock'])
        .pipe(yarn({
            force: true
        }));
	});
});


gulp.task('default', ['watcher']);
