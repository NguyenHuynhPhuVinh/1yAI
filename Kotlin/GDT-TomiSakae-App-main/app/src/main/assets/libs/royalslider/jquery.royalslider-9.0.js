/*
 * RoyalSlider  v9.0
 *
 * Copyright 2011-2012, Dmitry Semenov
 * 
 */

(function($) {
	if(!rsModules) {
		var rsModules = {};
	}
	
	function RoyalSlider(element, options) {
		var ua = navigator.userAgent.toLowerCase(),
			i,
			br = $.browser,
			self = this,
			isWebkit = br.webkit,
			isAndroid = ua.indexOf('android') > -1;
		self.isIPAD = ua.match(/(ipad)/);

		// feature detection, some ideas taken from Modernizr
		var tempStyle = document.createElement('div').style,
			vendors = ['webkit','Moz','ms','O'],
			vendor = '',
			lastTime = 0,
			tempV;

		for (i = 0; i < vendors.length; i++ ) {
			tempV = vendors[i];
			if (!vendor && (tempV + 'Transform') in tempStyle ) {
				vendor = tempV;
			}
			tempV = tempV.toLowerCase();
			
			if(!window.requestAnimationFrame) {
				window.requestAnimationFrame = window[tempV+'RequestAnimationFrame'];
       			window.cancelAnimationFrame = window[tempV+'CancelAnimationFrame'] 
                                   || window[tempV+'CancelRequestAnimationFrame'];
			}
		}

 		// requestAnimationFrame polyfill by Erik Möller
		// fixes from Paul Irish and Tino Zijdel
	    if (!window.requestAnimationFrame) {
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime(),
	            	timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	            	id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	    }
	    if (!window.cancelAnimationFrame) 
	    	window.cancelAnimationFrame = function(id) { clearTimeout(id); };

	    self.slider = $(element);
		self.ev = $({}); // event object
		self._doc = $(document);
		self.st = $.extend({}, $.fn.royalSlider.defaults, options); 
		self._currAnimSpeed = self.st.transitionSpeed;


	    //if(!isWebkit || self.st.allowCSS3OnWebkit) {
	    //	var bT = vendor + (vendor ? 'T' : 't' );
	    //	self._useCSS3Transitions = ( (bT + 'ransform') in tempStyle ) && ( (bT + 'ransition') in tempStyle );
		//    if(self._useCSS3Transitions) {
		//    	self._use3dTransform = (vendor + (vendor ? 'P' : 'p'  ) + 'erspective') in tempStyle;
		//    }
	    //}
	    vendor = vendor.toLowerCase();
	    self._vendorPref = '-'+vendor+'-';


		
		
		self._slidesHorizontal = (self.st.slidesOrientation.toLowerCase() === 'vertical') ? false : true;
		self._reorderProp = self._slidesHorizontal ? 'left' : 'top';
		self._sizeProp = self._slidesHorizontal ? 'width' : 'height';
		
		self._isMove = (self.st.transitionType.toLowerCase() === 'fade') ? false : true;
		if(!self._isMove) {
			self.st.sliderDrag = false;
			self._fadeZIndex = 10;
		}

		self._newSlideId = 0;
		self._sPosition = 0;

		$.each(rsModules, function (helper, opts) {
			opts.call(self);
		});

		// parse all slides
		self._slides = [];
		self._idCount = 0;

		


		self.slider.children().detach().each(function() {
			self._slides.push(self._parseNode(this));
		});
		if(self.st.randomizeSlides) {
	    	self._slides.sort(function() { return 0.5 - Math.random() });
	    }
		self.numSlides = self._slides.length;
		self._refreshNumPreloadImages();


		if(self.st.startSlideId > self.numSlides - 1) {
			self.st.startSlideId = self.numSlides - 1;
		}

		self.staticSlideId = self.currSlideId = self._realId =  self.st.startSlideId;
		self.currSlide = self._slides[self.currSlideId];

		self._accelerationPos = 0;

		self.slider.addClass(self._slidesHorizontal ? 'rsHor' : 'rsVer');

		var sliderHTML = '<div class="rsOverflow"><div class="rsContainer">';
		self.slidesSpacing = self.st.slidesSpacing;
		self._slideSize = ( self._slidesHorizontal ? self.slider.width() : self.slider.height() ) + self.st.slidesSpacing;

		self._preload = Boolean(self._numPreloadImages > 0);
		
		if(self.numSlides <= 1) {
			self._loop = false;
		}
		var loopHelpers = (self._loop && self._isMove) ? ( self.numSlides === 2 ? 1 : 2) : 0;
		self._loopHelpers = loopHelpers;

		self._maxImages = self.numSlides < 6 ? self.numSlides : 6;
		self._currBlockIndex = 0;


		self._idOffset = 0;
		self._slidesJQ = [];
		
		for(i =0; i < self.numSlides; i++) {
			self._slidesJQ.push( $(createItemHTML(i)) );
		}
		
		
		sliderHTML += '</div></div>';

		self.slider.html(sliderHTML);


		self._sliderOverflow = self.slider.find('.rsOverflow');
		self._slidesContainer = self._sliderOverflow.find('.rsContainer');
		self._preloader = $('<div class="rsPreloader"></div>');

		var slides = self._slidesContainer.find('.rsSlide');

		self._currHolder = self._slidesJQ[self.currSlideId]
		self._selectedSlideHolder = 0;
		
		
		

		function createItemHTML(i, className) {
			return '<div data-sid="'+i+'" style="'+ (self._isMove ? '' : (i !== self.currSlideId  ? 'z-index: 0; display:none; opacity: 0; position: absolute;  left: 0; top: 0;' : 'z-index: 0;  position: absolute; left: 0; top: 0;') ) +'" class="rsSlide '+ (className || '')+'"></div>';
		}
		
	
		


		

		if('ontouchstart' in window || 'createTouch' in document) {
			self.hasTouch = true;
			self._downEvent = 'touchstart.rs';
			self._moveEvent = 'touchmove.rs';
			self._upEvent = 'touchend.rs ';
			self._cancelEvent = 'touchcancel.rs';
			self._lastItemFriction = 0.5;
		} else {
			self.hasTouch = false;
			self._lastItemFriction = 0.2;
			
			if(self.st.sliderDrag) {
				if (br.msie || br.opera) {
					self._grabCursor = self._grabbingCursor = "move";
				} else if(br.mozilla) {
					self._grabCursor = "-moz-grab";
					self._grabbingCursor = "-moz-grabbing";
				} else if(isWebkit && (navigator.platform.indexOf("Mac")!=-1)) {
					self._grabCursor = "-webkit-grab";
					self._grabbingCursor = "-webkit-grabbing";
				}
				self._setGrabCursor();
			}

			self._downEvent = 'mousedown.rs';
			self._moveEvent = 'mousemove.rs';
			self._upEvent = 'mouseup.rs';
			self._cancelEvent = 'mouseup.rs';
		}

		
		if(self._useCSS3Transitions) {

			// some constants for CSS3
			self._TP = 'transition-property';
			self._TD = 'transition-duration';
			self._TTF = 'transition-timing-function';

			

			self._yProp = self._xProp = self._vendorPref +'transform';

			if(self._use3dTransform) {
				if(isWebkit) {
					self.slider.addClass('rsWebkit3d');
				}

				self._tPref1 = 'translate3d(';
				self._tPref2 = 'px, ';
				self._tPref3 = 'px, 0px)';
			} else {
				self._tPref1 = 'translate(';
				self._tPref2 = 'px, ';
				self._tPref3 = 'px)';
			}
			if(!self._isMove) {
				var animObj = {};
				animObj[(self._vendorPref + self._TP)] = 'opacity';
				animObj[(self._vendorPref + self._TD)] = self.st.transitionSpeed + 'ms';
				animObj[(self._vendorPref + self._TTF)] = self.st.css3easeInOut;
				slides.css(animObj);
			} else {
				self._slidesContainer[(self._vendorPref + self._TP)] = (self._vendorPref + 'transform');
			}
			

		} else {
			self._xProp = 'left';
			self._yProp = 'top';
		}

		

		// resize
		var resizeTimer;
		$(window).on('resize.rs', function() {	
			if(resizeTimer) {
				clearTimeout(resizeTimer);			
			}
			resizeTimer = setTimeout(function() { self.updateSliderSize(); }, 50);			
		});	
		
	
		self._setupControlNav();
		self.updateSliderSize();


		// keyboard nav
		if(self.st.keyboardNavEnabled) {
			self._bindKeyboardNav();
		}

		if(self.st.arrowsNavHideOnTouch && self.hasTouch)	 {
			self.st.arrowsNav = false;
		}

		//Direction navigation (arrows)
		if(self.st.arrowsNav) {
			var rArr = 'rsArrow';
			$('<div class="'+rArr+' '+rArr+'Left"><div class="'+rArr+'Icn"></div></div><div class="'+rArr+' '+rArr+'Right"><div class="'+rArr+'Icn"></div></div>').appendTo(self.st.controlsInside ? self._sliderOverflow : self.slider);

			self._arrowLeft = self.slider.find('.'+rArr+'Left').click(function() {
				self.prev();
			});
			self._arrowRight = self.slider.find('.'+rArr+'Right').click(function() {
				self.next();
			});

			if(self.st.arrowsNavAutoHide && !self.hasTouch) {
				self._arrowLeft.addClass('rsHidden');
				self._arrowRight.addClass('rsHidden');

				var hoverEl = self.st.arrowsNavInside ? self._sliderOverflow : self.slider;
				hoverEl.one("mousemove.arrowshover",function() {
					self._arrowLeft.removeClass('rsHidden');
					self._arrowRight.removeClass('rsHidden');			
				});


				hoverEl.hover(
					function() {
						if(!self._arrowsAutoHideLocked) {
							self._arrowLeft.removeClass('rsHidden');
							self._arrowRight.removeClass('rsHidden');
						}
					},
					function() {
						if(!self._arrowsAutoHideLocked) {
							self._arrowLeft.addClass('rsHidden');
							self._arrowRight.addClass('rsHidden');
						}
					}
				);	
			}	
			self._updateArrowsNav();
		}

			
		
		self._hasDrag = (!self.hasTouch && self.st.sliderDrag) ||  (self.hasTouch && self.st.sliderTouch);
		if( self._hasDrag ) {
			self._slidesContainer.on(self._downEvent, function(e) { self._onDragStart(e); });	
		} else {
			self._successfullyDragged = false;
		}
		var videoClasses = ['rsPlayBtnIcon', 'rsPlayBtn', 'rsCloseVideoBtn', 'rsCloseVideoIcn'];
			self._slidesContainer.click(function(e) {
				if(!self._successfullyDragged) {
					var t = $(e.target);
					var tClass = t.attr('class');
					if( $.inArray(tClass, videoClasses) !== -1) {
				        if( self.toggleVideo() ) {
							return false;
						}
				    }
					if(self.st.navigateByClick) {
						if($(e.target).closest('.rsNoDrag', self._currHolder).length) {
							 return true;
						}
						self._mouseNext(e);
					} 
				} 
			});
		//}

		self.ev.trigger('rsAfterInit');
	} /* RoyalSlider Constructor End */

	/**
	 *
	 * RoyalSlider Core Prototype
	 * 
	 */
	RoyalSlider.prototype = {
		_mouseNext: function(e) {
			var self = this;
		  	var relativeX = e[self._slidesHorizontal ? 'pageX' : 'pageY'] - self._sliderOffset
		  	if(relativeX > 0) {
		  		self.next();
		  	} else {
		  		self.prev();
		  	}
		},
		_refreshNumPreloadImages: function() {
			var self = this,
				n;
			n = self.st.numImagesToPreload;
			self._loop = self.st.loop;
			if(self.numSlides === 2) {
				self._loop = false;
				self.st.loopRewind = true;
			}
			if(self._loop && n > 0) {
				if(self.numSlides <= 4) {
					n = 1;
				}
			}
			
			
			self._numPreloadImages = n;
		},
		_parseNode: function(content) {
			var self = this,
				hasImg,
				isRoot,
				hasCover,
				obj = {};
			content = $(content);
			self._currContent = content;
			self.ev.trigger('rsBeforeParseNode', [content, obj]);
			content = self._currContent;
			obj.id = self._idCount;
			obj.holderId = self._idCount;
			obj.contentAdded = false;
			self._idCount++;

			
			if(!obj.hasCover) {
				if(content.hasClass('rsImg')) {
					tempEl = content;
					hasImg = true;
				} else {
					tempEl = content.find('.rsImg');
					if(tempEl.length) {
						hasImg = true;
					}
				}

				if(hasImg) {
					obj.bigImage = tempEl.attr('data-rsBigImg');
					if(tempEl.is('a')) {
						parseEl(tempEl, 'href');
					} else if(tempEl.is('img')) {
						parseEl(tempEl);
					}
				} else if(content.is('img')) {
					content.addClass('rsImg');
					parseEl(content);
				}
			}
			tempEl = content.find('.rsCaption');
			if(tempEl.length) {
				obj.caption = tempEl.remove();
			}
			if(!obj.image) {
				obj.isLoaded = true;
				obj.isRendered = false;
				obj.isLoading = false;
			}
			obj.content = content;
			self.ev.trigger('rsAfterParseNode', [content, obj]);
			function parseEl(el, s) {
				obj.image = el.attr(!s ? 'src' : s);
				obj.caption = !s ? el.attr('alt') : el.contents();
				obj.videoURL = el.attr('data-rsVideo');
			}
			return obj;
		},
		_bindKeyboardNav: function() {
			var self = this;
			self._doc.on('keydown.rskb', function(e) {
				if(!self._isDragging && !self._isAnimating) {
					if (e.keyCode === 37) {
						e.preventDefault();
						self.prev();
					} else if (e.keyCode === 39) {
						e.preventDefault();
						self.next();
					}
				}
			});
		},
		_setupControlNav: function() {
			var self = this,
				type = self.st.controlNavigation.toLowerCase(),
				out,
				item;

			self._prevNavItemId = -1;

			
			if(type === 'bullets') {
				self._controlNavEnabled = true;
				self.slider.addClass('rsWithBullets');
				out += '<div class="rsNav rsBullets">';
				for(var i = 0; i < self.numSlides; i++) {
					if(i === self.numSlides - 1) {
						style = '';
					}
					out += '<div class="rsNavItem rsBullet"><span class=""></span></div>';
				}
				out += '</div>';
				out = $(out);
				self._controlNav = out;
				self._controlNavItems = out.children();
				self.slider.append(out);
			} else if(type === 'thumbnails') {
				if(typeof(self._createThumbs) != "undefined") self._createThumbs();
			} else if(type === 'tabs') {
				if(typeof(self._createTabs) != "undefined") self._createTabs();
			} else {
				self._controlNavEnabled = false;
			}
			
			
			if(self._controlNavEnabled) {
				self._controlNav.click(function(e) {
					if(!self._thumbsEnabled || !self._thumbsDrag ) {
						var item = $(e.target).closest('.rsNavItem');
						if(item.length) {
							self.goTo(item.index());
						}
					}
				});
			}	

			
				

		},
		_updateControlNav: function(justSet) {

			var self = this;
				
			if(self._controlNavEnabled) {
				var id = self.currSlideId,
					currItem,
					prevItem;
				if(self._prevNavItemId >= 0) {
					prevItem = $(self._controlNavItems[self._prevNavItemId]);
					prevItem.removeClass('rsNavSelected');
				}
				currItem = $(self._controlNavItems[id]);
				//if(prevItem) {
					
				//}
				currItem.addClass('rsNavSelected');

				
				if(self._thumbsNavigation) {					
					self._setCurrentThumb(id, justSet);
				}
				self._prevNavItemId = id;
			}
		},
		goTo: function(id, notUserAction) {
			var self = this;
			if(id !== self.currSlideId) {
				self._moveTo(id,self.st.transitionSpeed, true, !notUserAction);
			}
			
		},
		_updateBlocksContent: function(beforeTransition, getId) {
			
			var self = this,
				item,
				i,
				n,
				pref,
				group,
				groupId,
				slideCode;
			var loop = self._loop;
			var numSlides = self.numSlides;
			if(!isNaN(getId) ) {
				return getCorrectLoopedId(getId);
			}

			var id = self.currSlideId;
			var groupOffset;
			
			var itemsOnSide = beforeTransition ? (Math.abs(self._prevSlideId - self.currSlideId) >= self.numSlides - 1 ? 0 : 1) : self._numPreloadImages;
			var itemsToCheck = Math.min(2, itemsOnSide); 
			
			var updateAfter = false;
			var updateBefore = false;
			
			var tempId;
			var item;
			
			for(i = id; i < id + 1 + itemsToCheck; i++) {
				tempId = getCorrectLoopedId(i);
				item = self._slides[tempId];
				if(item && (!item.isAdded || !item.positionSet) ) {
					updateAfter = true;
					break;
				}
			}
			for(i = id - 1; i > id - 1 - itemsToCheck; i--) {
				tempId = getCorrectLoopedId(i);
				item = self._slides[tempId];
				if(item && (!item.isAdded || !item.positionSet) ) {
					updateBefore = true;
					break;
				}
			}
			if(updateAfter) {
				for(i = id; i < id + itemsOnSide + 1; i++) {
					tempId = getCorrectLoopedId(i);
					groupOffset = Math.floor( (self._realId - (id - i)) / self.numSlides) * self.numSlides;
					item = self._slides[tempId];
					if(item) {
						updateItem(item, tempId);	
					}
				}
			}
			if(updateBefore) {
				for(i = id - 1; i > id - 1 - itemsOnSide; i--) {
					tempId = getCorrectLoopedId(i);
					groupOffset = Math.floor( (self._realId - (id - i) ) / numSlides) * numSlides;
					
					item = self._slides[tempId];
					if(item) {
						updateItem(item, tempId);
					}
				}
			}
			if(!beforeTransition) {
				var start = id;
				var distance = itemsOnSide;
				var min = getCorrectLoopedId(id - itemsOnSide);
				var max = getCorrectLoopedId(id + itemsOnSide);
				
				var nmin = min > max ? 0 : min;
				
				for (i = 0; i < numSlides; i++) { 
					if(min > max) {
						if(i > min - 1) {
							continue;
						}
					}
					if(i < nmin || i > max) {
						 item = self._slides[i];
						if(item && item.holder) {
							
							//slideCode = self._slidesJQ[i];
							//if(typeof slideCode !== "string") { 
								item.holder.remove();
								item.isAdded = false;
							//}
						}     
					}                               
			    }   
			}

			
			
				
				
			function updateItem(item , i, slideCode) {
				if(!item.isAdded) {
					if(!slideCode)
						slideCode = self._slidesJQ[i];

					if(!item.holder) {
						slideCode = self._slidesJQ[i] = $(slideCode);
						item.holder = slideCode;
					} else {
						slideCode = item.holder;
					}

					item.appendOnLoaded = false;

					
					updatePos(i, item, slideCode);
					addContent(i, item);
					self._addBlockToContainer(item, slideCode, beforeTransition);
					item.isAdded = true;
					appended = true;
				} else {
					addContent(i, item);
					updatePos(i, item);
				}
			}
			function addContent(i, item) {
				if(!item.contentAdded) {
					self._setItemHtml(item, beforeTransition);
					if(!beforeTransition) {
						item.contentAdded = true;
					}
					
				}
			}
			function updatePos(i, item, slideCode) {
				if(self._isMove) {
					if(!slideCode) {
						slideCode = $(self._slidesJQ[i]);
					}
					slideCode.css(self._reorderProp, (i + self._idOffset + groupOffset) * self._slideSize);
				}
			}
			function getCorrectLoopedId(index) {
				var changed = false;
				if(loop) {
					if(index > numSlides - 1) {
						return getCorrectLoopedId(index - numSlides);
					} else  if(index < 0) {
						return getCorrectLoopedId(numSlides + index);
					}
				}
				return index;
			}
			
		},
		_setItemHtml: function(currSlideObject, beforeTransition) {
			var self = this;
			var content = currSlideObject.content;
			var holder = currSlideObject.holder;

			var onImageLoaded = function (slideObject) {
				var sizeType = slideObject.sizeType;
			    return function (e) {
			    	var content = slideObject.content,
			    		holder = slideObject.holder;

			    	if(e) {
			    		var newImg = e.currentTarget;
			    		$(newImg).off('load error');
			    		if(e.type === 'error') {
			    			slideObject.isLoaded = true;
							slideObject.image = '';
							slideObject.isLoading = false;
							content.addClass('rsSlideError');
							holder.html(content);
							self.ev.trigger('rsAfterContentSet', slideObject);
			    			return;
			    		}
			    	}


					if(slideObject.image) {
						if(slideObject.bigImage && slideObject.sizeType !== sizeType) {
							if(sizeType === 'med') {
								slideObject.isMedLoading = false;
							} else if(sizeType === 'big') {
								slideObject.isBigLoading = false;
							} else {
								slideObject.isMedLoading = slideObject.isLoading = false;
							}
				    		return;
				    	}
						if(!slideObject.isLoaded) {
							var tempEl,
								isRoot;
							if(content.hasClass('rsImg')) {
								isRoot = true;
								tempEl = content;
							} else {
								isRoot = false;
								tempEl = content.find('.rsImg');
							}
							if(tempEl.length && tempEl.is('a')) {
								
								if(isRoot) {
									content = $('<img class="rsImg" src="'+slideObject.image+'" />');
								} else {
									content.find('.rsImg').replaceWith('<img class="rsImg" src="'+slideObject.image+'" />');
								}
								slideObject.content = content;
							}
							
							slideObject.iW = newImg.width;
							if(slideObject.iW > 0) {
								slideObject.iH = newImg.height;
								slideObject.isLoaded = true;
								slideObject.isLoading = false;
								self._resizeImage( slideObject );
							}
						} else {
							
							if(!slideObject.isRendered && beforeTransition) {
								waitForTransition();
								return;
							}
							self._resizeImage( slideObject );
						}
					} else {
						if(!self._preload && beforeTransition && !slideObject.isRendered) {
							slideObject.isRendered = true;
							waitForTransition();
							return;
						}
						slideObject.isLoaded = true;
						slideObject.isLoading = false;
					}


					var visibleNearby = true;
					var bId = slideObject.id - self._newSlideId;
					if(!beforeTransition && !slideObject.appendOnLoaded && self.st.fadeinLoadedSlide  && ( bId === 0 || ( (visibleNearby || self._isAnimating || self._isDragging) && (bId === -1 || bId === 1) ) ) ) {
						content.css(self._vendorPref + 'transition', 'opacity 300ms ease-in-out').css({visibility: 'visible', opacity: 0});
						holder.html(content);
						setTimeout(function() {
							content.css('opacity', 1);
						}, 6);
					} else {
						holder.html(content);
						
					}
					
					slideObject.isRendered = true;

					holder.find('a').off('click.rs').on('click.rs', function(e) {		
						if(self._successfullyDragged) {						
							return false;
						} else {
							e.stopImmediatePropagation();
						}
					});
					self.ev.trigger('rsAfterContentSet', slideObject);

					if(slideObject.appendOnLoaded) {
						self._addBlockToContainer(slideObject, content, beforeTransition);
					}
			    };
			};

		
			if(currSlideObject.isLoaded) {
				onImageLoaded(currSlideObject)();
			} else {
				if(beforeTransition) {
					waitForTransition();
				} else {
					parseDataAndLoad();
				}
			}

			function parseDataAndLoad() {
				if(!currSlideObject.image) {
					onImageLoaded(currSlideObject)();
					return;
				}
								

				if(!currSlideObject.isLoading) {
					loadImg($('<img/>'), currSlideObject.image);
				} else {
					var guard = 1;
					function loopUntilLoaded(sizeType) {
						var s = sizeType === 'big' ? currSlideObject.isBigLoaded : currSlideObject.isMedLoaded;
						if(!currSlideObject.isLoading) {
							return;
						}
						if(currSlideObject.isLoaded) {
							onImageLoaded(currSlideObject)();
							return;
						}
						if(guard % 50 === 0) {
							var l = currSlideObject.imageLoader;
							if(l.complete && l.naturalWidth !== undefined && l.naturalWidth !== 0 &&  l.naturalHeight !== 0) {
								onImageLoaded(currSlideObject)();
								return;
							}
						}
						if(guard > 300) {
							return;
						}
						setTimeout(loopUntilLoaded, 400);
						guard++;
					}
					loopUntilLoaded(currSlideObject.sizeType);
				}
				
			}
			
			function loadImg(lImg, src) {

				if(!beforeTransition) {
					if(!currSlideObject.isLoading) {
						if(!src) {
							src = lImg.attr('src');
							lImg = $("<img/>");
						}

						setPreloader(holder);
						
						currSlideObject.isLoading = true;
						currSlideObject.imageLoader = lImg;
						lImg
							.one('load error',onImageLoaded(currSlideObject)).attr('src', src);
						
					}
				} else {
					waitForTransition();
				}
				
			}

			function isImageLoaded(limg) {
				if(limg) {
					if (!limg.complete || limg.naturalWidth === undefined || limg.naturalWidth === 0) {
				        return false;
				    }
				} else {
					return false;
				}
			    return true;	
			}
			function waitForTransition() {
				holder.isWaiting = true;
				setPreloader(holder);
				holder.slideId = -99;
			}
			function setPreloader(holder) {
				currSlideObject.holder.html(self._preloader.clone());
			}
		},
		_addBlockToContainer: function(slideObject, content, dontFade) {
			var self = this;
			var holder = slideObject.holder;
			var bId = slideObject.id - self._newSlideId;
			
			var visibleNearby = true;
			if(self._isMove && !dontFade && self.st.fadeinLoadedSlide  && ( bId === 0 || ( (visibleNearby || self._isAnimating || self._isDragging) && (bId === -1 || bId === 1) ) ) ) {
				var content = slideObject.content;
				content.css(self._vendorPref + 'transition', 'opacity 300ms ease-in-out').css({visibility: 'visible', opacity: 0});
				//holder.css('opacity', 0);
				self._slidesContainer.append(holder);
				setTimeout(function() {
					content.css('opacity', 1);
					//self.ev.trigger('rsAfterContentSet', holder);
				}, 6);
			} else {
				self._slidesContainer.append(holder);
			}
			slideObject.appendOnLoaded = false;
		},
	
		_onDragStart:function(e, isThumbs) {
			var self = this,
				point,
				wasAnimating;
			self._successfullyDragged = false;

			if($(e.target).closest('.rsNoDrag', self._currHolder).length) {
				 return true;
			}

			
			if(!isThumbs) {
				if(self._isAnimating) {
					wasAnimating = true;
					self._stopAnimation();
				}
			}
			
			if(self._isDragging) {
				if(self.hasTouch) {
					self._multipleTouches = true;
				}
				return;
			} else {
				if(self.hasTouch) {
					self._multipleTouches = false;
				}
			}

			self._setGrabbingCursor();
			
			if(self.hasTouch) {
				//parsing touch event
				var touches = e.originalEvent.touches;
				if(touches && touches.length > 0) {
					point = touches[0];
					if(touches.length > 1) {
						self._multipleTouches = true;
					}
				}					
				else {	
					return;						
				}
			} else {
				point = e;						
				e.preventDefault();					
			}

			self._isDragging = true;
			self._doc.on(self._moveEvent, function(e) { self._onDragMove(e, isThumbs); })
						.on(self._upEvent, function(e) { self._onDragRelease(e, isThumbs); });
			
			self._currMoveAxis = '';
			self._hasMoved = false;
			self._pageX = point.pageX;
			self._pageY = point.pageY;
			self._startPagePos = self._accelerationPos = (!isThumbs ? self._slidesHorizontal : self._thumbsHorizontal) ? point.pageX : point.pageY;

			
			
			self._horDir = 0;
			self._verDir = 0;

			self._currRenderPosition = !isThumbs ? self._sPosition : self._thumbsPosition;

			self._startTime = new Date().getTime();
			if(self.hasTouch) {
				self._sliderOverflow.on(self._cancelEvent, function(e) { self._onDragRelease(e, isThumbs); });	
			}
		},
		_renderMovement:function(point, isThumbs) {
			var self = this;
			if(self._checkedAxis) {
				var timeStamp = self._renderMoveTime,
					deltaX = point.pageX - self._pageX,
					deltaY = point.pageY - self._pageY,
					newX = self._currRenderPosition + deltaX,
					newY = self._currRenderPosition + deltaY,
					isHorizontal = (!isThumbs ? self._slidesHorizontal : self._thumbsHorizontal),
					newPos = isHorizontal ? newX : newY,
					mAxis = self._currMoveAxis;

				self._hasMoved = true;
				self._pageX = point.pageX;
				self._pageY = point.pageY;

				var pointPos = isHorizontal ? self._pageX : self._pageY;

				if(mAxis === 'x' && deltaX !== 0) {
					self._horDir = deltaX > 0 ? 1 : -1;
				} else if(mAxis === 'y' && deltaY !== 0) {
					self._verDir = deltaY > 0 ? 1 : -1;
				}
				
				var deltaPos = isHorizontal ? deltaX : deltaY;
				if(!isThumbs) {
					if(!self._loop) {
						if(self.currSlideId <= 0) {
							if(pointPos - self._startPagePos > 0) {
								newPos = self._currRenderPosition + deltaPos * self._lastItemFriction;
							}
						}
						if(self.currSlideId >= self.numSlides - 1) {
							if(pointPos - self._startPagePos < 0) {
								newPos = self._currRenderPosition + deltaPos * self._lastItemFriction ;
							}
						}
					}
				} else {
					if(newPos > self._thumbsMinPosition) {
						newPos = self._currRenderPosition + deltaPos * self._lastItemFriction;
					} else if(newPos < self._thumbsMaxPosition) {
						newPos = self._currRenderPosition + deltaPos * self._lastItemFriction ;
					}
				}

				self._currRenderPosition = newPos;
				
				if (timeStamp - self._startTime > 200) {
			 		self._startTime = timeStamp;
					self._accelerationPos = pointPos;						
				}

				if(!isThumbs) {
					if(self._isMove) {
						self._setPosition(self._currRenderPosition);
					}
				} else {
					self._setThumbsPosition(self._currRenderPosition);
				}
			}
			
			
		},
		_onDragMove:function(e, isThumbs) {
			var self = this;
			if(self.hasTouch) {
				if(self._lockAxis) {
					return;
				}	
				var touches = e.originalEvent.touches;
				if(touches) {
					if(touches.length > 1) {
						return;
					} else {
						point = touches[0];	
					}
				} else {
					return;
				}
			} else {
				point = e;
			}
			
			if(!self._hasMoved) {
				if(self._useCSS3Transitions) {
					(!isThumbs ? self._slidesContainer : self._thumbsContainer).css((self._vendorPref + self._TD), '0s');
				}
				(function animloop(){
					if(self._isDragging) {
						self._animFrame = requestAnimationFrame(animloop);
						if(self._renderMoveEvent)
							self._renderMovement(self._renderMoveEvent, isThumbs);
					}
					
			    })();
			}
				
			if(!self._checkedAxis) {
				
				var dir = (!isThumbs ? self._slidesHorizontal : self._thumbsHorizontal),
					diff = (Math.abs(point.pageX - self._pageX) - Math.abs(point.pageY - self._pageY) ) - (dir ? -7 : 7);

				if(diff > 7) {
					// hor movement
					if(dir) {
						e.preventDefault();
						self._currMoveAxis = 'x';
					} else if(self.hasTouch) {
						self._completeGesure();
						return;
					} 
					self._checkedAxis = true;
				} else if(diff < -7) {
					// ver movement
					if(!dir) {
						e.preventDefault();
						self._currMoveAxis = 'y';
					} else if(self.hasTouch) {
						self._completeGesure();
						return;
					} 
					self._checkedAxis = true;
				}
				return;
			}
			
			e.preventDefault();	
			self._renderMoveTime = new Date().getTime();
			self._renderMoveEvent = point;
		},
		_completeGesure: function() {
			var self = this;
			self._lockAxis = true;
			self._hasMoved = self._isDragging = false;
			self._onDragRelease();
		},
		_onDragRelease:function(e, isThumbs) {
			var self = this,
				totalMoveDist,
				accDist,
				duration,
				v0,
				newPos,
				newDist,
				newDuration,
				blockLink;

			
			self.ev.trigger('rsDragRelease');


			self._renderMoveEvent = null;
			self._isDragging = false;
			self._lockAxis = false;
			self._checkedAxis = false;
			self._renderMoveTime = 0;
			cancelAnimationFrame(self._animFrame);
			if(self._hasMoved) {
				if(!isThumbs) {
					if(self._isMove) {
						self._setPosition(self._currRenderPosition);
					}
				} else {
					self._setThumbsPosition(self._currRenderPosition);
				}
			}

			self._doc.off(self._moveEvent).off(self._upEvent);

			if(self.hasTouch) {
				self._sliderOverflow.off(self._cancelEvent);	
			}

			
			self._setGrabCursor();
			if (!self._hasMoved && !self._multipleTouches) {
				if(isThumbs && self._thumbsEnabled) {
					var item = $(e.target).closest('.rsNavItem');
					if(item.length) {
						self.goTo(item.index());
					}	
					return;
				}
			}
			var orient = (!isThumbs ? self._slidesHorizontal : self._thumbsHorizontal);
			if(!self._hasMoved || (self._currMoveAxis === 'y' && orient) || (self._currMoveAxis === 'x' && !orient) ) {
				return;
			}
			self._successfullyDragged = true;
			
			self._currMoveAxis = '';

			
			function getCorrectSpeed(newSpeed) {
				if(newSpeed < 100) {
					return 100;
				} else if(newSpeed > 500) {
					return 500;
				} 
				return newSpeed;
			}
			function returnToCurrent(isSlow, v0) {
				if(self._isMove || isThumbs) {
					newPos = (-self._realId - self._idOffset) * self._slideSize;
					newDist = Math.abs(self._sPosition  - newPos);
					self._currAnimSpeed = newDist / v0;
					if(isSlow) {
						self._currAnimSpeed += 250; 
					}
					self._currAnimSpeed = getCorrectSpeed(self._currAnimSpeed);
					self._animateTo(newPos, false);
				}
			}

			var snapDist = 0,
				point = self.hasTouch ? e.originalEvent.changedTouches[0] : e,
				pPos = orient ? point.pageX : point.pageY,
				sPos = self._startPagePos,
				axPos = self._accelerationPos,
				axCurrItem = self.currSlideId,
				axNumItems = self.numSlides,
				dir = orient ? self._horDir : self._verDir,
				loop = self._loop,
				changeHash = false,
				distOffset = 0;
			
			totalMoveDist = Math.abs(pPos - sPos);
			accDist = pPos - axPos;


			duration = (new Date().getTime()) - self._startTime;
			v0 = Math.abs(accDist) / duration;	

			if(dir === 0 || axNumItems <= 1) {
				returnToCurrent(true, v0);
				return;
			}

			if(!loop && !isThumbs) {
				if(axCurrItem <= 0) {
					if(dir > 0) {
						returnToCurrent(true, v0);
						return;
					}
				} else if(axCurrItem >= axNumItems - 1) {
					if(dir < 0) {
						returnToCurrent(true, v0);
						return;
					}
				}
			}

			if(!isThumbs) {
				if(sPos + snapDist < pPos) {
					if(dir < 0) {		
						returnToCurrent(false, v0);
						return;					
					}
					self._moveTo('prev', getCorrectSpeed(Math.abs(self._sPosition  - (-self._realId - self._idOffset + 1) * self._slideSize) / v0), changeHash, false, true);
				} else if(sPos - snapDist > pPos) {
					if(dir > 0) {		
						returnToCurrent(false, v0);
						return;					
					}
					self._moveTo('next', getCorrectSpeed(Math.abs(self._sPosition  - (-self._realId - self._idOffset - 1) * self._slideSize) / v0), changeHash, false, true);
				} else {
					returnToCurrent(false, v0);
				}
			} else {
				var newPos = self._thumbsPosition;
				var transitionSpeed;
				
				if(newPos > self._thumbsMinPosition) {
					newPos = self._thumbsMinPosition;
				} else if(newPos < self._thumbsMaxPosition) {
					newPos = self._thumbsMaxPosition;
				} else {
					var friction = 0.003,
						S = (v0 * v0) / (friction * 2),
						minXDist = -self._thumbsPosition,
						maxXDist = self._thumbsContainerSize - self._thumbsViewportSize + self._thumbsPosition;

					if (accDist > 0 && S > minXDist) {
						minXDist = minXDist + self._thumbsViewportSize / (15 / (S / v0 * friction));
						v0 = v0 * minXDist / S;
						S = minXDist;
					} else if (accDist < 0 && S > maxXDist) {
						maxXDist = maxXDist + self._thumbsViewportSize / (15 / (S / v0 * friction));
						v0 = v0 * maxXDist / S;
						S = maxXDist;
					}




					transitionSpeed =  Math.max(Math.round(v0 / friction), 50);
					newPos = newPos + S * (accDist < 0 ? -1 : 1);


					if(newPos > self._thumbsMinPosition) {
						self._animateThumbsTo(newPos, transitionSpeed, true, self._thumbsMinPosition, 200);
						return;
					 } else if(newPos < self._thumbsMaxPosition) {
						self._animateThumbsTo( newPos, transitionSpeed, true, self._thumbsMaxPosition, 200);
						return;
					}
				}

				self._animateThumbsTo(newPos, transitionSpeed, true);

			}
		},
		_setPosition: function(pos) {
			var self = this;
			pos = self._sPosition = pos;

			if(self._useCSS3Transitions) {
				self._slidesContainer.css(self._xProp, self._tPref1 + ( self._slidesHorizontal ? (pos + self._tPref2 + 0) : (0 + self._tPref2 + pos) ) + self._tPref3 );		
			} else {
				self._slidesContainer.css(self._slidesHorizontal ? self._xProp : self._yProp, pos);
			}
		},
		
		
		updateSliderSize: function(force) {
			var self = this,
				newWidth,
				newHeight;

			if (self.st.beforeResize) self.st.beforeResize.call(self);

			if(self.st.autoScaleSlider) {
				var asw = self.st.autoScaleSliderWidth,
					ash = self.st.autoScaleSliderHeight;

				if(self.st.autoScaleHeight) {
					newWidth = self.slider.width();
					if(newWidth != self.width) {
						self.slider.css("height", newWidth * (ash / asw) );
						newWidth = self.slider.width();
					}	
					newHeight = self.slider.height();
				} else {
					newHeight = self.slider.height();
					if(newHeight != self.height) {
						self.slider.css("width", newHeight * (asw / ash));
						newHeight = self.slider.height();
					}		
					newWidth = self.slider.width();
				}
			
			} else {
				newWidth = self.slider.width();
				newHeight = self.slider.height();
			}
			self._sliderOffset = self.slider.offset();
			self._sliderOffset = self._sliderOffset[self._reorderProp];


			if(force || newWidth != self.width || newHeight != self.height) {
				self.width = newWidth;
				self.height = newHeight;

				self._wrapWidth = newWidth;
				self._wrapHeight = newHeight;


				self.ev.trigger('rsBeforeSizeSet');

				
				self._sliderOverflow.css({
					width: self._wrapWidth,
					height: self._wrapHeight
				});


				self._slideSize = (self._slidesHorizontal ? self._wrapWidth : self._wrapHeight) + self.st.slidesSpacing;
				

				self._imagePadding = self.st.imageScalePadding;
				var item,
					slideItem,
					i;


				
				var img;
				for(var i = 0; i < self._slides.length; i++) {
					item = self._slides[i];
					item.positionSet = false;

					if(item && item.image && item.isLoaded) {
						item.isRendered = false;
						self._resizeImage(item);
					} 
				}
				if(self._cloneHolders) {
					for( var  i = 0; i < self._cloneHolders.length; i++) {
						item = self._cloneHolders[i];
						item.holder.css(self._reorderProp, (item.id + self._idOffset) * self._slideSize);

					}
				}
				
				self._updateBlocksContent();

				if(self._isMove) {
					if(self._useCSS3Transitions) {
						self._slidesContainer.css(self._vendorPref + 'transition-duration', '0s');
					}
					self._setPosition( (-self._realId - self._idOffset) * self._slideSize);
				}

				self._updateControlNav(true);
				if (self.st.afterResize) self.st.afterResize.call(self);
			}



		},
		setSlidesOrientation: function(orient) {
			// TODO
			// var self = this,
			// 	newHor = Boolean(orient === 'horizontal');
			// if(self._slidesHorizontal !== newHor) {
			// 	self._setPosition(0);
			// 	if(self._isMove) {
			// 		for(var i = 0; i < self._slideHolders.length; i++) {
			// 			self._slideHolders[i].block.css(self._reorderProp, '');
			// 		}
			// 	}
			// 	self.slider.removeClass(self._slidesHorizontal ? 'rsHor' : 'rsVer').addClass(newHor ? 'rsHor' : 'rsVer');
			// 	self._slidesHorizontal = newHor;
			// 	self._reorderProp = newHor ? 'left' : 'top';
			// 	self.updateSliderSize(true);
			// }
		},
		addSlide: function(data) {
			var self = this;
			// TODO
		},
		_setGrabCursor:function() {	
			var self = this;
			if(!self.hasTouch && self._isMove) {
				if(self._grabCursor) {
					self._sliderOverflow.css('cursor', self._grabCursor);
				} else {
					self._sliderOverflow.removeClass('grabbing-cursor');
					self._sliderOverflow.addClass('grab-cursor');	
				}
			}
		},
		_setGrabbingCursor:function() {		
			var self = this;
			if(!self.hasTouch && self._isMove) {
				if(self._grabbingCursor) {
					self._sliderOverflow.css('cursor', self._grabbingCursor);
				} else {
					self._sliderOverflow.removeClass('grab-cursor');
					self._sliderOverflow.addClass('grabbing-cursor');	
				}	
			}
		},
		next: function(notUserAction) {
			var self = this;
			self._moveTo('next',  self.st.transitionSpeed, true, !notUserAction);
		},
		prev: function(notUserAction) {
			var self = this;
			self._moveTo('prev', self.st.transitionSpeed, true, !notUserAction);
		},
		_moveTo:function(type,  speed, inOutEasing, userAction, fromSwipe) {
			var self = this,
				newPos,
				difference,
				i;

			if(self._isWorking) {
				return;
			}

			if(self._isVideoPlaying) {
				self.stopVideo();
			}
			self.ev.trigger('rsBeforeMove', [type, userAction]);
			if(type === 'next') {
				newItemId = self.currSlideId+1;
			} else if(type === 'prev') {
				newItemId = self.currSlideId-1;
			} else {
				newItemId = type = parseInt(type, 10);
			}

			if(!self._loop) {
				if(newItemId < 0) {
					self._doBackAndForthAnim('left');
					return;
				} else if(newItemId >= self.numSlides ) {
					self._doBackAndForthAnim('right');
					return;
				}
			}
			
			if(self._isAnimating) {
				self._stopAnimation();
				inOutEasing = false;
			}

			difference = newItemId - self.currSlideId;



			self._prevSlideId = self.currSlideId;
			var prevId = self.currSlideId;
			var id = self.currSlideId + difference;
			var realId = self._realId;
			var temp;
			var delayed;
			if(self._loop) {
				id = self._updateBlocksContent(false, id);
				realId += difference;
			} else {
				realId = id;
			}
			self._newSlideId = id;

			self._oldHolder = self._slidesJQ[self.currSlideId];

			
			self._realId = realId;
			self.currSlideId = self._newSlideId;

			self.currSlide = self._slides[self.currSlideId];
			self._currHolder = self._slidesJQ[self.currSlideId];

			
			var checkDist = 2;
			var next = Boolean(difference > 0);
			var absDiff = Math.abs(difference);
			var g1 = Math.floor( prevId / self._numPreloadImages);
			var g2 = Math.floor( ( prevId + (next ? checkDist : -checkDist  ) ) / self._numPreloadImages);
			var biggest = next ? Math.max(g1,g2) : Math.min(g1,g2);
			var biggestId = biggest * self._numPreloadImages +  ( next ? (self._numPreloadImages - 1) : 0 );
			if(biggestId > self.numSlides - 1) {
				biggestId = self.numSlides - 1;
			} else if(biggestId < 0) {
				biggestId = 0;
			}
			var toLast =  next ? (biggestId - prevId) :  (prevId - biggestId);
			if(toLast > self._numPreloadImages) {
				toLast = self._numPreloadImages;
			}
			if(absDiff > toLast + checkDist) {
				self._idOffset +=  ( absDiff - (toLast + checkDist) ) * ( next ? -1 : 1 );
				speed = speed * 1.4;
				for(var i = 0; i < self.numSlides; i++) {
					self._slides[i].positionSet = false;
				}
			}
			self._currAnimSpeed = speed;

			self._updateBlocksContent(true);
			if(!fromSwipe) {
				
				delayed = true;
			}

			if(self._isMove && self._loop && ( self._realId < 0 || self._realId >= self.numSlides ) ) {
				self._isWorking = true;
			}


			newPos = (-realId - self._idOffset) * self._slideSize;

			

			if(delayed) {
				self._isWorking = true;
				setTimeout(function() {
					self._isWorking = false;
					self._animateTo(newPos, type, false, inOutEasing);
					self._updateControlNav();
					self._updateArrowsNav();
				}, 0);
			} else {
				self._animateTo(newPos, type, false, inOutEasing);
				self._updateControlNav();
				self._updateArrowsNav();
			}
			
			
			function isSetToCurrent(testId) {
				if(testId < 0) {
					testId = self.numSlides + testId;
				} else if(testId > self.numSlides - 1) {
					testId = testId - self.numSlides;
				}
				if(testId !== self.currSlideId) {
					return false;
				}
				return true;
			}
			
		},
		_updateArrowsNav: function() {
			var self = this,
				arrDisClass = 'rsArrowDisabled';
			if(self.st.arrowsNav && !self._loop && !self.st.loopRewind) {
				if(self.currSlideId === 0) {
					self._arrowLeft.addClass(arrDisClass);
				} else {
					self._arrowLeft.removeClass(arrDisClass);
				}
				if(self.currSlideId === self.numSlides - 1) {
					self._arrowRight.addClass(arrDisClass);
				} else {
					self._arrowRight.removeClass(arrDisClass);
				}
			}
		},
		_animateTo:function(pos, dir,  loadAll, inOutEasing, customComplete) {
			var self = this,
				moveProp,
				oldBlock,
				animBlock;

			var animObj = {};
			if(isNaN(self._currAnimSpeed)) {
				self._currAnimSpeed = 400;
			} 
			

			self._sPosition = self._currRenderPosition = pos;

			self.ev.trigger('rsBeforeAnimStart');
			if (self.st.beforeSlideChange) self.st.beforeSlideChange.call(self);

			if(!self._useCSS3Transitions) {
				if(self._isMove) {
					animObj[self._slidesHorizontal ? self._xProp : self._yProp] = pos + 'px';


					self._slidesContainer.animate(animObj, self._currAnimSpeed, /*'easeOutQuart'*/ inOutEasing ? self.st.easeInOut : self.st.easeOut);
				} else {
					oldBlock = self._oldHolder;
					animBlock = self._currHolder;					

					animBlock.stop(true, true).css({
						opacity: 0,
						display: 'block',
						zIndex: self._fadeZIndex
					});
					self._currAnimSpeed = self.st.transitionSpeed;
					animBlock.animate({opacity: 1}, self._currAnimSpeed, self.st.easeInOut);

					
					clearTimeouts();
					if(oldBlock) {
	 					oldBlock.data('rsTimeout', setTimeout(function() {
							oldBlock.stop(true, true).css({
								opacity: 0,
								display: 'none',
								zIndex: 0
							});
						}, self._currAnimSpeed + 60) );
					}
				}
				
			} else {
				if(self._isMove) {
					
						animObj[(self._vendorPref + self._TD)] = self._currAnimSpeed+'ms';
						animObj[(self._vendorPref + self._TTF)] = inOutEasing ? $.rsCSS3Easing[self.st.easeInOut] : $.rsCSS3Easing[self.st.easeOut];
						
						self._slidesContainer.css(animObj);
					
					setTimeout(function() {
						self._setPosition(pos);
					}, self.hasTouch ? 5 : 0);
					

				} else {
					self._currAnimSpeed = self.st.transitionSpeed;
					oldBlock = self._oldHolder;
					animBlock = self._currHolder;		
				
					clearTimeouts();
					if(oldBlock) {
						oldBlock.data('rsTimeout', setTimeout(function() {
							//animObj[self._vendorPref + self._TD] = '0ms';
							animObj.zIndex = 0;
							animObj.display = 'none';
							oldBlock.css(animObj);
							setTimeout(function() {
								oldBlock.css('opacity', 0);
							}, 16);
						}, self._currAnimSpeed + 60) );
					}

					animObj.display = 'block';
					animObj.zIndex = self._fadeZIndex;
					animObj[self._vendorPref + self._TD] = '0ms';
					animBlock.css(animObj);
					animBlock.data('rsTimeout', setTimeout(function() {
						animBlock.css('opacity', 0);
						animBlock.css(self._vendorPref + self._TD,  self._currAnimSpeed+'ms');

						animBlock.data('rsTimeout', setTimeout(function() {
							animBlock.css('opacity', 1);
							animBlock.data('rsTimeout', '');
						}, 20) );
					}, 20) );
				}
			}
			self._isAnimating = true;
			if(self.loadingTimeout) {
				clearTimeout(self.loadingTimeout);
			}
			if(customComplete) {
				self.loadingTimeout = setTimeout(function() {
					self.loadingTimeout = null;
					customComplete.call();

				}, self._currAnimSpeed + 60);
			} else {
				self.loadingTimeout = setTimeout(function() {
					self.loadingTimeout = null;
					self._animationComplete(dir);
				}, self._currAnimSpeed + 60);
			}

			function clearTimeouts() {
				if(oldBlock.data('rsTimeout')) {
					if(oldBlock !== animBlock) {
						oldBlock.css({
								opacity: 0,
								display: 'none',
								zIndex: 0
							});
					}
					clearTimeout(oldBlock.data('rsTimeout'));
					oldBlock.data('rsTimeout', '');
				}
				if(animBlock.data('rsTimeout')) {
					clearTimeout(animBlock.data('rsTimeout'));
					animBlock.data('rsTimeout', '');
				}
			}
		},
		_stopAnimation: function() {
			var self = this;
			self._isAnimating = false;
			clearTimeout(self.loadingTimeout);
			if(self._isMove) {
				if(!self._useCSS3Transitions) {
					self._slidesContainer.stop(true);
					self._sPosition = parseInt(self._slidesContainer.css(self._xProp), 10);
				} else {
					var oldPos = self._sPosition;
					var newPos =  self._currRenderPosition = self._getTransformProp();

					self._slidesContainer.css((self._vendorPref + self._TD), 0);
					if(oldPos !==newPos) {
						self._setPosition(newPos);
					}
				}
			} else {
				// kung fu
				if(self._fadeZIndex > 20) {
					self._fadeZIndex = 10;
				} else {
					self._fadeZIndex++;
				}
			}
			
			
		},
		// Thanks to @benpbarnett
		_getTransformProp:function(){
			var self = this,
				transform = window.getComputedStyle(self._slidesContainer.get(0), null).getPropertyValue(self._vendorPref + 'transform'),			
				explodedMatrix = transform.replace(/^matrix\(/i, '').split(/, |\)$/g);		
			return parseInt(explodedMatrix[(self._slidesHorizontal ? 4 : 5)], 10);
		},
		_getCSS3Prop: function(pos, hor) {
			var self = this;
			return self._useCSS3Transitions ? self._tPref1 + ( hor ? (pos + self._tPref2 + 0) : (0 + self._tPref2 + pos) ) + self._tPref3 : pos;
		},
		_animationComplete: function(dir) {
			var self = this;
			if(!self._isMove) {
				self._currHolder.css('z-index', 0);
				self._fadeZIndex = 10;
			}
			self._isAnimating = false;
			
			self.staticSlideId = self.currSlideId;
			self._updateBlocksContent();


			self._slidesMoved = false;
			
			self.ev.trigger('rsAfterSlideChange');

			if (self.st.afterSlideChange) self.st.afterSlideChange.call(self);
		},
		_moveSlides: function() {
			var self = this,
				newPos;
			if(self._realId < 0 || self._realId >= self.numSlides) {
				self._slidesMoved = true;
				if(self._useCSS3Transitions) {
					self._slidesContainer.css((self._vendorPref + self._TD), '0s');
				}
				self._realId = self.currSlideId;
					self._setPosition( (-self._realId - self._idOffset) * self._slideSize);
					setTimeout(function() {
						self._isWorking = false;
					}, 0);
			}
		},
		_doBackAndForthAnim:function(type) {
			var self = this,
				newPos = (-self._realId - self._idOffset) * self._slideSize;
				moveDist = 30;

			if(self.st.loopRewind) {
				if(type === 'left') {
					self.goTo(self.numSlides - 1);
				} else {
					self.goTo(0);
				}
				return;
			}


			if(self._isAnimating) {
				return;
			}

			if(self._isMove) {
				if(moveDist !== 0) {
					self._currAnimSpeed = 200;

					function allAnimComplete() {
						self._isAnimating = false;
					}
					function firstAnimComplete() {
						self._isAnimating = false;
						self._animateTo(newPos, '', false, true, allAnimComplete);
					}
					self._animateTo(newPos + (type === 'left' ? moveDist : -moveDist),'', false, true, firstAnimComplete);
				}
			}
			
		},
		_resizeImage:function(slideObject, useClone) {

			var isRoot = true;
			if(slideObject.isRendered) {
				return;
			}
			var img = slideObject.content;
			var classToFind = 'rsImg';
			var isVideo;
			var self = this,
				imgAlignCenter = self.st.imageAlignCenter,
				imgScaleMode = self.st.imageScaleMode,
				tempEl;

			if(slideObject.videoURL) {
				classToFind = 'rsVideoContainer';
				if(imgScaleMode !== 'fill') {
					isVideo = true;
				} else {
					tempEl = img;
					if(!tempEl.hasClass(classToFind)) {
						tempEl = tempEl.find('.'+classToFind);
					}
					tempEl.css({width:'100%',height: '100%'});
					classToFind = 'rsImg';
				}
			}
			if(!img.hasClass(classToFind)) {
				isRoot = false;
				img = img.find('.'+classToFind);
			}

			var baseImageWidth = slideObject.iW,
				baseImageHeight = slideObject.iH;

			slideObject.isRendered = true;


			if(imgScaleMode === 'none' && !imgAlignCenter) {
				return;
			}

			if(imgScaleMode !== 'fill') {
				bMargin = self._imagePadding;
			} else {
				bMargin = 0;
			}
			//var block = img.parent('.block-inside').css('margin', bMargin);
			var containerWidth = self._wrapWidth - bMargin * 2,
				containerHeight = self._wrapHeight - bMargin * 2,
				hRatio,
				vRatio,
				ratio,
				nWidth,
				nHeight,
				cssObj = {};

			if(imgScaleMode === 'fit-if-smaller') {
				if(baseImageWidth > containerWidth || baseImageHeight > containerHeight) {
					imgScaleMode = 'fit';
				}
			}
			if(imgScaleMode === 'fill' || imgScaleMode === 'fit') {		
				hRatio = containerWidth / baseImageWidth;
				vRatio = containerHeight / baseImageHeight;

				if (imgScaleMode  == "fill") {
					ratio = hRatio > vRatio ? hRatio : vRatio;                    			
				} else if (imgScaleMode  == "fit") {
					ratio = hRatio < vRatio ? hRatio : vRatio;             		   	
				} else {
					ratio = 1;
				}

				nWidth = Math.ceil(baseImageWidth * ratio, 10);
				nHeight = Math.ceil(baseImageHeight * ratio, 10);
			} else {								
				nWidth = baseImageWidth;
				nHeight = baseImageHeight;		
			}
			if(imgScaleMode !== 'none') {
				cssObj.width = nWidth;
				cssObj.height = nHeight;
				if(isVideo) {
					img.find('.rsImg').css({width: '100%', height:'100%'});
				}
			}
			if (imgAlignCenter) {     
				cssObj.marginLeft = Math.floor((containerWidth - nWidth) / 2) +  bMargin;
				cssObj.marginTop = Math.floor((containerHeight - nHeight) / 2) +  bMargin;
			}
			img.css(cssObj);
		}
	}; /* RoyalSlider core prototype end */






	/**
	 *
	 * RoyalSlider thumbnails module
	 * 
	 */ 
	$.extend(RoyalSlider.prototype, {
		_initThumbs: function() {
			var self = this;
			if(self.st.controlNavigation === 'thumbnails') {

				self._thumbsDefaults = {
					drag: true,
					touch: true,
					orientation: 'horizontal',
					navigation: true,
					arrows: true,
					spacing: 4,
					arrowsAutoHide: false,
					transitionSpeed:600,
					autoCenter: true,
					fitInViewport: true, 
					firstMargin: true 
				};

				self.st.thumbs = $.extend({}, self._thumbsDefaults, self.st.thumbs);

				self.ev.on('rsBeforeParseNode', function(e, content, obj) {
					content = $(content);
					obj.thumbnail = content.find('.rsTmb').remove();
					if(!obj.thumbnail.length) {
						obj.thumbnail = content.attr('data-rsTmb');
						if(!obj.thumbnail) {
							obj.thumbnail = content.find('.rsImg').attr('data-rsTmb');
						}
						if(!obj.thumbnail) {
							obj.thumbnail = '';
						} else {
							obj.thumbnail = '<img src="'+obj.thumbnail+'"/>';
						}
					} else {
						obj.thumbnail = $(document.createElement('div')).append(obj.thumbnail).html();
					}
				});
			}	
		},
		_createThumbs: function() {
			var self = this, 
				tText = 'rsThumbs',
				out = '',
				style,
				item,
				spacing = self.st.thumbs.spacing;
			
			self._controlNavEnabled = true;

			if(spacing > 0) {
				var pxs = spacing + 'px ';
				style = ' style="margin: 0 ' + pxs + pxs + '0;"';
			} else {
				style ='';
			}

			self._thumbsHorizontal = (self.st.thumbs.orientation.toLowerCase() === 'vertical') ? false : true;
			self._thumbsPosition = 0;
			self._isThumbsAnimating = false;
			self._thumbsDrag = false;
			self._thumbsNavigation = false;

			self._thumbsArrows = (self.st.thumbs.arrows && self.st.thumbs.navigation);

			var pl = (self._thumbsHorizontal ? 'Hor' : 'Ver');
			self.slider.addClass('rsWithThumbs' + ' rsWithThumbs'+ pl );

			out += '<div class="rsNav ' + 'rsThumbs rsThumbs'+pl +'"><div class="'+tText+'Container">';
			
			for(var i = 0; i < self.numSlides; i++) {
				if(i === self.numSlides - 1) {
					style = '';
				}
				item = self._slides[i];
				
				out += '<div'+style+' class="rsNavItem rsThumb">'+item.thumbnail+'</div>'
			}

			out += '</div></div>';
			out = $(out);
			
			self._thumbsContainer = $(out).find('.' + tText + 'Container');

			if(self._thumbsArrows) {
				tText += 'Arrow';
				out.append('<div class="'+ tText +' ' + tText +'Left"><div class="'+tText+'Icn"></div></div><div class="'+tText+' '+tText+'Right"><div class="'+tText+'Icn"></div></div>');
				self._thumbsArrowLeft = out.find('.'+tText+'Left').click(function() {
					var viewportSize = Math.floor(self._thumbsViewportSize / self._thumbSize),
						thumbId = Math.floor(self._thumbsPosition / self._thumbSize),
						newPos = (thumbId + self._visibleThumbsPerView) * self._thumbSize;
					self._animateThumbsTo( newPos > self._thumbsMinPosition ? self._thumbsMinPosition : newPos );
				});
				self._thumbsArrowRight = out.find('.'+tText+'Right').click(function() {
					var viewportSize = Math.floor(self._thumbsViewportSize / self._thumbSize),
						thumbId = Math.floor(self._thumbsPosition / self._thumbSize),
						newPos = (thumbId - self._visibleThumbsPerView) * self._thumbSize;
					self._animateThumbsTo( newPos < self._thumbsMaxPosition ? self._thumbsMaxPosition : newPos );
				});
				if(self.st.thumbs.arrowsAutoHide && !self.hasTouch) {
					self._thumbsArrowLeft.css('opacity', 0);
					self._thumbsArrowRight.css('opacity', 0);

					out.one("mousemove.rsarrowshover",function() {
						if(self._thumbsNavigation) {
							self._thumbsArrowLeft.css('opacity', 1);
							self._thumbsArrowRight.css('opacity', 1);		
						}		
					});

					out.hover(
						function() {
							if(self._thumbsNavigation) {
								self._thumbsArrowLeft.css('opacity', 1);
								self._thumbsArrowRight.css('opacity', 1);
							}
						},
						function() {
							if(self._thumbsNavigation) {
								self._thumbsArrowLeft.css('opacity', 0);
								self._thumbsArrowRight.css('opacity', 0);
							}
						}
					);	
				}	
			}

			self._controlNav = out;
			self._controlNavItems = out.find('.rsNavItem');
			
			self.slider.append(out);
			
			self._thumbsEnabled = true;
			self._thumbsSpacing = spacing;

			if(self._useCSS3Transitions) {
				self._thumbsContainer.css(self._vendorPref + 'transition-property', self._vendorPref + 'transform');
			}

			self.ev.off('rsBeforeSizeSet.thumbs').on('rsBeforeSizeSet.thumbs', function() {
				self.updateThumbsSize();
			});
			
		},
		updateThumbsSize: function() {
			var self = this,
				firstThumb = self._controlNavItems.first(),
				cssObj = {};

			self._thumbSize = ( self._thumbsHorizontal ? firstThumb.outerWidth() : firstThumb.outerHeight() ) + self._thumbsSpacing;
			cssObj[self._thumbsHorizontal ? 'width' : 'height'] = self._thumbsContainerSize = self.numSlides * self._thumbSize - self._thumbsSpacing;
			self._thumbsViewportSize = self._thumbsHorizontal ? self._controlNav.width() : self._controlNav.height();
			self._thumbsMaxPosition = -(self._thumbsContainerSize - self._thumbsViewportSize) - (self.st.thumbs.firstMargin ? self._thumbsSpacing : 0);
			self._thumbsMinPosition = self.st.thumbs.firstMargin ? self._thumbsSpacing : 0;
			self._visibleThumbsPerView = Math.floor(self._thumbsViewportSize / self._thumbSize);

			if(self._thumbsContainerSize < self._thumbsViewportSize) {
				if(self.st.thumbs.autoCenter) {
					self._setThumbsPosition((self._thumbsViewportSize - self._thumbsContainerSize) / 2);
				}
				if(self.st.thumbs.arrows && self._thumbsArrowLeft) {
					var arrDisClass = 'rsThumbsArrowDisabled';
					self._thumbsArrowLeft.addClass(arrDisClass);
					self._thumbsArrowRight.addClass(arrDisClass);
				}
				self._thumbsNavigation = false;
				self._thumbsDrag = false;
				self._controlNav.off(self._downEvent);	

			} else if(self.st.thumbs.navigation && !self._thumbsNavigation) {
				self._thumbsNavigation = true;
				if( (!self.hasTouch && self.st.thumbs.drag) ||  (self.hasTouch && self.st.thumbs.touch)) {
					self._thumbsDrag = true;
					self._controlNav.on(self._downEvent, function(e) { self._onDragStart(e, true); });	
				}
			}

			self._thumbsContainer.css(cssObj);

			if(self._thumbsEnabled && (self.isFullscreen || self.st.thumbs.fitInViewport)) {
				if(self._thumbsHorizontal) {
					self._wrapHeight -= self._controlNav.outerHeight();
				} else {
					self._wrapWidth -= self._controlNav.outerWidth();
				}
			}
		},
		setThumbsOrientation: function(newPlacement, dontUpdateSize) {
			var self = this;
			self.st.thumbs.orientation = newPlacement;
			self._controlNav.remove();
			self.slider.removeClass('rsWithThumbsHor rsWithThumbsVer');
			self._createThumbs();
			self._controlNav.off(self._downEvent);	
			if(!dontUpdateSize) {
				self.updateSliderSize(true);
			}
		},
		_setThumbsPosition: function(pos) {
			var self = this;
			self._thumbsPosition = pos;
			if(self._useCSS3Transitions) {
				self._thumbsContainer.css(self._xProp, self._tPref1 + ( self._thumbsHorizontal ? (pos + self._tPref2 + 0) : (0 + self._tPref2 + pos) ) + self._tPref3 );		
			} else {
				self._thumbsContainer.css(self._thumbsHorizontal ? self._xProp : self._yProp, pos);
			}
		},
		_animateThumbsTo: function(pos, speed, outEasing, bounceAnimPosition, bounceAnimSpeed) {
			var self = this;
			if(!speed) {
				speed = self.st.thumbs.transitionSpeed;
			}
			self._thumbsPosition = pos;
			if(self._thumbsAnimTimeout) {
				clearTimeout(self._thumbsAnimTimeout);
			}
			if(self._isThumbsAnimating) {
				if(!self._useCSS3Transitions) {
					self._thumbsContainer.stop();
				}
				outEasing = true;
			}
			var animObj = {};
			self._isThumbsAnimating = true;
			if(!self._useCSS3Transitions) {
				animObj[self._thumbsHorizontal ? self._xProp : self._yProp] = pos + 'px';
				self._thumbsContainer.animate(animObj, speed, outEasing ? 'easeOutCubic' : self.st.easeInOut);
			} else { 
				animObj[(self._vendorPref + 'transition-duration')] = speed+'ms';
				animObj[(self._vendorPref + 'transition-timing-function')] = outEasing ? $.rsCSS3Easing[self.st.easeOut] : $.rsCSS3Easing[self.st.easeInOut];
				self._thumbsContainer.css(animObj);
				self._setThumbsPosition(pos);
			}
			if(bounceAnimPosition) {
				self._thumbsPosition = bounceAnimPosition;
			}
			self._updateThumbsArrows();
			
			
			self._thumbsAnimTimeout = setTimeout(function() {
				self._isThumbsAnimating = false;
				if(bounceAnimSpeed) {
					self._animateThumbsTo(bounceAnimPosition, bounceAnimSpeed, true);
					bounceAnimSpeed = null;
				}
			}, speed);
		},
		_updateThumbsArrows: function() {
			var self = this;
			if(self._thumbsArrows) {
				var arrDisClass = 'rsThumbsArrowDisabled';
				
				if(self._thumbsPosition === self._thumbsMinPosition) {
					self._thumbsArrowLeft.addClass(arrDisClass);
				} else {
					self._thumbsArrowLeft.removeClass(arrDisClass);
				}
				if(self._thumbsPosition === self._thumbsMaxPosition) {
					self._thumbsArrowRight.addClass(arrDisClass);
				} else {
					self._thumbsArrowRight.removeClass(arrDisClass);
				}
			}
		},
		_setCurrentThumb: function(id, justSet) {
			var self = this,
				incr = 0,
				newPos,
				nextThumbEndPos = (id * self._thumbSize + self._thumbSize * 2 - self._thumbsSpacing + self._thumbsMinPosition),
				thumbId = Math.floor(self._thumbsPosition / self._thumbSize);
			if(nextThumbEndPos  + self._thumbsPosition > self._thumbsViewportSize) {
				if(id === self.numSlides - 1) {
					incr = 1;
				}
				thumbId = -id + self._visibleThumbsPerView - 2 + incr;
				newPos = thumbId * self._thumbSize + (self._thumbsViewportSize % self._thumbSize) + self._thumbsSpacing - self._thumbsMinPosition;
			} else {
				if(id !== 0) {
					if( (id-1) * self._thumbSize <= -self._thumbsPosition + self._thumbsMinPosition && (id-1) <= self.numSlides - self._visibleThumbsPerView) {
						thumbId = -id + 1;
						newPos = thumbId * self._thumbSize + self._thumbsMinPosition;
					}
				} else {
					thumbId = 0;
					newPos = self._thumbsMinPosition;
				}
			}
			if(newPos !== self._thumbsPosition) {
				var checkPos = (newPos === undefined) ? self._thumbsPosition : newPos;
				if(checkPos > self._thumbsMinPosition) {
					self._setThumbsPosition(self._thumbsMinPosition);
				} else if(checkPos < self._thumbsMaxPosition) {
					self._setThumbsPosition(self._thumbsMaxPosition);
				} else  if(newPos !== undefined) {
					if(!justSet) {
						self._animateThumbsTo(newPos);
					} else {
						self._setThumbsPosition(newPos);
					}
				}
			}
			self._updateThumbsArrows();
		}
	});
	rsModules.thumbnails = RoyalSlider.prototype._initThumbs;




	/**
	 *
	 * RoyalSlider fullscreen module
	 * 
	 */
	$.extend(RoyalSlider.prototype, {
		_initFullscreen: function() {
			var self = this;

			self._fullscreenDefaults = {
				enabled: false,
				keyboardNav: true,
				buttonFS: true,
				nativeFS: false,
				doubleTap: true
			};
			self.st.fullscreen = $.extend({}, self._fullscreenDefaults, self.st.fullscreen);

			if(self.st.fullscreen.enabled) {
				self.ev.one('rsBeforeSizeSet', function() {
					self._setupFullscreen();
				});
			}
			
		},
		_setupFullscreen: function() {
			var self = this;
			self._fsKeyboard = (!self.st.keyboardNavEnabled && self.st.fullscreen.keyboardNav);

			if(self.st.fullscreen.nativeFS) {
				// Thanks to John Dyer http://j.hn/
			    self._fullScreenApi = {
			            supportsFullScreen: false,
			            isFullScreen: function() { return false; },
			            requestFullScreen: function() {},
			            cancelFullScreen: function() {},
			            fullScreenEventName: '',
			            prefix: ''
			        };
			    var browserPrefixes = 'webkit moz o ms khtml'.split(' ');
			    // check for native support
			    if (typeof document.cancelFullScreen != 'undefined') {
			         self._fullScreenApi.supportsFullScreen = true;
			    } else {
			        // check for fullscreen support by vendor prefix
			        for (var i = 0; i < browserPrefixes.length; i++ ) {
			             self._fullScreenApi.prefix = browserPrefixes[i];
			 
			            if (typeof document[ self._fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
			                 self._fullScreenApi.supportsFullScreen = true;
			 
			                break;
			            }
			        }
			    }
			 
			    // update methods to do something useful
			    if ( self._fullScreenApi.supportsFullScreen) {
			         self._fullScreenApi.fullScreenEventName =  self._fullScreenApi.prefix + 'fullscreenchange.rs';
			 
			         self._fullScreenApi.isFullScreen = function() {
			            switch (this.prefix) {
			                case '':
			                    return document.fullScreen;
			                case 'webkit':
			                    return document.webkitIsFullScreen;
			                default:
			                    return document[this.prefix + 'FullScreen'];
			            }
			        }
			         self._fullScreenApi.requestFullScreen = function(el) {
			            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
			        }
			         self._fullScreenApi.cancelFullScreen = function(el) {
			            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
			        }
			    } else {
			    	self._fullScreenApi = false;
			    }
			}


			if(self.st.fullscreen.buttonFS) {
				self._fsBtn = $('<div class="rsFullscreenBtn"><div class="rsFullscreenIcn"></div></div>')
					.appendTo(self.st.controlsInside ? self._sliderOverflow : self.slider)
					.on('click.rs', function() {
						if(self.isFullscreen) {
							self.exitFullscreen();
						} else {
							self.enterFullscreen();
						}
					});
			}
		},
		enterFullscreen: function(preventNative) {
			var self = this;
			if( self._fullScreenApi ) {
				if(!preventNative) {
					self._doc.on( self._fullScreenApi.fullScreenEventName, function(e) {
						if(!self._fullScreenApi.isFullScreen()) {
							self.exitFullscreen(true);
						} else {
							self.enterFullscreen(true);
						}
					});
					self._fullScreenApi.requestFullScreen($('html')[0]);
					return;
				} else {
					self._fullScreenApi.requestFullScreen($('html')[0]);
				}
			}

			if(self._isFullscreenUpdating) {
				return;
			}
			self._isFullscreenUpdating = true;

			self._doc.on('keyup.rsfullscreen', function(e) {
				if(e.keyCode === 27) {
					self.exitFullscreen();
				}
			});
			if(self._fsKeyboard) {
				self._bindKeyboardNav();
			}

			self._htmlStyle = $('html').attr('style');
			self._bodyStyle = $('body').attr('style');
			self._sliderStyle = self.slider.attr('style');
			

			$('body, html').css({
				overflow: 'hidden',
				height: '100%',
				width: '100%',
				margin: '0',
				padding: '0'
			});
			self.slider.addClass('rsFullscreen');
			//setTimeout(function(){
			//
			var item,
				i;
			for(i = 0; i < self.numSlides; i++) {
				item = self._slides[i];

				


				
				item.isRendered = false;
				if(item.bigImage) {

					item.isMedLoaded = item.isLoaded;
					item.isMedLoading = item.isLoading;
					item.medImage = item.image;
					item.medIW = item.iW;
					item.medIH = item.iH;
					item.slideId = -99;

					if(item.bigImage !== item.medImage) {
						item.sizeType = 'big';
					}

					item.isLoaded = item.isBigLoaded;
					item.isLoading = item.isBigLoading;
					
					item.image = item.bigImage;
					item.iW = item.bigIW;
					item.iH = item.bigIH;

					item.contentAdded = false;
					
					var newHTML = !item.isLoaded ? '<a class="rsImg" href="'+item.image+'"></a>' : '<img class="rsImg" src="'+item.image+'"/>';
					if(item.content.hasClass('rsImg')) {
						item.content = $(newHTML);
					} else {
						item.content.find('.rsImg').replaceWith(newHTML);
					}
				}
				
			}

			
			self.isFullscreen = true;
			
			setTimeout(function() {
				self._isFullscreenUpdating = false;
				self.updateSliderSize();
			}, 100);
			
		},
		exitFullscreen: function(preventNative) {
			var self = this;

			if( self._fullScreenApi ) {
				if(!preventNative) {
					self._fullScreenApi.cancelFullScreen($('html')[0]);
					return;
				}
				self._doc.off( self._fullScreenApi.fullScreenEventName );
			}
			if(self._isFullscreenUpdating) {
				return;
			}
			self._isFullscreenUpdating = true;

			self._doc.off('keyup.rsfullscreen');
			if(self._fsKeyboard) {
				self._doc.off('keydown.rskb');
			}

			$('html').attr('style', self._htmlStyle || '');
			$('body').attr('style', self._bodyStyle || '');
			self.slider.removeClass('rsFullscreen');

			
			
			var item,
				i;
			for(i = 0; i < self.numSlides; i++) {
				item = self._slides[i];
				
				
				item.isRendered = false;
				if(item.bigImage) {
					
					item.slideId = -99;
					item.isBigLoaded = item.isLoaded;
					item.isBigLoading = item.isLoading;
					item.bigImage = item.image;
					item.bigIW = item.iW;
					item.bigIH = item.iH;
					item.isLoaded = item.isMedLoaded;
					item.isLoading = item.isMedLoading;
					item.image = item.medImage;
					item.iW = item.medIW;
					item.iH = item.medIH;

					item.contentAdded = false;

					var newHTML = !item.isLoaded ? '<a class="rsImg" href="'+item.image+'"></a>' : '<img class="rsImg" src="'+item.image+'"/>';
					if(item.content.hasClass('rsImg')) {
						item.content = $(newHTML);
					} else {
						item.content.find('.rsImg').replaceWith(newHTML);
					}
					if(item.holder) {
						item.holder.html(item.content);
					}
					
					if(item.bigImage !== item.medImage) {
						item.sizeType = 'med';
					}
				}
					
					
					
				
			}
			
			self.isFullscreen = false;
			//self._updateBlocksContent();


			
			setTimeout(function() {
				self._isFullscreenUpdating = false;
				self.updateSliderSize();
			}, 100);
		}
	});
	rsModules.fullscreen = RoyalSlider.prototype._initFullscreen;


	/**
	 *
	 * RoyalSlider auto play module
	 * 
	 */
	$.extend(RoyalSlider.prototype, {
		_initAutoplay: function() {
			var self = this,
				del;

			self._autoPlayDefaults = {
				enabled: false,
		     	stopAtAction: true,
		     	pauseOnHover: true,
		     	delay: 300
			};
			self.st.autoPlay = $.extend({}, self._autoPlayDefaults, self.st.autoPlay);

			if(self.st.autoPlay.enabled) {
				self.ev.on('rsBeforeParseNode', function(e, content, obj) {
					content = $(content);
					del = content.attr('data-rsDelay');
					if(del) {
						obj.customDelay = parseInt(del, 10);
					}
				});
				self.ev.one('rsAfterInit', function() {
					self._setupAutoPlay();
				});
			}
			
		},
		_setupAutoPlay: function() {
			var self = this;
				
			self.startAutoPlay();

			self.ev.on('rsAfterContentSet', function(e, slideObject) {
				if(!self._isDragging && !self._isAnimating && self._autoPlayEnabled && slideObject === self.currSlide ) {
					self._play();
				}
			});
			self.ev.on('rsDragRelease', function() {
				if(self._autoPlayEnabled && self._autoPlayPaused) {
					self._autoPlayPaused = false;
					self._play();
				}
			});
			self.ev.on('rsAfterSlideChange', function() {
				if(self._autoPlayEnabled) {
					if(self._autoPlayPaused) {
						self._autoPlayPaused = false; 
						if(self.currSlide.isLoaded) {
							self._play();
						}
					}
				}
			});
			self.ev.on('rsDragStart', function() {
				if(self._autoPlayEnabled) {
					if(self.st.autoPlay.stopAtAction) {
						self.stopAutoPlay();
					} else {
						self._autoPlayPaused = true;
						self._pause();
					}
				}
			});
			self.ev.on('rsBeforeMove', function(e, type, userAction) {
				if(self._autoPlayEnabled) {
					if(userAction && self.st.autoPlay.stopAtAction) {
						self.stopAutoPlay();
					} else {
						self._autoPlayPaused = true;
						self._pause();
					}
				}
			});


			if(self.st.autoPlay.pauseOnHover) {
				self._pausedByHover = false;
				self.slider.hover(
					function() {
						if(self._autoPlayEnabled) {
							self._autoPlayPaused = false;
							self._pause();
							self._pausedByHover = true;
						} 
					},
					function() {
						if(self._autoPlayEnabled) {
							self._pausedByHover = false;
							self._play();
						}
					}
				);	
			}
			
		},
		startAutoPlay: function() {
			var self = this;
			self._autoPlayEnabled = true;
			if(self.currSlide.isLoaded) {
				self._play();
			}
		},
		stopAutoPlay: function() {
			var self = this;
			self._pausedByHover = self._autoPlayPaused = self._autoPlayEnabled = false;
			self._pause();
		},
		_play: function() {
			var self = this;
			if(!self._pausedByHover) {
				self._autoPlayRunning = true;
				if(self._autoPlayTimeout) {
					clearTimeout(self._autoPlayTimeout);
				}
				self._autoPlayTimeout = setTimeout(function() {
					self.next(true);
				}, !self.currSlide.customDelay ? self.st.autoPlay.delay : self.currSlide.customDelay);
			}
			
		},
		_pause: function() {
			var self = this;
			if(!self._pausedByHover) {
				self._autoPlayRunning = false;
				if(self._autoPlayTimeout) {
					clearTimeout(self._autoPlayTimeout);
					self._autoPlayTimeout = null;
				}
			}
		}
	});
	rsModules.autoplay = RoyalSlider.prototype._initAutoplay;


	/**
	 *
	 * RoyalSlider video module
	 * 
	 */
	$.extend(RoyalSlider.prototype, {
		_initVideo: function() {
			var self = this;
			self._videoDefaults = {
				autoHideArrows: true,
				autoHideControlNav: false,
				autoHideBlocks: false,
				youTubeCode: '<iframe src="http://www.youtube.com/embed/%id%?rel=1&autoplay=1&showinfo=0" frameborder="no"></iframe>',
				vimeoCode: '<iframe src="http://player.vimeo.com/video/%id%?byline=0&amp;portrait=0&amp;autoplay=1" frameborder="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
			};

			self.st.video = $.extend({}, self._videoDefaults, self.st.video);

			self.ev.on('rsBeforeSizeSet', function() {
				if(self._isVideoPlaying) {
					setTimeout(function() {
						var content = self._currHolder;
						content = content.hasClass('rsVideoContainer') ? content : content.find('.rsVideoContainer');
						self._currVideoFrame.css({
							width: content.width(),
							height: content.height()
						});
					}, 32);
				}
			});

			self.ev.on('rsAfterParseNode', function(e, content, obj) {
				var jqcontent = $(content),
					tempEl,
					hasVideo;

				if(obj.videoURL) {
					var wrap = $('<div class="rsVideoContainer"></div>'),
						playBtn = $('<div class="rsBtnCenterer"><div class="rsPlayBtn"><div class="rsPlayBtnIcon"></div></div></div>');
					if(jqcontent.hasClass('rsImg')) {
						obj.content = wrap.append(jqcontent).append(playBtn);
					} else {
						obj.content.find('.rsImg').wrap(wrap).after(playBtn);
					}

				}
			});

		},
		toggleVideo: function() {
			var self = this;
			if(!self._isVideoPlaying) {
				return self.playVideo();
			} else {
				return self.stopVideo();
			}
		},
		playVideo: function() {
			var self = this;
			if(!self._isVideoPlaying) {
				var currSlide = self.currSlide;
				if(!currSlide.videoURL) {
					return false;
				}

				
				var content = self._currVideoContent = currSlide.content;
				var url = currSlide.videoURL,
					videoId,
					regExp,
					match;

				if( url.match(/youtu\.be/i) || url.match(/youtube\.com\/watch/i) ) {
					regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
				    match = url.match(regExp);
				    if (match && match[7].length==11){
				        videoId = match[7];
				    }

					if(videoId !== undefined) {
						self._currVideoFrame = self.st.video.youTubeCode.replace("%id%", videoId);
					}
				} else if(url.match(/vimeo\.com/i)) {
					regExp = /\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
					match = url.match(regExp);
					if(match) {
						videoId = match[2];
					}
					if(videoId !== undefined) {
						self._currVideoFrame = self.st.video.vimeoCode.replace("%id%", videoId);
					}
				}


				if(self._currVideoFrame) {
					self._currVideoFrame = $('<div class="rsVideoFrameHolder"><div class="rsPreloader"></div>' + self._currVideoFrame + '<div class="rsCloseVideoBtn"><div class="rsCloseVideoIcn"></div></div></div>');//.appendTo(self._videoContainer.css('display', 'block'));
					var content = content.hasClass('rsVideoContainer') ? content : content.find('.rsVideoContainer');
					self._currVideoFrame.css({
						width: content.width(),
						height: content.height()
					}).find('.rsCloseVideoBtn').off('click.rsv').on('click.rsv', function(e) {
						self.stopVideo();
						e.preventDefault();
						e.stopPropagation();
						return false;
					});
					content.append(self._currVideoFrame);
					if(self.isIPAD) {
						content.addClass('rsIOSVideo');
					}

					if(self._arrowLeft && self.st.video.autoHideArrows) {
						self._arrowLeft.addClass('rsHidden');
						self._arrowRight.addClass('rsHidden');
						self._arrowsAutoHideLocked = true;
					}
					if(self._controlNav && self.st.video.autoHideControlNav) {
						self._controlNav.addClass('rsHidden');
					}
					if(self.st.video.autoHideBlocks && self.currSlide.animBlocks) {
						self.currSlide.animBlocks.addClass('rsHidden');
					}

					setTimeout(function() {
						self._currVideoFrame.addClass('rsVideoActive');
					}, 10);
					self._isVideoPlaying = true;
				}
				return true;
			}
			return false;
		},
		stopVideo: function() {
			var self = this;
			if(self._isVideoPlaying) {
				//self._videoContainer.css('display', 'none');
				if(self.isIPAD) {
					self.slider.find('.rsCloseVideoBtn').remove();
				}
				if(self._arrowLeft && self.st.video.autoHideArrows) {
					self._arrowLeft.removeClass('rsHidden');
					self._arrowRight.removeClass('rsHidden');
					self._arrowsAutoHideLocked = false;
				}
				if(self._controlNav && self.st.video.autoHideControlNav) {
					self._controlNav.removeClass('rsHidden');
				}
				if(self.st.video.autoHideBlocks && self.currSlide.animBlocks) {
					self.currSlide.animBlocks.removeClass('rsHidden');
				}

				setTimeout(function() {
					self._currVideoFrame.remove();
				}, 16);
				
				//self._currVideoContent.fadeIn();
				self._isVideoPlaying = false;
				return true;
			} 
			return false;
		}
	});
	rsModules.video = RoyalSlider.prototype._initVideo;




	/**
	 *
	 * RoyalSlider tabs module
	 * 
	 */ 
	$.extend(RoyalSlider.prototype, {
		_initTabs: function() {
			var self = this;
			if(self.st.controlNavigation === 'tabs') {
				self.ev.on('rsBeforeParseNode', function(e, content, obj) {
				content = $(content);
				obj.thumbnail = content.find('.rsTmb').remove();
				if(!obj.thumbnail.length) {

						obj.thumbnail = content.attr('data-rsTmb');
						if(!obj.thumbnail) {
							obj.thumbnail = content.find('.rsImg').attr('data-rsTmb');
						}
						if(!obj.thumbnail) {
							obj.thumbnail = '';
						} else {
							obj.thumbnail = '<img src="'+obj.thumbnail+'"/>';
						}
					} else {
						obj.thumbnail = $(document.createElement('div')).append(obj.thumbnail).html();
					}
				});
			}
			
		},
		_createTabs: function() {
			var self = this, 
				out = '',
				item;

			self._controlNavEnabled = true;
			out += '<div class="rsNav rsTabs">';
			for(var i = 0; i < self.numSlides; i++) {
				if(i === self.numSlides - 1) {
					style = '';
				}

				item = self._slides[i];
				out += '<div class="rsNavItem rsTab">'+item.thumbnail+'</div>'
			}

			out += '</div>';
			out = $(out);

			self._controlNav = out;
			self._controlNavItems = out.find('.rsNavItem');
			
			self.slider.append(out);
		}
	});
	rsModules.tabs = RoyalSlider.prototype._initTabs;




	/**
	 *
	 * RoyalSlider auto height module
	 * 
	 */ 
	$.extend(RoyalSlider.prototype, {
		_initAutoHeight: function() {
			var self = this;
			if(self.st.autoHeight) {
				var holder,
					tH,
					currHeight;
				self.slider.addClass('rsAutoHeight');
				self.ev.on('rsAfterInit', function() {
					setTimeout(function() {
						updHeight(false);
						setTimeout(function() {
							self.slider.append('<div id="clear" style="clear:both;"></div>');
							if(self._useCSS3Transitions) {
								self._sliderOverflow.css(self._vendorPref + 'transition', 'height ' + self.st.transitionSpeed + 'ms ease-in-out');
							}
						}, 16);
					}, 16);
				});
				self.ev.on('rsBeforeAnimStart', function() {
					updHeight(true);
				});
				self.ev.on('rsAfterSlideChange', function() {
					updHeight(true);
				});
				self.ev.on('rsBeforeSizeSet' , function() {
					setTimeout(function() {
						updHeight(false);
					}, 16);
				});
				function updHeight(animate) {
					holder = self._slides[self.currSlideId].holder;
					if(holder) {
						tH = holder.height();
						if(tH !== 0 && tH !== currHeight) {
							self._wrapHeight = tH;
							if(self._useCSS3Transitions || !animate) {
								self._sliderOverflow.css('height', tH);
							} else {
								self._sliderOverflow.stop(true,true).animate({height: tH}, self.st.transitionSpeed);
							}
							
						}
					}
				}
			}
			
		}
	});
	rsModules.autoHeight = RoyalSlider.prototype._initAutoHeight;



	/**
	 *
	 * RoyalSlider active class module
	 * 
	 */ 
	RoyalSlider.prototype._initActiveClass = function() {
		var updClassTimeout,
			self = this;
		if(self.st.addActiveClass) {
			self.ev.on('rsBeforeMove', function() {
				updClass();
			});
			self.ev.on('rsAfterInit', function() {
				updClass();
			});
			function updClass() {
				if(updClassTimeout) {
					clearTimeout(updClassTimeout);
				}
				updClassTimeout = setTimeout(function() {
					if(self._oldHolder) self._oldHolder.removeClass('rsActiveSlide');
					if(self._currHolder) self._currHolder.addClass('rsActiveSlide');
					updClassTimeout = null;
				}, 50);
			}
		}
	};
	rsModules.activeClass = RoyalSlider.prototype._initActiveClass;
	
			
	/**
	 *
	 * RoyalSlider global caption module
	 * 
	 */ 
	$.extend(RoyalSlider.prototype, {
		_initGlobalCaption: function() {
			var self = this;
			if(self.st.globalCaption) {
				self.ev.on('rsAfterInit', function() {
					self.globalCaption = $('<div class="rsGCaption"></div>').appendTo(self.slider);
					setCurrCaptionHTML();
				});
				self.ev.on('rsBeforeAnimStart' , function() {
					setCurrCaptionHTML();
				});
				function setCurrCaptionHTML() {
					self.globalCaption.html(self.currSlide.caption);
				}
			}
		}
	});
	rsModules.globalCaption = RoyalSlider.prototype._initGlobalCaption;



	/**
	 *
	 * RoyalSlider animated blocks module
	 * 
	 */ 
	$.extend(RoyalSlider.prototype, {
		_initAnimatedBlocks: function() {


			var self = this,
				i;

			self._blockDefaults = {
				fadeEffect: true,
				moveEffect: 'top', // Sets direction of transition. may be: left, right, top, bottom. 
				moveOffset:20,                   // Default distance for move effect in px
				speed:400,                   // Default caption show speed in ms
				easing:'easeOutSine',       // Default caption show easing
				delay:200                   // Default delay between captions on one slide show
			};
			self.st.block = $.extend({}, self._blockDefaults, self.st.block);


			self._blockAnimProps = [];
			self._animatedBlockTimeouts = [];

			self.ev.on('rsAfterInit', function() {
				runBlocks();
			});

			self.ev.on('rsBeforeParseNode', function(e, content, obj) {
				content = $(content);

				obj.animBlocks = content.find('.rsABlock').css('display', 'none');
				if(!obj.animBlocks.length) {
					if(content.hasClass('rsABlock')) {
						obj.animBlocks = content.css('display', 'none');
					} else {
						obj.animBlocks = false;
					}
				}
			});
			self.ev.on('rsAfterContentSet', function(e, slideObject) {
				if(slideObject.id === self.currSlideId) {
					setTimeout(function() {
						runBlocks();
					}, self.st.fadeinLoadedSlide ? 300 : 0);
				}
			});
		
			self.ev.on('rsAfterSlideChange', function() {
				runBlocks();
			});
			function runBlocks() {
				var slide = self.currSlide;
				if(!self.currSlide || !self.currSlide.isLoaded) {
					return;
				}

				// clear previous animations
				if(self._slideWithBlocks !== slide) {
					if(self._animatedBlockTimeouts.length > 0) {
						for(i = 0; i < self._animatedBlockTimeouts.length; i++) { 
							clearTimeout(self._animatedBlockTimeouts[i]);
						}
						self._animatedBlockTimeouts = [];
					}
					
					if(self._blockAnimProps.length > 0) {						
						var cItemTemp;
						for(i = 0; i < self._blockAnimProps.length; i++) {  
							cItemTemp = self._blockAnimProps[i];							
							if(cItemTemp) {								
								if(!self._useCSS3Transitions) {
									if(cItemTemp.running) {
										cItemTemp.block.stop(true, true);
									} else {
										cItemTemp.block.css(cItemTemp.css);
									}
								} else {
									cItemTemp.block.css(self._vendorPref + self._TD, '0s');
									cItemTemp.block.css(cItemTemp.css);
								}
								self._slideWithBlocks = null;
								slide.animBlocksDisplayed = false;
							}
						}
						self._blockAnimProps = [];
					}
					if(slide.animBlocks) {
						slide.animBlocksDisplayed = true;
						self._slideWithBlocks = slide;
						self._animateBlocks(slide.animBlocks);
					}
				}
			}
		},
		_animateBlocks: function(animBlocks) {
			var self = this,
				item,
				animObj,
				newPropObj,
				transitionData;

			var currItem,
				fadeEnabled,
				moveEnabled,				
				effectName,	
				effectsObject,
				moveEffectProperty,
				currEffects,
				newEffectObj,	
				moveOffset,
				delay,
				speed,
				easing,
				moveProp,
				i;

			self._animatedBlockTimeouts = [];

			animBlocks.each(function(index) {
				item = $(this);
				
				animObj = {};
				newPropObj = {};
				transitionData = null;
				
					

					var moveOffset = item.data('move-offset');
					if(isNaN(moveOffset)) {
						moveOffset = self.st.block.moveOffset;
					}



					if(moveOffset > 0) {
						var moveEffect = item.data('move-effect');
						if(moveEffect) {
							moveEffect = moveEffect.toLowerCase();
							if(moveEffect === 'none') {
								moveEffect = false;
							} else if(moveEffect !== 'left' && moveEffect !== 'top' && moveEffect !== 'bottom' && moveEffect !== 'right') {
								moveEffect = self.st.block.moveEffect;
								if(moveEffect === 'none') {
									moveEffect = false;
								}
							}
						} else {
							moveEffect = self.st.block.moveEffect;
						}
						if(moveEffect) {
							var moveHorizontal;
							if(moveEffect === 'right' || moveEffect === 'left') {
								moveHorizontal = true;
							} else {
								moveHorizontal = false;
							}
							var currPos,
								moveProp,
								startPos;

							// var isOppositeProp = item.attr('data-opposite');
							// if(!isOppositeProp) {
							// 	isOppositeProp = self.st.blockOppositeProp;
							// } else {
							// 	isOppositeProp = isOppositeProp.toLowerCase() === 'true' ? true : false;
							// }
							isOppositeProp = false;
							
							if(self._useCSS3Transitions) {
								currPos = 0;
								moveProp = self._xProp;
							} else {
								if(moveHorizontal) {
									if( !isNaN( parseInt(item.css('right'), 10) ) ) {
										moveProp = 'right';
										isOppositeProp = true;
									} else {
										moveProp = 'left';
									}
								} else {

									if( !isNaN( parseInt(item.css('bottom'), 10) ) ) {
										moveProp = 'bottom';
										isOppositeProp = true;
									} else {
										moveProp = 'top';
									}
								}
								moveProp = 'margin-'+moveProp;
								if(isOppositeProp) {
									moveOffset = -moveOffset;
								}
								currPos = parseInt(item.css(moveProp), 10); 
							}

							if(moveEffect === 'top' || moveEffect === 'left') {
								startPos = currPos - moveOffset;
							} else {
								startPos = currPos + moveOffset;
							}
							
							newPropObj[moveProp] = self._getCSS3Prop(startPos, moveHorizontal);
							animObj[moveProp] = self._getCSS3Prop(currPos, moveHorizontal);
							
						}
					}
					

					var fadeEffect = item.attr('data-fade-effect');
					if(!fadeEffect) {
						fadeEffect = self.st.block.fadeEffect;
					} else if(fadeEffect.toLowerCase() === 'none' || fadeEffect.toLowerCase() === 'false') {
						fadeEffect = false;
					}
					if(fadeEffect) {
						newPropObj.opacity = 0;
						animObj.opacity = 1;
					}

					if(fadeEffect || moveEffect) {
						transitionData = {};
						transitionData.hasFade = Boolean(fadeEffect);
						if(Boolean(moveEffect)) {
							transitionData.moveProp = moveProp;
							transitionData.hasMove = true;
						}

						transitionData.speed = item.data('speed');
						if(isNaN(transitionData.speed)) {
							transitionData.speed = self.st.block.speed;
						}
						transitionData.easing = item.data('easing');
						if(!transitionData.easing) {
							transitionData.easing = self.st.block.easing;
						}
						transitionData.css3Easing = $.rsCSS3Easing[transitionData.easing];

						transitionData.delay =  item.data('delay');
						if(isNaN(transitionData.delay)) {
							transitionData.delay = self.st.block.delay * index;
						}

					}

					var blockPropsObj = {};
					if(self._useCSS3Transitions) {
						blockPropsObj[(self._vendorPref + self._TD)] =  '0ms';
					}
					blockPropsObj.moveProp = animObj.moveProp;
					blockPropsObj.opacity = animObj.opacity;
					blockPropsObj.display = 'none';


					self._blockAnimProps.push({block:item, css:blockPropsObj});
					item.css(newPropObj);

					// animate caption
					self._animatedBlockTimeouts.push(setTimeout((function (cItem, animateData, transitionData, index) {	
						return function() {	
							cItem.css('display', 'block');
							if(transitionData) {
								var animObj = {};
								if(!self._useCSS3Transitions) {
									setTimeout(function() {
										cItem.animate(animateData, transitionData.speed, transitionData.easing);
									}, 16);
								} else {
									var prop = '';
									if(transitionData.hasMove) {
										prop += transitionData.moveProp;
									} 
									if(transitionData.hasFade) {
										if(transitionData.hasMove) {
											prop += ', ';
										}
										prop += 'opacity';
									}
									animObj[(self._vendorPref + self._TP)] = prop;
									animObj[(self._vendorPref + self._TD)] =  transitionData.speed + 'ms';
									animObj[(self._vendorPref + self._TTF)] = transitionData.css3Easing;
									cItem.css(animObj);
									setTimeout(function() {
										cItem.css(animateData);
									}, 16);
								}
							}
					
							delete self._animatedBlockTimeouts[index];
						};
					})(item, animObj, transitionData, index), transitionData.delay));				
				//}	



			});
		}
	});
	rsModules.animatedBlocks = RoyalSlider.prototype._initAnimatedBlocks;


	$.fn.royalSlider = function(options) {    	

		return this.each(function(){
			var self = $(this);
			if (typeof options === "object" ||  !options) {
				if( !self.data('royalSlider') ) {
					self.data('royalSlider', new RoyalSlider(self, options));
				}
			} else {
				var royalSlider = self.data('royalSlider');
				if (royalSlider && royalSlider[options]) {
					return royalSlider[options].apply(royalSlider, Array.prototype.slice.call(arguments, 1));
				}
			}
		});
	};

	$.fn.royalSlider.defaults = {    

		slidesSpacing: 8,
		startSlideId: 0,

		loop: false,
		loopRewind: false,

		numImagesToPreload: 4,
		fadeinLoadedSlide: true,

		

		slidesOrientation: 'horizontal', 

		transitionType: 'move', 
		transitionSpeed: 600,

		controlNavigation: 'bullets',

		controlsInside: true, 


		arrowsNav: true,
		arrowsNavAutoHide: true,
		navigateByClick: true,

		randomizeSlides: false,
		
		sliderDrag: true, 
		sliderTouch: true,


		keyboardNavEnabled: false,

		fadeInAfterLoaded: true,

		allowCSS3OnWebkit: true,

		
		addActiveClass: false,
		autoHeight: false,

		easeOut: 'easeOutSine',
		easeInOut: 'easeInOutSine',


		imageScaleMode:"fit-if-smaller",                  // Scale mode of images. "fill", "fit", "fit-if-smaller" or "none"
		imageAlignCenter:true,					// Aligns all images to center.
		imageScalePadding: 4,

		autoScaleSlider: false,                 // Overrides css slider size settings. Sets slider height based on base width and height. Don't forget to set slider width to 100%.
   		autoScaleHeight: true,					// Scales height based on width, otherwise - width based on height
   		autoScaleSliderWidth: 800,              // Base slider width
   		autoScaleSliderHeight: 400,              // Base slider height


   		globalCaption: false,

   		beforeSlideChange: null,        // Callback, triggers before slide transition
		afterSlideChange: null,         // Callback, triggers after slide transition
		beforeResize: null,				// Callback, triggers before slider size is changed (on start too)
		afterResize: null				// Callback, triggers after slider size is changed (on start too)
	}; /* default options end */

	$.rsCSS3Easing = {
		easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
		easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
	};

	$.extend(jQuery.easing, {
		easeInOutSine: function (x, t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		},
		easeOutSine: function (x, t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeOutCubic: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		}
	});

})(jQuery);