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

// show media choice modal and populate handlers
function showMediaChoice(youtubeUrl, rutubeUrl, title) {
	if (!youtubeUrl && !rutubeUrl) return;
	$('.popup_media_choice .media-title').text('Видео — ' + (title || 'объект'));

	// show overlay and modal with fade
	$('.overlay').stop(true).fadeTo(speedPopupShow, 0.6);
	$('.popup_media_choice').stop(true).fadeTo(speedPopupShow, 1).css('display','block');

	// store urls on buttons for later
	$('.btn-media-youtube').data('video', youtubeUrl || '');
	$('.btn-media-rutube').data('video', rutubeUrl || '');

	// unbind previous handlers and attach new ones
	$('.btn-media-youtube').off('click').on('click', function(e){
		e.preventDefault();
		var url = $(this).data('video');
		if (!url) return;
		// try to form embed URL for common YouTube forms
		var embed = url;
		try {
			if (/youtube\.com\/watch/.test(url) || /youtu\.be\//.test(url) || /youtube\.com\/embed\//.test(url)) {
				var id = null;
				if (url.indexOf('v=') !== -1) {
					id = url.split('v=')[1].split('&')[0];
				} else if (url.indexOf('youtu.be/') !== -1) {
					id = url.split('youtu.be/')[1].split('?')[0];
				} else if (url.indexOf('embed/') !== -1) {
					id = url.split('embed/')[1].split('?')[0];
				}
				if (id) embed = 'https://www.youtube.com/embed/' + id + '?rel=0&autoplay=1';
			}
		} catch(err) { /* ignore and use raw url */ }
		showPopupVideo(embed);
		// hide media choice
		$('.popup_media_choice').fadeTo(120, 0, function(){ $(this).hide(); });
		$('.overlay').fadeTo(120, 0, function(){ $(this).hide(); });
	});

	$('.btn-media-rutube').off('click').on('click', function(e){
		e.preventDefault();
		var url = $(this).data('video');
		if (!url) return;
		var embed = url;
		var canEmbed = false;
		try {
			if (/rutube\.ru\/video\//.test(url)) {
				var id = url.split('rutube.ru/video/')[1].replace(/\/$/, '').split('?')[0];
				if (id) {
					embed = 'https://rutube.ru/play/embed/' + id;
					canEmbed = true;
				}
			} else if (/rutube\.ru\/play\/embed\//.test(url)) {
				canEmbed = true;
			}
		} catch(err) { canEmbed = false; }

		if (canEmbed) {
			// try to embed inside site
			showPopupVideo(embed);
		} else {
			// fallback: open original URL in a new tab so user can view it
			window.open(url, '_blank');
		}

		$('.popup_media_choice').fadeTo(120, 0, function(){ $(this).hide(); });
		$('.overlay').fadeTo(120, 0, function(){ $(this).hide(); });
	});
}
function closeAllPopup() {
	$('.overlay, .popup_present, .popup_video, .popup_success, .popup_media_choice').fadeTo(speedPopupShow, 0, function() {
		$("#video-content iframe").attr("src", "");
		setTimeout(function () {
			$('.overlay, .popup_present, .popup_video, .popup_success, .popup_media_choice').hide();
		}, 500);        
	});
}

// Close popups on ESC key and ensure iframe is cleared
$(document).on('keydown', function(e){
	if (e.key === 'Escape' || e.keyCode === 27) {
		closeAllPopup();
	}
});

// Ensure clicking explicit close buttons immediately clears iframe and hides
$(document).on('click', '.close_popup', function(e){
	e.preventDefault();
	// clear iframe immediately
	try { $("#video-content iframe").attr('src', ''); } catch(e) {}
	closeAllPopup();
});

$(function() {
	$(document).ready(function(){
		$("#scrollTop").click(function(e) {
			e.preventDefault();
			$('html, body').animate({ scrollTop: 0 }, 'slow');
		});

		$(".btn, .btn-img, .btn-call").click(function(e){
			// Исключение для кнопок слайдера отзывов и калькулятора и кнопки расчёта в модале
			if ($(this).is('#prev-review, #next-review, #calc-form button, .service-calc-btn')) return;
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

			// Mobile burger menu toggle (small devices)
			(function(){
				try {
					var $ = window.jQuery;
					if (!$) return;
					var $burger = $('.burger-btn');
					var $nav = $('#mobile-nav');
					var previousFocus = null;
					var $firstFocusable = null;
					var $lastFocusable = null;

					function updateFocusable() {
						var focusable = $nav.find('a, button, [tabindex]:not([tabindex="-1"])').filter(':visible');
						$firstFocusable = focusable.first();
						$lastFocusable = focusable.last();
					}

					function closeNav() {
						$burger.removeClass('open').attr('aria-expanded','false');
						$nav.removeClass('open').attr('aria-hidden','true');
						$('body').removeClass('no-scroll');
						// return focus
						try { if (previousFocus && previousFocus.length) previousFocus.focus(); } catch(e){}
						previousFocus = null;
						$(document).off('keydown.mobileNav');
					}
					function openNav() {
						previousFocus = $(document.activeElement);
						$burger.addClass('open').attr('aria-expanded','true');
						$nav.addClass('open').attr('aria-hidden','false');
						$('body').addClass('no-scroll');
						updateFocusable();
						// focus first focusable element
						try { if ($firstFocusable && $firstFocusable.length) $firstFocusable.focus(); }
						catch(e){}

						// trap Tab inside nav and close on ESC
						$(document).on('keydown.mobileNav', function(e){
							if (e.key === 'Escape' || e.keyCode === 27) { closeNav(); return; }
							if (e.key === 'Tab' || e.keyCode === 9) {
								updateFocusable();
								if (!$firstFocusable || !$firstFocusable.length) return;
								if (e.shiftKey) {
									if (document.activeElement === $firstFocusable[0]) {
										e.preventDefault();
										$lastFocusable.focus();
									}
								} else {
									if (document.activeElement === $lastFocusable[0]) {
										e.preventDefault();
										$firstFocusable.focus();
									}
								}
							}
						});
					}

					$burger.on('click', function(e){
						e.stopPropagation();
						if ($(this).hasClass('open')) closeNav(); else openNav();
					});

					// clicking overlay outside panel closes
					$nav.on('click', function(e){
						if (e.target === this) closeNav();
					});

					// close button inside panel
					$nav.find('.mobile-nav-close').on('click', function(){ closeNav(); });

					// close on link click inside nav
					$nav.find('a').on('click', function(){ closeNav(); });

					// ensure ESC also handled if not focused on document
					// (handled by keydown.mobileNav while open)
				} catch (err) { console.error('Burger init error', err); }
			})();

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

		// Service modal logic: intercept .service-card link clicks and open modal
		function openServiceModal(data) {
			var $modal = $('#service-modal');
			$modal.attr('aria-hidden', 'false').show();
			$('.service-modal__title').text(data.title || 'Услуга');
			// subtitle element may not exist (removed by design) so guard
			if ($('.service-modal__subtitle').length) {
				$('.service-modal__subtitle').text(data.subtitle || '');
			}
			if (data.image) {
				$('.service-modal__hero').css('background-image', 'url("' + data.image + '")');
			} else {
				$('.service-modal__hero').css('background-image', 'none');
			}
			$('.service-modal__desc').html(data.description || '');
			$('.service-calc-form [name="service-type"]').val(data.type || 'well');
			// populate call link from first header phone (preserve tel: link)
			var headerPhoneHref = $('.header-phone a').first().attr('href') || '';
			if (headerPhoneHref) {
				$('#service-call-link').attr('href', headerPhoneHref);
			}
			$('.service-calc-result').empty();
		}

		function closeServiceModal() {
			var $modal = $('#service-modal');
			$modal.attr('aria-hidden', 'true').hide();
		}

		$(document).on('click', '.service-card, .service-card *', function(e){
			// find the anchor element to preserve href fallback
			var $a = $(this).closest('a');
			if (!$a.length) return;
			// build data to show in modal from data-* attributes if provided
			var data = {
				title: $a.find('.service-card-title').text() || $a.attr('title') || $a.text(),
				subtitle: $a.data('subtitle') || '',
				description: $a.data('description') || $a.find('.service-card-desc').html() || '',
				image: $a.data('image') || $a.find('img').attr('src') || null,
				type: $a.data('type') || $a.data('service') || ''
			};
			// prevent navigation and open modal
			e.preventDefault();
			openServiceModal(data);
		});

		// Close handlers
		$(document).on('click', '.service-modal__close, .service-modal__backdrop', function(e){
			closeServiceModal();
		});

		// NOTE: buttons for 'send mail' and 'call' were removed from service modal — use main contact popup instead.

		// Service calc inside modal
		var servicePopupTimer = null; // timer id for delayed opening of contact popup

		$(document).on('click', '.service-calc-btn', function(){
			var $form = $(this).closest('.service-calc-form');
			var area = parseInt($form.find('[name="area"]').val(), 10) || 100;
			var type = $form.find('[name="service-type"]').val();
			var base = 0, perM2 = 0;
			switch(type) {
				case 'well': base = 80000; perM2 = 100; break;
				case 'heating': base = 50000; perM2 = 350; break;
				case 'sewer': base = 40000; perM2 = 200; break;
				case 'water': base = 30000; perM2 = 120; break;
			}
			var price = base + area * perM2;
			$form.find('.service-calc-result').text('Ориентировочная стоимость: ' + price.toLocaleString('ru-RU') + ' ₽');

			// Clear any previous timer and set a new one to open the main contact popup after 5s
			try { if (servicePopupTimer) clearTimeout(servicePopupTimer); } catch(e){}
			servicePopupTimer = setTimeout(function(){
				// gather context: service title and header email (if available)
				var svcTitle = $('.service-modal__title').text() || '';
				var headerEmailHref = $('.header-email a').attr('href') || '';
				var headerEmail = headerEmailHref.replace(/^mailto:/i, '');
				// populate hidden fields in popup_present form if present
				try {
					$('#popup_present_form [name="service_requested"]').val(svcTitle);
					$('#popup_present_form [name="to"]').val(headerEmail);
				} catch(e){}
				// close service modal and open main contact popup
				try { closeServiceModal(); } catch(e){}
				try { showPopupPresent(); } catch(e){}
			}, 5000);
		});

		// Service contact form submission via AJAX (reuse existing success flow)
		$('#service-contact-form').ajaxForm({
			success: function(responseText) {
				// close modal and show success popup
				closeServiceModal();
				showPopupSuccess();
				try { yaCounter38407175.reachGoal('ServiceContact'); } catch(e) {}
			},
			error: function(res, val) {
				console.log('Service contact error', res, val);
			}
		});
	});    
});