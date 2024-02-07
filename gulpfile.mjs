import gulp from "gulp";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import browserSync from "browser-sync";
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

browserSync.create();

function server(cb) {
	browserSync.init({
		server: {
			baseDir: "./dist"
		},
		notify: false,
		port: 3000,
		open: true
	});

	cb();
}

function css() {
	return gulp
		.src("src/scss/style.scss")
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				outputStyle: "compressed"
			}).on("error", sass.logError)
		)
		.pipe(autoprefixer())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.stream());
}

function html(cb) {
	return gulp.src("src/html/**/*.html").pipe(gulp.dest("./dist"));
}

function js(cb) {
	return gulp.src("./src/js/**/*.js").pipe(gulp.dest("./dist/js"));
}

function reloadOnFileChange(cb) {
	browserSync.reload();
	cb();
}

function watch(cb) {
	gulp.watch("src/scss/**/*.scss", {usePolling: true}, gulp.series(css));
	gulp.watch("src/html/**/*.html", gulp.series(html, reloadOnFileChange));
	gulp.watch("src/js/**/*.js", gulp.series(js, reloadOnFileChange));
	cb();
}

function build(cb) {
	gulp.series(html, js, css)(cb);
}

export {html, css, js, server, watch, build};
export default gulp.series(html, css, js, server, watch);
