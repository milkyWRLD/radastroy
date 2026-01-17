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
function showMediaChoice(youtubeUrl, rutubeUrl, vkUrl, title, desc) {
	console.log('showMediaChoice called with:', {youtubeUrl, rutubeUrl, vkUrl, title, desc});
	
	// If no videos available, just return
	if (!youtubeUrl && !rutubeUrl && !vkUrl) {
		console.log('No video URLs available');
		return;
	}
	
	// Check if jQuery is available
	if (typeof $ === 'undefined') {
		console.error('jQuery is not available');
		return;
	}
	
	// Set title and description
	try {
		$('.popup_media_choice .media-title').text(title || 'Видео');
		$('.popup_media_choice .media-desc').text(desc || '');
		console.log('Title and description set');
	} catch(e) {
		console.error('Error setting title/description:', e);
	}

	// show overlay and modal with fade
	try {
		console.log('speedPopupShow:', speedPopupShow);
		$('.overlay').stop(true).fadeTo(speedPopupShow, 0.6);
		$('.popup_media_choice').stop(true).fadeTo(speedPopupShow, 1).css('display','block');
		console.log('Modal opened successfully');
	} catch(e) {
		console.error('Error opening modal:', e);
		// Fallback: show modal without animation
		try {
			$('.overlay').show();
			$('.popup_media_choice').show();
		} catch(e2) {
			console.error('Fallback also failed:', e2);
		}
		return;
	}

	// Hide all buttons first
	try {
		$('.btn-media-youtube, .btn-media-rutube, .btn-media-vk').hide();
	} catch(e) {
		console.error('Error hiding buttons:', e);
	}

	// Show and configure YouTube button if available
	if (youtubeUrl) {
		console.log('Adding YouTube button');
		try {
			$('.btn-media-youtube').show().off('click').on('click', function(e){
				e.preventDefault();
				e.stopPropagation();
				window.open(youtubeUrl, '_blank');
				closeAllPopup();
			});
		} catch(e) {
			console.error('Error setting up YouTube button:', e);
		}
	}

	// Show and configure RuTube button if available
	if (rutubeUrl) {
		console.log('Adding RuTube button');
		try {
			$('.btn-media-rutube').show().off('click').on('click', function(e){
				e.preventDefault();
				e.stopPropagation();
				window.open(rutubeUrl, '_blank');
				closeAllPopup();
			});
		} catch(e) {
			console.error('Error setting up RuTube button:', e);
		}
	}

	// Show and configure VK button if available
	if (vkUrl) {
		console.log('Adding VK button');
		try {
			$('.btn-media-vk').show().off('click').on('click', function(e){
				e.preventDefault();
				e.stopPropagation();
				window.open(vkUrl, '_blank');
				closeAllPopup();
			});
		} catch(e) {
			console.error('Error setting up VK button:', e);
		}
	}
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
			// Также исключаем кнопки викторины и ссылку на открытие бота
			if ($(this).is('#prev-review, #next-review, #calc-form button, .service-calc-btn, #quiz-btn, #quiz-copy-email, #quiz-copy-code, #quiz-open-bot')) return;
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

		// Калькулятор стоимости (современная логика с актуальными ценами)
		// Расчет стоимости по типу услуги, площади и дополнительным опциям
		$("#calc-form").on("submit", function(e){
			e.preventDefault();
			// Получаем значения формы
			const service = $(this).find('[name="service"]').val();
			const area = parseInt($(this).find('[name="area"]').val(), 10);
			const option = $(this).find('[name="options"]').val();
			let baseCost = 0, description = '';
			
			// Актуальные цены на основе прайс-листа
			switch(service) {
				case 'well':
					// Обустройство скважины (скважинный адаптер) от 32.000 р
					baseCost = 32000;
					description = 'Обустройство скважины со скважинным адаптером';
					break;
				case 'heating':
					// Монтаж и обвязка котла отопления электрического (мини-котельная) от 14.000 р
					baseCost = 14000 + (area > 150 ? 5000 : 0); // добавка за большую площадь
					description = 'Монтаж и обвязка котла отопления электрического';
					break;
				case 'sewer':
					// Монтаж септика-отстойника, пластик от 27.000 р
					baseCost = 27000 + (area > 200 ? 8000 : 0); // добавка за большую площадь
					description = 'Монтаж септика-отстойника';
					break;
				case 'water':
					// Монтаж точки водоразбора от 1.900 р + базовые работы
					baseCost = 3500 + (area * 15); // 15р за кв.м на разводку
					description = 'Система водоснабжения с монтажом точек разбора';
					break;
			}
			
			let price = baseCost;
			let discount = 0;
			
			// Обработка дополнительных опций
			if(option === 'fast') {
				price += 5000;
				description += ' + срочный выезд';
			}
			if(option === 'warranty') {
				price += 3500;
				description += ' + увеличенная гарантия';
			}
			
			// Скидка при больших объемах (более 150k)
			if(price > 150000) {
				discount = Math.floor(price * 0.05); // 5% скидка
				price -= discount;
				description += ' (применена скидка 5%)';
			}
			
			// Форматирование и вывод результата с разбивкой
			let resultText = '<strong style="font-size: 1.3em; color: #2563eb;">Ориентировочная стоимость:</strong><br>';
			resultText += baseCost.toLocaleString('ru-RU') + ' ₽ (базовая стоимость)';
			
			if(option !== 'none') {
				let optionCost = (option === 'fast' ? 5000 : 3500);
				resultText += '<br>' + optionCost.toLocaleString('ru-RU') + ' ₽ (опция)';
			}
			
			if(discount > 0) {
				resultText += '<br><span style="color: #22c55e;">-' + discount.toLocaleString('ru-RU') + ' ₽ (скидка)</span>';
			}
			
			resultText += '<br><hr style="margin: 8px 0; border: none; border-top: 1px solid #cbd5e1;">';
			resultText += '<strong style="font-size: 1.2em;">Итого: ' + price.toLocaleString('ru-RU') + ' ₽</strong>';
			resultText += '<br><small style="color: #64748b;">' + description + '</small>';
			
			// Плавный вывод результата
			$("#calc-result").hide().html(resultText).fadeIn(200);
		});
		// Логика: базовая стоимость услуги + дополнительные опции, с учетом скидок при больших объемах

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

		// Логика модального окна викторины
		$('#quiz-btn').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			$('#quiz-modal').fadeIn(200);
		});

		$('#quiz-close, #quiz-modal .modal-overlay').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			if ($(e.target).is('#quiz-modal, #quiz-close, .modal-overlay')) {
				$('#quiz-modal').fadeOut(200);
			}
		});

		// Копирование email
		$('#quiz-copy-email').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			const email = 'K1Aleks@yandex.ru';
			navigator.clipboard.writeText(email).then(() => {
				const originalText = $(this).text();
				$(this).text('✅ Email скопирован!');
				setTimeout(() => {
					$(this).text(originalText);
				}, 2000);
			});
		});

		// Копирование кода
		$('#quiz-copy-code').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			const code = '6a4d-cc92-724c-f7bf';
			navigator.clipboard.writeText(code).then(() => {
				const originalText = $(this).text();
				$(this).text('✅ Код скопирован!');
				setTimeout(() => {
					$(this).text(originalText);
				}, 2000);
			});
		});

		// Закрытие модального окна по клавише Escape
		$(document).on('keydown', function(e) {
			if (e.key === 'Escape' && $('#quiz-modal').is(':visible')) {
				$('#quiz-modal').fadeOut(200);
			}
		});
	});
});