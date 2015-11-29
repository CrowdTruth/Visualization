var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var less = require('gulp-less');
var ospath = require('path');
var concat = require('gulp-concat');

var path = {
  HTML: 'src/index.html',
  LESS: 'src/less/main.less',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  ENTRY_POINT: './src/js/App.js',
  FRONTWISE_PATH: './src/js/frontwise-blocks/*.js',
  VENDOR: './src/js/vendor/*.js'
};

gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

gulp.task('less', function() {
  return gulp.src(path.LESS)
    .pipe(less({
      paths: [ ospath.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest(path.DEST_SRC));
});


gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copy']);
  gulp.watch(path.LESS , ['less']);
  gulp.watch(path.FRONTWISE_PATH, ['frontwise']);


  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC))
      console.log('Updated');
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify(path.MINIFIED_OUT)))
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('buildsrc', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});

gulp.task('production', ['replaceHTML', 'build']);

gulp.task('frontwise', function(){
  gulp.src(path.FRONTWISE_PATH)
    .pipe(concat('frontwise.js'))
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('vendor', function(){
  gulp.src(path.VENDOR)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('default', ['watch']);