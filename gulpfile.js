var elixir = require('laravel-elixir');

require('laravel-elixir-bower');
require('laravel-elixir-angular');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir.config.sourcemaps = false;
elixir.config.registerWatcher("default", "angular/**");

elixir(function (mix) {
	mix
		.bower()
		.angular('angular/')
		.less('../../../angular/**/*.less', 'resources/.tmp/')
		.copy('angular/app/**/*.html', 'public/views/')
		.copy('angular/views/', 'public/views/')
		.copy('angular/directives/**/*.html', 'public/views/directives/')
		.copy('resources/assets/fonts/', 'public/fonts/')
		.copy('resources/assets/img', 'public/assets/img/')
		.stylesIn('resources/.tmp', 'public/css/');

});
