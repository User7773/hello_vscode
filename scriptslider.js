$(document).ready(function () {
	$('.slider').slick({
		arrows: true,
		dots: true,
		adaptiveHeight: true,
		slidesToShow: 3,
		//скорость+сколько за раз
		slidesToScroll: 3,
		speed: 300,
		easing: "linear",
		//бескончная
		infinite: true,
		initialSlide: 0,
		//автопроигрывание
		autoplay: false,
		autoplaySpeed: 3000,
		pauseOnFocus: true,
		pauseOnHover: true,
		pauseOnDotsHover: true,
		//мышкой листать
		draggable: true,
		swipe: true,
		touchThreshold: 5,
		touchMove: true,
		//клик на стрелку с задержкой(спамить)
		waitForAnimate: true,
		//главный слайд по центру - true
		centerMode: false,
		//Автоматическая адаптивность слайдера
		variableWidth: false,
		//ряды
		rows: 1,
		//кол-во слайдеров в ряду
		slidesPerRow: 1,
		//Связка двух слайдеров, asNavFor
		asNavFor: ".sliderbig",
		//Адаптивность через брейкпоинты
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			}, {
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		],
		//Перемещение стрелок/точек в контейнер, appendArrows:$('.class') 
		//appendDots:$('.class')
	});
	//чинит слайдер
	$('.slider').slick('setPosition');
	//Отключает слайдер
	//$('.slider').slick('unslick');

	$('.sliderbig').slick({
		arrows: false,
		//Слайды заменяются, fade
		fade: true,
		asNavFor: ".slider"
	});
	//Основные события слайдера
	//$('.sliderbig').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
	//	console.log(nextSlide);
	//});
});
