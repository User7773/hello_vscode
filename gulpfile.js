let project_folder = require("path").basename(__dirname);
let source_folder = "#src";
let fs = require('fs');//шрифты сразу подключаются к файлу стилей

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html",],//все файлы html сливаются в один в папке dist
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/script.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,ico,webp}",
		fonts: source_folder + "/fonts/*.ttf",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,ico,webp}",
	},
	clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass")(require('sass')),
	autoprefixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	webp = require("gulp-webp"),
	webphtml = require("gulp-webp-html"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2"),
	fonter = require("gulp-fonter");

function browserSync(params) {//обновляет страницу
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}//обновляет страницу

function html() {//создает папку dist с html
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}//создает папку dist с html

function css() {//конвентирует scss в папку dist>css
	return src(path.src.css)
		.pipe(
			scss({ outputStyle: 'expanded' }).on('error', scss.logError)
		)
		.pipe(
			group_media()//медиа запросы всегда в конце css по итогу
		)
		.pipe(//адапатация свойств под разные версии браузеров(например -webkit-box:)
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)//адапатация свойств под разные версии браузеров(например -webkit-box:)
		.pipe(dest(path.build.css))//выгружает файл 1 раз
		.pipe(clean_css())//сжимает файл css
		.pipe(
			rename({
				extname: ".min.css"//переименовывает сжатый файл
			})
		)
		.pipe(dest(path.build.css))//выгружает файл 2 раз

		.pipe(browsersync.stream())
}//конвентирует scss в папку dist>css


function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(
			uglify()
		)
		.pipe(
			rename({
				extname: ".min.js"//переименовывает сжатый файл
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70 //качество webp изображения
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({//сжимает картинку
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 //от 0 до 7
			})//сжимает картинку
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

function fonts() {//конвентирует шрифты
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
};//конвентирует шрифты

gulp.task('otf2ttf', function () {//конвентирует шрифты otf в ttf, если они есть    //tf2ttf
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/fonts/'));
})//конвентирует шрифты otf в ttf, если они есть

function fontsStyle(params) {//КОНВЕНТИРУЕТ ШРИФТЫ В fonts.scss
	let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}
function cb() { }//КОНВЕНТИРУЕТ ШРИФТЫ В fonts.scss


function watchFiles(params) {//обновляет содержимое сайта сразу при редактировании
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}//обновляет содержимое сайта сразу при редактировании

function clean(params) {//удаляется папка dist и создается заново
	return del(path.clean);
}//удаляется папка dist и создается заново
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;