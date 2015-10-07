var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	stylus = require('gulp-stylus'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	concat = require("gulp-concat"),
	jade = require('gulp-jade'),
	spritesmith = require('gulp.spritesmith'),
	merge = require('merge-stream'),
	reload = browserSync.reload;
//не обязательно делать это именно так. Существует плагин gulp-load-plugins который позволяет не писать всю эту лапшу из require.

//Указываем пути
var path = {
	build: { //Тут мы укажем куда складывать готовые после сборки файлы
		html: 'sp24_tokarev/',
		js: 'sp24_tokarev/js/',
		css: 'sp24_tokarev/css/',
		img: 'sp24_tokarev/img/',
		fonts: 'sp24_tokarev/font/'
	},
	src: { //Пути откуда брать исходники
		jade: 'src/*.jade',
		//html: 'src/*.html', //Синтаксис dev/*.html говорит gulp что мы хотим взять все файлы с расширением .html
		js: 'src/js/*.js',//Указываем на все js файлы
		style: 'src/styles/style.styl', // //Указываем на файлы стилей (и css, и scss)
		img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
		png: 'src/img/png/*.png', // png для спрайтов
		fonts: 'src/font/**/*.*'
	},
	watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
		jade: 'src/*.jade',
		//html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/styles/**/*.*',
		img: 'src/img/**/*.*',
		png: 'src/img/**/*.*',
		fonts: 'src/font/**/*.*'
	},
	clean: './sp24_tokarev'
};

// Создадим переменную с настройками нашего dev сервера:
var config = {
	server: {
		baseDir: "./sp24_tokarev"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "turbo_ddimmy"
};

//Напишем таск для сборки jade:
gulp.task('jade:build', function () {
	gulp.src(path.src.jade) //Выберем файлы по нужному пути
		.pipe(jade({pretty: true})) // Прогоняем через компилятор и добавляем опцию для читаемости кода
		.pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
		.pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

//Напишем таск для сборки html:
//gulp.task('html:build', function () {
//	gulp.src(path.src.html) //Выберем файлы по нужному пути
//		.pipe(rigger()) //Прогоним через rigger
//		.pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
//		.pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
//});

//Таск по сборке скриптов будет выглядеть так:
gulp.task('js:build', function () {
	gulp.src(path.src.js) //Найдем наш main файл
		.pipe(concat('main.js')) //склеиваем все js файлы в общий main.js
		.pipe(sourcemaps.init()) //Инициализируем sourcemap
		.pipe(uglify()) //Сожмем наш js
		.pipe(sourcemaps.write()) //Пропишем карты
		.pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
		.pipe(reload({stream: true})); //И перезагрузим сервер
});

//Напишем задачу для сборки нашего CSS:
gulp.task('style:build', function () {
	gulp.src(path.src.style) //Выберем наш main.scss или main.style
		.pipe(sourcemaps.init()) //То же самое что и с js
//		.pipe(concat('main.css'))//склеиваем все css файлы в общий main.css
//		.pipe(sass()) //Скомпилируем
		.pipe(stylus()) //Скомпилируем
		.pipe(prefixer()) //Добавим вендорные префиксы
//		.pipe(cssmin()) //Сожмем
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css)) //И в build
		.pipe(reload({stream: true}));
});

//Таск по картинкам будет выглядеть так:
gulp.task('image:build', function () {
	gulp.src(path.src.img) //Выберем наши картинки
		.pipe(imagemin({ //Сожмем их
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img)) //И бросим в build
		.pipe(reload({stream: true}));
});

//Таск по созданию спрайтов:
gulp.task('sprite:build', function () {
	gulp.src(path.src.png) //Выберем наши картинки
	var spriteData = gulp.src('src/img/png/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.styl'
	}));

	var imgStream = spriteData.img
		.pipe(gulp.dest(path.build.img));

	var cssStream = spriteData.css
		.pipe(gulp.dest('src/styles/partials'));

	return merge(imgStream, cssStream);
});

//Шрифты
gulp.task('fonts:build', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

//Запускаем все таски сразу:
gulp.task('build', [
	'jade:build',
//	'html:build',
	'js:build',
	'style:build',
	'fonts:build',
	'image:build',
	'sprite:build'
]);

//Watch. Мы просто идем по нашим путям определенным в переменной path, и в функции вызывающейся при изменении файла — просим запустить нужный нам таск.
gulp.task('watch', function(){
	watch([path.watch.jade], function(event, cb) {
		gulp.start('jade:build');
	});
//	watch([path.watch.html], function(event, cb) {
//		gulp.start('html:build');
//	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
});

//Таск для livereload
gulp.task('webserver', function () {
	browserSync(config);
});

//просто будет удаляться папка build.
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

//дефолтный таск, который будет запускать всю нашу сборку.
gulp.task('default', ['build', 'watch', 'webserver']);
