var speedPopupShow = 150;

function showPopupPresent() {
	$(".overlay, .popup_present").fadeTo(speedPopupShow, 1);
}
function showPopupSuccess() {
	$('.popup_success, .overlay').fadeTo(speedPopupShow, 1);
}
function showPopupVideo(srcres) {
	$("#video-content iframe").attr("src", srcres);
	$('.popup_video, .overlay').fadeTo(speedPopupShow, 1);
}
function closeAllPopup() {
	$('.overlay, .popup_present, .popup_video, .popup_success').fadeTo(speedPopupShow, 0, function() {
		$("#video-content iframe").attr("src", "");	
		setTimeout(function () {
			$('.overlay, .popup_present, .popup_video, .popup_success').hide();
		}, 500);		
	});
}

$(function() {
	$(document).ready(function(){
		$("#scrollTop").click(function(e) {
			e.preventDefault();
			$('html, body').animate({ scrollTop: 0 }, 'slow');
		});

		$(".btn, .btn-img, .btn-call").click(function(e){
			// Исключение для кнопок слайдера отзывов и калькулятора
			if ($(this).is('#prev-review, #next-review, #calc-form button')) return;
			e.preventDefault();
			showPopupPresent();
		});

		$("#closePopupSuccess").click(function(e){
			e.preventDefault();
			closeAllPopup();
		});

		$(".video-link").click(function(e){
			var res = $(this).attr("data-res");
			e.preventDefault();
			showPopupVideo(res);
		});

		$('.close_popup, .overlay').click(function (){        
			closeAllPopup();
		});

		$("#submitPresentForm").click(function(e){
			e.preventDefault();
			$("#popup_present_form").submit();
			$('.popup_present').fadeTo(speedPopupShow, 0, function() {
				setTimeout(function () {
					$('popup_present').hide();
					showPopupSuccess();
				}, 500);        
			});
		});

		$("#popup_present_form").ajaxForm({
			success: function(responseText) {
				// Добавляем цель в яндекс.метрику
				yaCounter38407175.reachGoal('SubmitPresentForm');
			},
			error: function(res, val) {
				console.log(res);
				console.log(val);
			}
		});

		// Карусель отзывов и кейсов
		let reviewIndex = 0;
		const $carousel = $(".reviews-carousel");
		const $reviews = $carousel.find(".review");
		function showReview(idx) {
			$reviews.removeClass("active");
			$reviews.eq(idx).addClass("active");
		}
		showReview(reviewIndex);
		$("#prev-review").click(function(){
			reviewIndex = (reviewIndex - 1 + $reviews.length) % $reviews.length;
			showReview(reviewIndex);
		});
		$("#next-review").click(function(){
			reviewIndex = (reviewIndex + 1) % $reviews.length;
			showReview(reviewIndex);
		});
		// Swipe для мобильных
		let startX = null;
		$carousel.on('touchstart', function(e) {
			startX = e.originalEvent.touches[0].clientX;
		});
		$carousel.on('touchend', function(e) {
			if (startX === null) return;
			let endX = e.originalEvent.changedTouches[0].clientX;
			if (endX - startX > 40) { // swipe right
				reviewIndex = (reviewIndex - 1 + $reviews.length) % $reviews.length;
				showReview(reviewIndex);
			} else if (startX - endX > 40) { // swipe left
				reviewIndex = (reviewIndex + 1) % $reviews.length;
				showReview(reviewIndex);
			}
			startX = null;
		});

		// Калькулятор стоимости (современная логика)
		// Расчет стоимости по типу услуги, площади и дополнительным опциям
		$("#calc-form").on("submit", function(e){
			e.preventDefault();
			// Получаем значения формы
			const service = $(this).find('[name="service"]').val();
			const area = parseInt($(this).find('[name="area"]').val(), 10);
			const option = $(this).find('[name="options"]').val();
			let base = 0, perM2 = 0;
			// Базовые цены и цена за м2
			switch(service) {
				case 'well': base = 80000; perM2 = 100; break;
				case 'heating': base = 50000; perM2 = 350; break;
				case 'sewer': base = 40000; perM2 = 200; break;
				case 'water': base = 30000; perM2 = 120; break;
			}
			let price = base + area * perM2;
			// Обработка дополнительных опций
			if(option === 'fast') price += 10000;
			if(option === 'warranty') price += 7000;
			// Плавный вывод результата
			$("#calc-result").hide().text('Ориентировочная стоимость: ' + price.toLocaleString('ru-RU') + ' ₽').fadeIn(200);
		});
		// Логика: базовая стоимость + площадь * ставка + опции. Все значения легко менять в switch/if.

		// Плавный скролл для всех якорных ссылок
		if ('scrollBehavior' in document.documentElement.style) {
		  document.documentElement.style.scrollBehavior = 'smooth';
		} else {
		  $(document).on('click', 'a[href^="#"]', function(e) {
		    var target = $(this.getAttribute('href'));
		    if (target.length) {
		      e.preventDefault();
		      $('html, body').animate({ scrollTop: target.offset().top }, 600);
		    }
		  });
		}
	});    
});