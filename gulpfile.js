var gulp = require('gulp');
var argv = require('yargs').argv;
var gulpSequence = require('gulp-sequence');
var exec = require('child_process').exec;

var now = new Date();

gulp.task('copy:mdi:fonts', function() {
	return gulp.src(['./node_modules/mdi/fonts/**/*'], {
		base: './node_modules/mdi/fonts/'
	}).pipe(gulp.dest('./src/assets/fonts/materialdesignicons/'));
});

gulp.task('copy:resources', function(cb) {
	gulpSequence('copy:mdi:fonts', cb);
});

gulp.task('ng:build', function (cb) {
	
	var env = argv.e || argv.env || argv.environment || 'dev';

	var target = argv.t || argv.target || 'development';

	var cmd = 'ng build --env=' + env + ' --target=' + target + (target === 'production' ? ' --aot --build-optimizer' : '');

	console.log(cmd);
	exec(cmd, {maxBuffer: 1024 * 500}, function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});

	// # these are equivalent
	// ng build --target=production --environment=prod
	// ng build --prod --env=prod
	// ng build --prod
	// # and so are these
	// ng build --target=development --environment=dev
	// ng build --dev --e=dev
	// ng build --dev
	// ng build
});