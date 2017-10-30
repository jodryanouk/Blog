const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./assets/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./assets/scss/*.scss', ['sass']);
});
