$(function () {
    if (model.fontName) {
        $('head').prepend($('<link>').attr({
            rel: 'stylesheet',
            type: 'text/css',
            href: 'http://fonts.googleapis.com/css?family=' + model.fontName + ':200,400,800'
        }));

        $('body').css('font-family', model.fontName);
    }

    if (model.titleFontName) {
        $('head').prepend($('<link>').attr({
            rel: 'stylesheet',
            type: 'text/css',
            href: 'http://fonts.googleapis.com/css?family=' + model.titleFontName + ':800'
        }));
        $('.title-text.main').css('font-family', model.titleFontName);
    }

	model.lang = lang;

	function ContentViewModel(model) {
		var self = this;
		self.subTitle = '';

		$.extend(self, model);

        self.image = currentDir + self.image;
        self.altImage = currentDir + self.altImage;

		if (model[lang]) {
			$.extend(self, model[lang]);
		}

		self.url = ko.computed(function () {
			switch(self.type) {
				case 'youtube':
                    return "//www.youtube.com/embed/" + self.id + "?autoplay=1&autohide=1&iv_load_policy=3&rel=0&enablejsapi=1&theme=" + theme + "&origin=" + window.location.origin;
				case 'vimeo':
                    return "http://player.vimeo.com/video/" + self.id + "?autoplay=1&api=1&player_id=player";
				case 'youku':
                    return "http://player.youku.com/embed/" + self.id + "?autoplay=1";
                                case 'interlude':
                    return "http://in.fm/embed/" + self.id + "?auto_play=true";
				default:
                    return null;
			}
		});
	}

	function ContentPageViewModel(model) {
		var self = this;
		$.extend(self, model);

		self.rows = ko.computed(function () {
			var rows = [];
			if (self.content.length <= 4) {
				rows.push({
					elements: self.content
				});
			}
			else {
				var firstRowCount = Math.ceil(self.content.length / 2);
				rows.push({
					elements: self.content.slice(0, firstRowCount)
				});

				rows.push({
					elements: self.content.slice(firstRowCount, firstRowCount + Math.floor(self.content.length / 2))
				});
			}
			for (var i = 0; i < rows.length; i++) {
				rows[i].elements = $.map(rows[i].elements, function (element) {
					return new ContentViewModel(element);
				});
			}
			return rows;
		});

		self.content = $.map(self.content, function (element) {
			return new ContentViewModel(element);
		});
	}

	function ViewModel(model) {
		var self = this;
		$.extend(self, model);

		self.contentPages = $.map(self.contentPages, function (element) {
			return new ContentPageViewModel(element);
		});

		self.featuredContent = new ContentViewModel(self.featuredContent);

		self.selectedContentPage = ko.observable();
		self.setSelectedContentPage = function (data) {
			if (data) {
                if (self.selectedContent()) {
                    $('.content-container').fadeOut(function () {
                        self.selectedContentPage(data);
                        self.selectedContent('');
                        fadeContentPageContainerIn();
                    });
                }
                else if (self.selectedContentPage()) {
                    $('.content-page-container').fadeOut(function () {
                        self.selectedContentPage(data);
                        self.selectedContent('');
                        fadeContentPageContainerIn();
                    });
                }
                else {
                    $('.featured-container').fadeOut(function () {
                        $('.featured-container').show().css('visibility', 'hidden');
                        self.selectedContentPage(data);
                        self.selectedContent('');
                        fadeContentPageContainerIn();
                    });
                }
			}
			else {
                if (self.selectedContent()) {
                    $('.content-container').fadeOut(function () {
                        self.selectedContentPage('');
                        self.selectedContent('');
                        $('.featured-container').hide().css('visibility', 'visible').fadeIn()
                    });
                }
                else {
                    $('.content-page-container').fadeOut(function () {
                        self.selectedContentPage('');
                        self.selectedContent('');
                        $('.featured-container').hide().css('visibility', 'visible').fadeIn()
                    });
                }
			}
		}

		self.selectedContent = ko.observable('');
        self.afterRenderSelectedContent = function () {
            if (self.selectedContent().type === 'youtube') {
                new YT.Player('player', {
                    events: {
                        onStateChange: function (state) {
                            if (state.data === YT.PlayerState.ENDED) {
                                self.setSelectedContent('');
                            }
                        }
                    }
                });
            }
            else if (self.selectedContent().type === 'vimeo') {
                var iframe = $('#player')[0];
                self.player = $f(iframe);

                // When the player is ready, add listeners
                self.player.addEvent('ready', function() {
                    self.player.isReady = true;
                    self.player.addEvent('finish', function () {
                        self.setSelectedContent('');
                    });
                });
            }
        }
		self.setSelectedContent = function (data) {
            if (data) {
                function fadeContentIn() {
                    self.selectedContent(data);
                    $('.content-container').fadeIn();
                }
                if (self.selectedContentPage()) {
                    $('.content-page-container').fadeOut(fadeContentIn);
                }
                else {
                    $('.featured-container').fadeOut(function () {
                        $('.featured-container').show().css('visibility', 'hidden');
                        fadeContentIn();
                    });
                }
            }
            else {
                if (self.selectedContentPage()) {
                    $('.content-container').fadeOut(function () {
                        self.selectedContent('');
                        fadeContentPageContainerIn();
                    });
                }
                else {
                    $('.content-container').fadeOut(function () {
                        self.selectedContent('');
                        $('.featured-container').hide().css('visibility', 'visible').fadeIn();
                    });
                }
            }
		}

        function fadeContentPageContainerIn() {
            $('.content-page-container figure').css('opacity', 0);
            $('.content-page-container').show();

            var count = $('.content-page-container figure').length;
            var totalDelay = 1000;
            var maxDelay = 500;
            $('.content-page-container figure').sort(function () {
                return Math.round(Math.random()) - 0.5;
            }).each(function (index, element) {
                $(element).delay(totalDelay / count * index).fadeTo(Math.min(totalDelay / count, maxDelay), 1);
            });
        }

        $('.content-page-container').hide();
        $('.content-container').hide();
		$('.info-pane').hide();
		self.selectedInfoPage = ko.observable();
        self.setSelectedInfoPage = function (data) {
			$('.info-pane').fadeOut(function () {
				if (data === self.selectedInfoPage()) {
					self.selectedInfoPage('');
				}
				else {
					self.selectedInfoPage(data);
					$('.info-pane').fadeIn();

					setTimeout(function () {
						window.scrollTo(0, document.body.scrollHeight);
					}, 100);
				}
			});
        }

        self.navigate = function () {
            if (self.selectedContent() && self.selectedContent().youtube) {
                var startTime;
                if (self.player.isReady) {
                    self.player.api('pause');
                    self.player.api('getCurrentTime', function (value) {
                        startTime = value;
                    });
                    setTimeout(function () {
                        var externalUrl = self.selectedContent().youtube;
                        if (startTime) {
                            externalUrl += '&t=' + Math.floor(startTime) + 's';
                        }
                        var win = window.open(externalUrl, '_blank');
                        win.focus();
                    }, 100);
                }
            }
        }
	}

	var viewModel = new ViewModel(model);

	document.title = viewModel.title;

	ko.applyBindings(viewModel);

	$('.featured-image').mousemove(function (e) {
		var xCoord = e.offsetX - $(e.target).width() / 2;
		var yCoord = e.offsetY - $(e.target).height() / 2;

		// console.log(xCoord + ' ' + yCoord);
	});

	$('img.hidden').load(function () {
		$(this).removeClass('hidden');
	});
	$('body').on('mouseover', 'img', function () {
		$('img.hidden').removeClass('hidden');
	});
});
