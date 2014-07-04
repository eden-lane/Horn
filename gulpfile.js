var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat');

var paths = {
  styles: ['src/styles/horn.less'],
  editor: [
    'src/scripts/editor/editor.js',
    'src/scripts/editor/cm.js',
    'src/scripts/editor/editorArea.js'
  ],
  toolbar: [
    'src/scripts/toolbar/toolbar.js'
  ],
  tabs: [
    'src/scripts/tabs/tabs.js'
  ]
};

gulp.task('styles', function () {
    gulp.src(paths.styles)
      .pipe(less())
      .pipe(gulp.dest('src/styles'))
});

gulp.task('build', function () {
  gulp.src(paths.editor)
    .pipe(concat('module.js'))
    .pipe(gulp.dest('src/scripts/editor'));

  gulp.src(paths.toolbar)
    .pipe(concat('module.js'))
    .pipe(gulp.dest('src/scripts/toolbar'));

  gulp.src(paths.tabs)
    .pipe(concat('module.js'))
    .pipe(gulp.dest('src/scripts/tabs'));
});

gulp.task('watch', function () {
  gulp.watch('src/styles/*.less', ['styles']);
  gulp.watch(['src/scripts/*/*.js', '!src/scripts/*/module.js'], ['build']);
});

gulp.task('build.v2', function () {
  gulp.src(['src/scripts/*/*.js', '!src/scripts/*/module.js'])
    .pipe(concat('module.js'))
    .pipe(gulp.dest('src/scripts/'));
});

/*gulp.task('build', function () {
  gulp.src(paths.services)
    .pipe(concat('services.js'))
    .pipe(gulp.dest('src/scripts'));
});*/

gulp.task('default', ['styles', 'watch']);
