  window.addEventListener('load', (event) => {
    console.log("Page loaded.");
  });
  
  // Scramble text
  /*!
 * ScrambleText
 * https://github.com/yomotsu/ScrambleText
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ScrambleText = factory());
}(this, (function () { 'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ATTR_IDLING = 'data-scramble-text-idling';
	var ATTR_RUNNING = 'data-scramble-text-running';

	var ScrambleText = function () {
		function ScrambleText(el) {
			var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			_classCallCheck(this, ScrambleText);

			this._startTime = 0;
			this._elapsedTime = 0;
			this._running = false;
			this._idling = true;
			this._position = 0;
			this._contents = split(el.innerHTML);
			this._anim = anim.bind(this);

			this.el = el;
			this.timeOffset = option.timeOffset || 50;
			this.fps = option.fps || 60;
			this.chars = option.chars || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '#', '$', '%', '&', ':', ';', '?', '@', '[', ']', '^', '_', '{', '|', '}', '~'];
			this.callback = typeof option.callback === 'function' ? option.callback : function () {};
			this.play();

			return this;
		}

		ScrambleText.prototype.play = function play() {

			if (this._running) return this;

			this._idling = true;
			this._running = true;
			this._position = 0;
			this.el.setAttribute(ATTR_IDLING, '');
			this.el.setAttribute(ATTR_RUNNING, '');
			this._anim();

			return this;
		};

		ScrambleText.prototype.start = function start() {

			this._idling = false;
			this._startTime = Date.now();
			this._elapsedTime = 0;
			this._position = 0;
			this.el.removeAttribute(ATTR_IDLING);

			return this;
		};

		ScrambleText.prototype.stop = function stop() {

			this._running = false;
			this.el.removeAttribute(ATTR_IDLING);
			this.el.removeAttribute(ATTR_RUNNING);

			return this;
		};

		return ScrambleText;
	}();

	function anim() {

		var elapsedTime = Date.now() - this._startTime;
		var deltaTime = elapsedTime - this._elapsedTime;
		var needsUpdate = 1000 / this.fps <= deltaTime;

		if (!needsUpdate) {

			requestAnimationFrame(this._anim);
			return;
		}

		this._elapsedTime = elapsedTime;
		this._position = this._idling ? 0 : this._elapsedTime / this.timeOffset | 0;

		if (!this._running) return;

		if (this._position >= this._contents.length) {

			this._running = false;
			this.el.innerHTML = this._contents.map(function (el) {
				return el.content;
			}).join('');
			this.el.removeAttribute('data-scramble-text-running');
			this.callback();
			return;
		}

		requestAnimationFrame(this._anim);

		var textArray = suffle(this._contents, this.chars, this._position);

		this.el.innerHTML = textArray.join('');
	}

	function suffle(contents, chars, position) {

		var textArray = [];

		for (var i = 0, l = contents.length; i < l; i++) {

			if (contents[i].type === 'tag') {

				textArray.push(contents[i].content);
				continue;
			}

			if (i < position) {

				textArray.push(contents[i].content);
				continue;
			}

			if (/\s/.test(contents[i].content)) {

				textArray.push(contents[i].content);
			}

			textArray.push(getRandCharacter(chars));
		}

		return textArray;
	}

	function getRandCharacter(chars) {

		var randNum = Math.floor(Math.random() * chars.length);
		var lowChoice = -.5 + Math.random();
		var picketCharacter = chars[randNum];
		var choosen = lowChoice < 0 ? picketCharacter.toLowerCase() : picketCharacter;
		return choosen;
	}

	function split(string) {

		var array = [];
		var tag = /^(\s*)?<\/?[a-z](.*?)>(\s*)?/i;
		var space = /^\s+/;

		string = string.replace(space, '').replace(/\s+$/, '');

		while (string.length !== 0) {

			var matchTag = string.match(tag);

			if (!!matchTag) {

				array.push({
					type: 'tag',
					content: matchTag[0].replace(/^(\s*)(.+)(\s*)$/, '$1$2$3')
				});
				string = string.replace(matchTag[0], '');
				continue;
			}

			var matchSpace = string.match(space);

			if (!!matchSpace) {

				array.push({
					type: 'space',
					content: ' '
				});
				string = string.replace(matchSpace[0], '');
				continue;
			}

			array.push({
				type: 'character',
				content: string[0]
			});
			string = string.slice(1);
		}

		return array;
	}

	return ScrambleText;

})));

function makeDraggable(evt) {
  var svg = evt.target;

  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);
  svg.addEventListener('touchstart', startDrag);
  svg.addEventListener('touchmove', drag);
  svg.addEventListener('touchend', endDrag);
  svg.addEventListener('touchleave', endDrag);
  svg.addEventListener('touchcancel', endDrag);

  function getMousePosition(evt) {
  var CTM = svg.getScreenCTM();
  if (evt.touches) { evt = evt.touches[0]; }
  return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
  };
  }

  var selectedElement, offset, transform;

  function initialiseDragging(evt) {
      offset = getMousePosition(evt);

      // Make sure the first transform on the element is a translate transform
      var transforms = selectedElement.transform.baseVal;

      if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      // Create an transform that translates by (0, 0)
      var translate = svg.createSVGTransform();
      translate.setTranslate(0, 0);
      selectedElement.transform.baseVal.insertItemBefore(translate, 0);
      }

      // Get initial translation
      transform = transforms.getItem(0);
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;
  }

  function startDrag(evt) {
  if (evt.target.classList.contains('draggable')) {
      selectedElement = evt.target;
      initialiseDragging(evt);
  } else if (evt.target.parentNode.classList.contains('draggable-group')) {
      selectedElement = evt.target.parentNode;
      initialiseDragging(evt);
  }
  }

  function drag(evt) {
  if (selectedElement) {
      evt.preventDefault();
      var coord = getMousePosition(evt);
      transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
  }
  }

  function endDrag(evt) {
  selectedElement = false;
  }
}