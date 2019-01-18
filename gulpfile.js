// Blacklist    https://github.com/gulpjs/plugins/blob/master/src/blackList.json
var gulp = require('gulp'),
	jade = require('gulp-jade'),
	pug = require('gulp-pug'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	rename = require("gulp-rename"),
	browserSync = require('browser-sync').create(),
	autoprefixer = require('gulp-autoprefixer'),
	mini = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	del = require('del'),
	runSequence = require('run-sequence'),
	fs = require("fs"),
	path = require("path");

var devel = 'source/devel/',
	build = 'source/build/';

var prefix = {
	browsers: ['last 5 versions'],
	cascade: false
}

var other_files_copy = 'json';

function includeJS(file) {
	var str = fs.readFileSync(file.path,'utf8');
	var file_name = path.basename(file.path);
	var file_path = file.path.replace(file_name,'');

	var str_from = '//#include("';
	var str_to = '");';
	var arr = [];

	if (str.indexOf(str_from) !== -1) getPath(str_from,str_to,0);

	function getPath(from,to,search){
		var substr_from = str.indexOf(from,search) + from.length;
		var substr_to = str.indexOf(to,substr_from);
		var res = str.slice(substr_from,substr_to);
		arr.push(res);
		if (str.indexOf(from,substr_to) !== -1) {
			getPath(from,to,substr_to);
		}
	}

	for (var i = 0; i < arr.length; i++) {
		if (arr[i]) {
			var replace_to = fs.readFileSync(file_path+arr[i],'utf8');
			str = str.replace(str_from+arr[i]+str_to,replace_to);
		}
	}

	file.contents = Buffer.from(str);
}



///////////////////////////////////////////////////////////////////////////////////////
//                                                              JADE
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('Pug', function() {
	return gulp.src(['!**/_*/**','!**/_*',devel + '**/*.{pug,jade}'])
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(build))
});


///////////////////////////////////////////////////////////////////////////////////////
//                                                              SASS
///////////////////////////////////////////////////////////////////////////////////////
//sass - задача для главного файла стилей
gulp.task('sass', function() {
	return gulp.src(['!**/_*/**','!**/_*',devel + '**/*.{sass,scss}'])
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer(prefix))
		.pipe(gulp.dest(build))
});

gulp.task('css:min', function() {
	return gulp.src(['!' + build + '**/*.min.css', build + '**/*.css'])
		.pipe(mini())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(build))
});

gulp.task('Sass', function() {
	runSequence('sass', 'css:min');
});


///////////////////////////////////////////////////////////////////////////////////////
//                                                              JAVASCRIPT
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('js', function() {
	return gulp.src(['!**/_*/**','!**/_*',devel + '**/*.js'])
		.pipe(plumber())
		.on('data',function(file){includeJS(file)})
		.pipe(gulp.dest(build))
});

gulp.task('js:min', function() {
	return gulp.src(['!' + build + '**/*.min.js', build + '**/*.js'])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(build))
});

gulp.task('JavaScript', function() {
	runSequence('js', 'js:min');
});



///////////////////////////////////////////////////////////////////////////////////////
//                                                              COPY
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('copy:font', function() {
	return gulp.src(devel + '**/*.{woff,woff2,ttf}')
	.on('data',function(file){
			file.path = file.path.replace('_module\\','').replace('_font','fonts');
	})
	.pipe(gulp.dest(build))
});

gulp.task('copy:img', function() {
	return gulp.src(['!**/_*/**','!**/_*',devel + '**/*.{png,jpg,svg}'])
	.pipe(gulp.dest(build))
});

gulp.task('copy:other', function() {
	return gulp.src(['!**/_*/**','!**/_*',devel + '**/*.' + other_files_copy])
	.pipe(gulp.dest(build))
});

gulp.task('copy', function() {
	runSequence('copy:font', 'copy:img', 'copy:other');
});



///////////////////////////////////////////////////////////////////////////////////////
//                                                              CLEAN
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('clean', function() {
	del(build);
});



///////////////////////////////////////////////////////////////////////////////////////
//                                                              SERVER
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('server', function() {
	browserSync.init({
		port: 9000,
		server: {
			baseDir: './'
		}
	});
});



///////////////////////////////////////////////////////////////////////////////////////
//                                                              WATCHING
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('watching', function() {
	gulp.watch(devel + '**/*.{sass,scss}', ['Sass']).on('change', browserSync.reload);
	gulp.watch(devel + '**/*.{pug,jade}', ['Pug']).on('change', browserSync.reload);
	gulp.watch(devel + '**/*.js', ['JavaScript']).on('change', browserSync.reload);
	// gulp.watch(build + '**/*.{html,css,js}').on('change', browserSync.reload);
});



///////////////////////////////////////////////////////////////////////////////////////
//                                                              RUN
///////////////////////////////////////////////////////////////////////////////////////
// dev
gulp.task('dev', ['Pug', 'Sass', 'JavaScript', 'copy']);

// default
gulp.task('default', ['dev', 'server', 'watching']);
