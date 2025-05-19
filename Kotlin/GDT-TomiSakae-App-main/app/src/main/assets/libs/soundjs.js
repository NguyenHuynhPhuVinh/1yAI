/*
* EventDispatcher
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

// namespace:
this.createjs = this.createjs || {};

(function () {

	/**
	 * The EventDispatcher provides methods for managing prioritized queues of event listeners and dispatching events. All
	 * {{#crossLink "DisplayObject"}}{{/crossLink}} classes dispatch events, as well as some of the utilities like {{#crossLink "Ticker"}}{{/crossLink}}.
	 *
	 * You can either extend this class or mix its methods into an existing prototype or instance by using the
	 * EventDispatcher {{#crossLink "EventDispatcher/initialize"}}{{/crossLink}} method.
	 *
	 * <h4>Example</h4>
	 * Add EventDispatcher capabilities to the "MyClass" class.
	 *
	 *      EventDispatcher.initialize(MyClass.prototype);
	 *
	 * Add an event (see {{#crossLink "EventDispatcher/addEventListener"}}{{/crossLink}}).
	 *
	 *      instance.addEventListener("eventName", handlerMethod);
	 *      function handlerMethod(event) {
	 *          console.log(event.target + " Was Clicked");
	 *      }
	 *
	 * <b>Maintaining proper scope</b><br />
	 * When using EventDispatcher in a class, you may need to use <code>Function.bind</code> or another approach to
	 * maintain you method scope. Note that Function.bind is not supported in some older browsers.
	 *
	 *      instance.addEventListener("click", handleClick.bind(this));
	 *      function handleClick(event) {
	 *          console.log("Method called in scope: " + this);
	 *      }
	 *
	 * Please note that currently, EventDispatcher does not support event priority or bubbling. Future versions may add
	 * support for one or both of these features.
	 *
	 * @class EventDispatcher
	 * @constructor
	 **/
	var EventDispatcher = function () {
		this.initialize();
	};
	var p = EventDispatcher.prototype;


	/**
	 * Static initializer to mix in EventDispatcher methods.
	 * @method initialize
	 * @static
	 * @param {Object} target The target object to inject EventDispatcher methods into. This can be an instance or a
	 * prototype.
	 **/
	EventDispatcher.initialize = function (target) {
		target.addEventListener = p.addEventListener;
		target.removeEventListener = p.removeEventListener;
		target.removeAllEventListeners = p.removeAllEventListeners;
		target.hasEventListener = p.hasEventListener;
		target.dispatchEvent = p.dispatchEvent;
	};

	// private properties:
	/**
	 * @protected
	 * @property _listeners
	 * @type Object
	 **/
	p._listeners = null;

	// constructor:
	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function () { };

	// public methods:
	/**
	 * Adds the specified event listener.
	 * @method addEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
	 * the event is dispatched.
	 * @return {Function | Object} Returns the listener for chaining or assignment.
	 **/
	p.addEventListener = function (type, listener) {
		var listeners = this._listeners;
		if (!listeners) { listeners = this._listeners = {}; }
		else { this.removeEventListener(type, listener); }
		var arr = listeners[type];
		if (!arr) { arr = listeners[type] = []; }
		arr.push(listener);
		return listener;
	};

	/**
	 * Removes the specified event listener.
	 * @method removeEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener The listener function or object.
	 **/
	p.removeEventListener = function (type, listener) {
		var listeners = this._listeners;
		if (!listeners) { return; }
		var arr = listeners[type];
		if (!arr) { return; }
		for (var i = 0, l = arr.length; i < l; i++) {
			if (arr[i] == listener) {
				if (l == 1) { delete (listeners[type]); } // allows for faster checks.
				else { arr.splice(i, 1); }
				break;
			}
		}
	};

	/**
	 * Removes all listeners for the specified type, or all listeners of all types.
	 * @method removeAllEventListeners
	 * @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
	 **/
	p.removeAllEventListeners = function (type) {
		if (!type) { this._listeners = null; }
		else if (this._listeners) { delete (this._listeners[type]); }
	};

	/**
	 * Dispatches the specified event.
	 * @method dispatchEvent
	 * @param {Object | String} eventObj An object with a "type" property, or a string type. If a string is used,
	 * dispatchEvent will contstruct a generic event object with "type" and "params" properties.
	 * @param {Object} [target] The object to use as the target property of the event object. This will default to the
	 * dispatching object.
	 * @return {Boolean} Returns true if any listener returned true.
	 **/
	p.dispatchEvent = function (eventObj, target) {
		var ret = false, listeners = this._listeners;
		if (eventObj && listeners) {
			if (typeof eventObj == "string") { eventObj = { type: eventObj }; }
			eventObj.target = target || this;
			var arr = listeners[eventObj.type];
			if (!arr) { return ret; }
			arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
			for (var i = 0, l = arr.length; i < l; i++) {
				var o = arr[i];
				if (o instanceof Function) { ret = ret || o.apply(null, [eventObj]); }
				else if (o.handleEvent) { ret = ret || o.handleEvent(eventObj); }
			}
		}
		return !!ret;
	};

	/**
	 * Indicates whether there is at least one listener for the specified event type.
	 * @method hasEventListener
	 * @param {String} type The string type of the event.
	 * @return {Boolean} Returns true if there is at least one listener for the specified event.
	 **/
	p.hasEventListener = function (type) {
		var listeners = this._listeners;
		return !!(listeners && listeners[type]);
	};

	/**
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function () {
		return "[EventDispatcher]";
	};


	createjs.EventDispatcher = EventDispatcher;
}());

/*
 * Sound
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 *
 * Copyright (c) 2012 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */


// namespace:
this.createjs = this.createjs || {};

/**
 * The SoundJS library manages the playback of audio on the web. It works via plugins which abstract the actual audio
 * implementation, so playback is possible on any platform without specific knowledge of what mechanisms are necessary
 * to play sounds.
 *
 * To use SoundJS, use the public API on the {{#crossLink "Sound"}}{{/crossLink}} class. This API is for:
 * <ul><li>Installing Plugins</li>
 *      <li>Registering (and preloading) sounds</li>
 *      <li>Playing sounds</li>
 *      <li>Controlling all sounds volume, mute, and stopping everything</li>
 * </ul>
 *
 * <b>Please note that as of version 0.4.0, the "SoundJS" object only provides version information. All APIs from
 * SoundJS are now available on the {{#crossLink "Sound"}}{{/crossLink}} class.</b>
 *
 * <b>Controlling Sounds</b><br />
 * Playing sounds creates {{#crossLink "SoundInstance"}}{{/crossLink}} instances, which can be controlled individually.
 * <ul><li>Pause, resume, and stop sounds</li>
 *      <li>Control a sound's volume, mute, and pan</li>
 *      <li>Add events to sound instances to get notified when they finish, loop, or fail</li>
 * </ul>
 *
 * <h4>Feature Set Example</h4>
 *      createjs.Sound.addEventListener("loadComplete", createjs.proxy(this.loadHandler, this));
 *      createjs.Sound.registerSound("path/to/mySound.mp3|path/to/mySound.ogg", "sound");
 *      function loadHandler(event) {
 *          // This is fired for each sound that is registered.
 *          var instance = createjs.Sound.play("sound");  // play using id.  Could also use source.
 *          instance.addEventListener("playComplete", createjs.proxy(this.handleComplete, this));
 *          instance.setVolume(0.5);
 *      }
 *
 * @module SoundJS
 * @main SoundJS
 */

(function () {

	//TODO: Interface to validate plugins and throw warnings
	//TODO: Determine if methods exist on a plugin before calling  // OJR this is only an issue if something breaks or user changes something
	//TODO: Interface to validate instances and throw warnings
	//TODO: Surface errors on audio from all plugins
	//TODO: Timeouts  // OJR for?
	/**
	 * The Sound class is the public API for creating sounds, controlling the overall sound levels, and managing plugins.
	 * All Sound APIs on this class are static.
	 *
	 * <b>Registering and Preloading</b><br />
	 * Before you can play a sound, it <b>must</b> be registered. You can do this with {{#crossLink "Sound/registerSound"}}{{/crossLink}},
	 * or register multiple sounds using {{#crossLink "Sound/registerManifest"}}{{/crossLink}}. If you don't register
	 * them immediately, they will be automatically registered if you try and play a sound using {{#crossLink "Sound/play"}}{{/crossLink}},
	 * or if you create a stopped sound using {{#crossLink "Sound/createInstance"}}{{/crossLink}}. If you use
	 * <a href="http://preloadjs.com" target="_blank">PreloadJS</a>, this is handled for you when the sound is
	 * preloaded. It is recommended to preload sounds internally using the register functions or externally using
	 * PreloadJS so they are ready when you want to use them.
	 *
	 * <b>Playback</b><br />
	 * To play a sound once its been registered and preloaded, use the {{#crossLink "Sound/play"}}{{/crossLink}} method.
	 * This method returns a {{#crossLink "SoundInstance"}}{{/crossLink}} which can be paused, resumed, muted, etc.
	 * Please see the {{#crossLink "SoundInstance"}}{{/crossLink}} documentation for more on the instance control APIs.
	 *
	 * <b>Plugins</b><br />
	 * By default, the {{#crossLink "WebAudioPlugin"}}{{/crossLink}} or the {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}
	 * are used (when available), although developers can change plugin priority or add new plugins (such as the
	 * provided {{#crossLink "FlashPlugin"}}{{/crossLink}}). Please see the {{#crossLink "Sound"}}{{/crossLink}} API
	 * methods for more on the playback and plugin APIs. To install plugins, or specify a different plugin order, see
	 * {{#crossLink "Sound/installPlugins"}}{{/crossLink}}.
	 *
	 * <h4>Example</h4>
	 *      createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashPlugin]);
	 *      createjs.Sound.addEventListener("loadComplete", createjs.proxy(this.loadHandler, (this));
	 *      createjs.Sound.registerSound("path/to/mySound.mp3|path/to/mySound.ogg", "sound");
	 *      function loadHandler(event) {
     *          // This is fired for each sound that is registered.
     *          var instance = createjs.Sound.play("sound");  // play using id.  Could also use source.
     *          instance.addEventListener("playComplete", createjs.proxy(this.handleComplete, this));
     *          instance.setVolume(0.5);
	 *      }
	 *
	 * The maximum number of concurrently playing instances of the same sound can be specified in the "data" argument
	 * of {{#crossLink "Sound/registerSound"}}{{/crossLink}}.
	 *
	 *      createjs.Sound.registerSound("sound.mp3", "soundId", 4);
	 *
	 * Sound can be used as a plugin with PreloadJS to help preload audio properly. Audio preloaded with PreloadJS is
	 * automatically registered with the Sound class. When audio is not preloaded, Sound will do an automatic internal
	 * preload, and as a result, it may not play immediately the first time play is called. Use the
	 * {{#crossLink "Sound/loadComplete"}}{{/crossLink}} event to determine when a sound has finished internally preloading.
	 * It is recommended that all audio is preloaded before it is played.
	 *
	 *      createjs.PreloadJS.installPlugin(createjs.Sound);
	 *
	 * <h4>Known Browser and OS issues</h4>
	 * <b>IE 9 html audio quirk</b><br />
	 * Note in IE 9 there is a delay in applying volume changes to tags that occurs once playback is started. So if you have
	 * muted all sounds, they will all play during this delay until the mute applies internally. This happens regardless of
	 * when or how you apply the volume change, as the tag seems to need to play to apply it.
	 *
	 * <b>iOS 6 limitations</b><br />
	 * <ul><li>Sound is initially muted and will only unmute through play being called inside a user initiated event (touch).</li>
	 *      <li>Despite suggestions to the opposite, we have control over audio volume through our gain nodes.</li></ul>
	 * More details: http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api
	 *
	 * <b>Android limitations</b><br />
	 * <ul><li>Android chrome reports true when you run createjs.Sound.BrowserDetect.isChrome, but is a different browser
	 *      with different abilities</li>
	 *      <li>We have no control over audio volume. Only the user can set volume on their device.</li>
	 *      <li>We can only play audio inside a user event (touch).  This currently means you cannot loop sound.</li></ul>
	 *
	 * @class Sound
	 * @static
	 * @uses EventDispatcher
	 */
	function Sound() {
		throw "Sound cannot be instantiated";
	}

	var s = Sound;

	/**
	 * The character (or characters) that are used to split multiple paths from an audio source.
	 * @property DELIMITER
	 * @type {String}
	 * @default |
	 * @static
	 */
	s.DELIMITER = "|";

	/**
	 * The duration in milliseconds to determine a timeout.
	 * @property AUDIO_TIMEOUT
	 * @static
	 * @type {Number}
	 * @default 8000
	 */
	s.AUDIO_TIMEOUT = 8000; // TODO: This is not implemeneted  // OJR remove property?

	/**
	 * The interrupt value to interrupt any currently playing instance with the same source, if the maximum number of
	 * instances of the sound are already playing.
	 * @property INTERRUPT_ANY
	 * @type {String}
	 * @default any
	 * @static
	 */
	s.INTERRUPT_ANY = "any";

	/**
	 * The interrupt value to interrupt the earliest currently playing instance with the same source that progressed the
	 * least distance in the audio track, if the maximum number of instances of the sound are already playing.
	 * @property INTERRUPT_EARLY
	 * @type {String}
	 * @default early
	 * @static
	 */
	s.INTERRUPT_EARLY = "early";

	/**
	 * The interrupt value to interrupt the currently playing instance with the same source that progressed the most
	 * distance in the audio track, if the maximum number of instances of the sound are already playing.
	 * @property INTERRUPT_LATE
	 * @type {String}
	 * @default late
	 * @static
	 */
	s.INTERRUPT_LATE = "late";

	/**
	 * The interrupt value to interrupt no currently playing instances with the same source, if the maximum number of
	 * instances of the sound are already playing.
	 * @property INTERRUPT_NONE
	 * @type {String}
	 * @default none
	 * @static
	 */
	s.INTERRUPT_NONE = "none";

	// The playState in plugins should be implemented with these values.
	/**
	 * Defines the playState of an instance that is still initializing.
	 * @property PLAY_INITED
	 * @type {String}
	 * @default playInited
	 * @static
	 */
	s.PLAY_INITED = "playInited";

	/**
	 * Defines the playState of an instance that is currently playing or paused.
	 * @property PLAY_SUCCEEDED
	 * @type {String}
	 * @default playSucceeded
	 * @static
	 */
	s.PLAY_SUCCEEDED = "playSucceeded";

	/**
	 * Defines the playState of an instance that was interrupted by another instance.
	 * @property PLAY_INTERRUPTED
	 * @type {String}
	 * @default playInterrupted
	 * @static
	 */
	s.PLAY_INTERRUPTED = "playInterrupted";

	/**
	 * Defines the playState of an instance that completed playback.
	 * @property PLAY_FINISHED
	 * @type {String}
	 * @default playFinished
	 * @static
	 */
	s.PLAY_FINISHED = "playFinished";

	/**
	 * Defines the playState of an instance that failed to play. This is usually caused by a lack of available channels
	 * when the interrupt mode was "INTERRUPT_NONE", the playback stalled, or the sound could not be found.
	 * @property PLAY_FAILED
	 * @type {String}
	 * @default playFailed
	 * @static
	 */
	s.PLAY_FAILED = "playFailed";

	/**
	 * A list of the default supported extensions that Sound will <i>try</i> to play. Plugins will check if the browser
	 * can play these types, so modifying this list before a plugin is initialized will allow the plugins to try and
	 * support additional media types.
	 *
	 * NOTE this does not currently work for {{#crossLink "FlashPlugin"}}{{/crossLink}}.
	 *
	 * More details on file formats can be found at http://en.wikipedia.org/wiki/Audio_file_format. A very detailed
	 * list of file formats can be found //http://www.fileinfo.com/filetypes/audio. A useful list of extensions for a
	 * format can be found at http://html5doctor.com/html5-audio-the-state-of-play/
	 * @property SUPPORTED_EXTENSIONS
	 * @type {Array[String]}
	 * @default ["mp3", "ogg", "mpeg", "wav", "m4a", "mp4", "aiff", "wma", "mid"]
	 */
	s.SUPPORTED_EXTENSIONS = ["mp3", "ogg", "mpeg", "wav", "m4a", "mp4", "aiff", "wma", "mid"];  // OJR does not currently support FlashPlugin

	/**
	 * Some extensions use another type of extension support to play (one of them is a codex).  This allows you to map
	 * that support so plugins can accurately determine if an extension is supported.  Adding to this list can help
	 * plugins determine more accurately if an extension is supported.
	 * @property EXTENSION_MAP
	 * @type {Object}
	 * @since 0.4.0
	 */
	s.EXTENSION_MAP = {
		m4a: "mp4"
	};

	/**
	 * The RegExp pattern to use to parse file URIs. This supports simple file names, as well as full domain URIs with
	 * query strings. The resulting match is: protocol:$1 domain:$2 path:$3 file:$4 extension:$5 query string:$6.
	 * @property FILE_PATTERN
	 * @type {RegExp}
	 * @static
	 * @private
	 */
	s.FILE_PATTERN = /(\w+:\/{2})?((?:\w+\.){2}\w+)?(\/?[\S]+\/|\/)?([\w\-%\.]+)(?:\.)(\w+)?(\?\S+)?/i;

	/**
	 * Determines the default behavior for interrupting other currently playing instances with the same source, if the
	 * maximum number of instances of the sound are already playing.  Currently the default is <code>Sound.INTERRUPT_NONE</code>
	 * but this can be set and will change playback behavior accordingly.  This is only used if {{#crossLink "Sound/play"}}{{/crossLink}}
	 * is called without passing a value for interrupt.
	 * @property defaultInterruptBehavior
	 * @type {String}
	 * @default none
	 * @static
	 * @since 0.4.0
	 */
	s.defaultInterruptBehavior = s.INTERRUPT_NONE;  // OJR does s.INTERRUPT_ANY make more sense as default?  Needs game dev testing to see which case makes more sense.

	/**
	 * Used internally to assign unique IDs to each SoundInstance
	 * @property lastID
	 * @type {Number}
	 * @static
	 * @private
	 */
	s.lastId = 0,

	/**
	 * The currently active plugin. If this is null, then no plugin could be initialized. If no plugin was specified,
	 * Sound attempts to apply the default plugins: {{#crossLink "WebAudioPlugin"}}{{/crossLink}}, followed by
	 * {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}.
	 * @property activePlugin
	 * @type {Object}
	 * @static
	 */
			s.activePlugin = null;

	/**
	 * Determines if the plugins have been registered. If false, the first call to play() will instantiate the default
	 * plugins ({{#crossLink "WebAudioPlugin"}}{{/crossLink}}, followed by {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}).
	 * If plugins have been registered, but none are applicable, then sound playback will fail.
	 * @property pluginsRegistered
	 * @type {Boolean}
	 * @default false
	 * @static
	 * @private
	 */
	s.pluginsRegistered = false;

	/**
	 * The master volume value. Use {{#crossLink "Sound/getVolume"}}{{/crossLink}} and {{#crossLink "Sound/setVolume"}}{{/crossLink}}
	 * to modify the volume of all audio.
	 * @property masterVolume
	 * @type {Number}
	 * @default 1
	 * @private
	 * @since 0.4.0
	 */
	s.masterVolume = 1;

	/**
	 * The master mute value for Sound.  This is applies to all sound instances.  This value can be set through
	 * {{#crossLink "Sound/setMute"}}{{/crossLink}} and accessed via {{#crossLink "Sound/getMute"}}{{/crossLink}}.
	 * @property masterMute
	 * @type {Boolean}
	 * @default false
	 * @private
	 * @static
	 * @since 0.4.0
	 */
	s.masterMute = false;

	/**
	 * An array containing all currently playing instances. This helps Sound control the volume, mute, and playback of
	 * all instances when using static APIs like {{#crossLink "Sound/stop"}}{{/crossLink}} and {{#crossLink "Sound/setVolume"}}{{/crossLink}}.
	 * When an instance has finished playback, it gets removed via the {{#crossLink "Sound/finishedPlaying"}}{{/crossLink}}
	 * method. If the user replays an instance, it gets added back in via the {{#crossLink "Sound/beginPlaying"}}{{/crossLink}}
	 * method.
	 * @property instances
	 * @type {Array}
	 * @private
	 * @static
	 */
	s.instances = [];

	/**
	 * A hash lookup of sound sources via the corresponding ID.
	 * @property idHash
	 * @type {Object}
	 * @private
	 * @static
	 */
	s.idHash = {};

	/**
	 * A hash lookup of preloading sound sources via the parsed source that is passed to the plugin.  Contains the
	 * source, id, and data that was passed in by the user.  Parsed sources can contain multiple instances of source, id,
	 * and data.
	 * @property preloadHash
	 * @type {Object}
	 * @private
	 * @static
	 */
	s.preloadHash = {};

	/**
	 * An object that stands in for audio that fails to play. This allows developers to continue to call methods
	 * on the failed instance without having to check if it is valid first. The instance is instantiated once, and
	 * shared to keep the memory footprint down.
	 * @property defaultSoundInstance
	 * @type {Object}
	 * @protected
	 * @static
	 */
	s.defaultSoundInstance = null;

	// mix-ins:
	// EventDispatcher methods:
	s.addEventListener = null;
	s.removeEventListener = null;
	s.removeAllEventListeners = null;
	s.dispatchEvent = null;
	s.hasEventListener = null;
	s._listeners = null;

	createjs.EventDispatcher.initialize(s); // inject EventDispatcher methods.


	// Events
	/**
	 * This event that is fired when a file finishes loading internally. This event is fired for each loaded sound,
	 * so any handler methods should look up the <code>event.src</code> to handle a particular sound.
	 * @event loadComplete
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {String} src The source of the sound that was loaded. Note this will only return the loaded part of a
	 * delimiter-separated source.
	 * @param {String} [id] The id passed in when the sound was registered. If one was not provided, it will be null.
	 * @param {Number|Object} [data] Any additional data associated with the item. If not provided, it will be undefined.
	 * @since 0.4.0
	 */

	// Callbacks
	/**
	 * The callback that is fired when a file finishes loading internally.
	 * @property onLoadComplete
	 * @type {Function}
	 * @deprecated In favour of the "loadComplete" event. Will be removed in a future version.
	 * @since 0.4.0
	 */
	s.onLoadComplete = null;

	/**
	 * @method sendLoadComplete
	 * @param {String} src A sound file has completed loading, and should be dispatched.
	 * @private
	 * @static
	 * @since 0.4.0
	 */
	s.sendLoadComplete = function (src) {
		if (!s.preloadHash[src]) {
			return;
		}
		for (var i = 0, l = s.preloadHash[src].length; i < l; i++) {
			var item = s.preloadHash[src][i];
			var event = {
				target: this,
				type: "loadComplete",
				src: item.src, // OJR LM thinks this might be more consistent if it returned item like PreloadJS
				id: item.id,
				data: item.data
			};
			s.preloadHash[src][i] = true;
			s.onLoadComplete && s.onLoadComplete(event);
			s.dispatchEvent(event);
		}
	}

	/**
	 * Get the preload rules to allow Sound to be used as a plugin by <a href="http://preloadjs.com" target="_blank">PreloadJS</a>.
	 * Any load calls that have the matching type or extension will fire the callback method, and use the resulting
	 * object, which is potentially modified by Sound. This helps when determining the correct path, as well as
	 * registering the audio instance(s) with Sound. This method should not be called, except by PreloadJS.
	 * @method getPreloadHandlers
	 * @return {Object} An object containing:
	 * <ul><li>callback: A preload callback that is fired when a file is added to PreloadJS, which provides
	 *      Sound a mechanism to modify the load parameters, select the correct file format, register the sound, etc.</li>
	 *      <li>types: A list of file types that are supported by Sound (currently supports "sound").</li>
	 *      <li>extensions A list of file extensions that are supported by Sound (see Sound.SUPPORTED_EXTENSIONS).</li></ul>
	 * @static
	 * @protected
	 */
	s.getPreloadHandlers = function () {
		return {
			callback: createjs.proxy(s.initLoad, s),
			types: ["sound"],
			extensions: s.SUPPORTED_EXTENSIONS
		};
	}

	/**
	 * Register a Sound plugin. Plugins handle the actual playback of audio. The default plugins are
	 * ({{#crossLink "WebAudioPlugin"}}{{/crossLink}} followed by the {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}),
	 * and are installed if no other plugins are present when the user starts playback.
	 * <h4>Example</h4>
	 *      createjs.FlashPlugin.BASE_PATH = "../src/SoundJS/";
	 *      createjs.Sound.registerPlugin(createjs.FlashPlugin);
	 *
	 * To register multiple plugins, use {{#crossLink "Sound/registerPlugins"}}{{/crossLink}}.
	 *
	 * @method registerPlugin
	 * @param {Object} plugin The plugin class to install.
	 * @return {Boolean} Whether the plugin was successfully initialized.
	 * @static
	 */
	s.registerPlugin = function (plugin) {
		s.pluginsRegistered = true;
		if (plugin == null) {
			return false;
		}
		// Note: Each plugin is passed in as a class reference, but we store the activePlugin as an instance
		if (plugin.isSupported()) {
			s.activePlugin = new plugin();
			//TODO: Check error on initialization
			return true;
		}
		return false;
	}

	/**
	 * Register a list of Sound plugins, in order of precedence. To register a single plugin, use
	 * {{#crossLink "Sound/registerPlugin"}}{{/crossLink}}.
	 *
	 * <h4>Example</h4>
	 *      createjs.FlashPlugin.BASE_PATH = "../src/SoundJS/";
	 *      createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashPlugin]);
	 *
	 * @method registerPlugins
	 * @param {Array} plugins An array of plugins classes to install.
	 * @return {Boolean} Whether a plugin was successfully initialized.
	 * @static
	 */
	s.registerPlugins = function (plugins) {
		for (var i = 0, l = plugins.length; i < l; i++) {
			var plugin = plugins[i];
			if (s.registerPlugin(plugin)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Initialize the default plugins. This method is called when any audio is played before the user has registered
	 * any plugins, and enables Sound to work without manual plugin setup. Currently, the default plugins are
	 * {{#crossLink "WebAudioPlugin"}}{{/crossLink}} followed by {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}}.
	 * @method initializeDefaultPlugins
	 * @returns {Boolean} If a plugin is initialized (true) or not (false). If the browser does not have the
	 * capabilities to initialize any available plugins, this will return false.
	 * @private
	 * @since 0.4.0
	 */
	s.initializeDefaultPlugins = function () {
		if (s.activePlugin != null) {
			return true;
		}
		if (s.pluginsRegistered) {
			return false;
		}
		if (s.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin])) {
			return true;
		}
		return false;
	}

	/**
	 * Determines if Sound has been initialized, and a plugin has been activated.
	 * @method isReady
	 * @return {Boolean} If Sound has initialized a plugin.
	 * @static
	 */
	s.isReady = function () {
		return (s.activePlugin != null);
	}

	/**
	 * Get the active plugins capabilities, which help determine if a plugin can be used in the current environment,
	 * or if the plugin supports a specific feature. Capabilities include:
	 * <ul>
	 *     <li><b>panning:</b> If the plugin can pan audio from left to right</li>
	 *     <li><b>volume;</b> If the plugin can control audio volume.</li>
	 *     <li><b>mp3:</b> If MP3 audio is supported.</li>
	 *     <li><b>ogg:</b> If OGG audio is supported.</li>
	 *     <li><b>wav:</b> If WAV audio is supported.</li>
	 *     <li><b>mpeg:</b> If MPEG audio is supported.</li>
	 *     <li><b>m4a:</b> If M4A audio is supported.</li>
	 *     <li><b>mp4:</b> If MP4 audio is supported.</li>
	 *     <li><b>aiff:</b> If aiff audio is supported.</li>
	 *     <li><b>wma:</b> If wma audio is supported.</li>
	 *     <li><b>mid:</b> If mid audio is supported.</li>
	 *     <li><b>tracks:</b> The maximum number of audio tracks that can be played back at a time. This will be -1
	 *     if there is no known limit.</li>
	 * @method getCapabilities
	 * @return {Object} An object containing the capabilities of the active plugin.
	 * @static
	 */
	s.getCapabilities = function () {
		if (s.activePlugin == null) {
			return null;
		}
		return s.activePlugin.capabilities;
	}

	/**
	 * Get a specific capability of the active plugin. See {{#crossLink "Sound/getCapabilities"}}{{/crossLink}} for a
	 * full list of capabilities.
	 * @method getCapability
	 * @param {String} key The capability to retrieve
	 * @return {Number|Boolean} The value of the capability.
	 * @static
	 * @see getCapabilities
	 */
	s.getCapability = function (key) {
		if (s.activePlugin == null) {
			return null;
		}
		return s.activePlugin.capabilities[key];
	}

	/**
	 * Process manifest items from <a href="http://preloadjs.com" target="_blank">PreloadJS</a>. This method is intended
	 * for usage by a plugin, and not for direct interaction.
	 * @method initLoad
	 * @param {String | Object} src The src or object to load. This is usually a string path, but can also be an
	 * HTMLAudioElement or similar audio playback object.
	 * @param {String} [type] The type of object. Will likely be "sound" or null.
	 * @param {String} [id] An optional user-specified id that is used to play sounds.
	 * @param {Number|String|Boolean|Object} [data] Data associated with the item. Sound uses the data parameter as the
	 * number of channels for an audio instance, however a "channels" property can be appended to the data object if
	 * this property is used for other information. The audio channels will default to 1 if no value is found.
	 * @return {Boolean|Object} An object with the modified values of those that were passed in, or false if the active
	 * plugin can not play the audio type.
	 * @protected
	 * @static
	 */
	s.initLoad = function (src, type, id, data) {
		var details = s.registerSound(src, id, data, false);
		if (details == null) {
			return false;
		}
		return details;
	}

	/**
	 * Register a sound to playback in Sound. This is automatically called when using <a href="http://preloadjs.com" target="_blank">PreloadJS</a>,
	 * however if you just wish to register a sound manually, this method will handle it. It is recommended to
	 * register all sounds that need to be played back in order to properly prepare and preload them. Sound does
	 * internal preloading when required.
	 *
	 * <h4>Example</h4>
	 *      createjs.Sound.registerSound("myAudioPath/mySound.mp3|myAudioPath/mySound.ogg", "myID", 3);
	 *
	 * @method registerSound
	 * @param {String | Object} src The source or an Objects with a "src" property
	 * @param {String} [id] An id specified by the user to play the sound later.
	 * @param {Number | Object} [data] Data associated with the item. Sound uses the data parameter as the number of
	 * channels for an audio instance, however a "channels" property can be appended to the data object if it is used
	 * for other information. The audio channels will set a default based on plugin if no value is found.
	 * @param {Boolean} [preload=true] If the sound should be internally preloaded so that it can be played back
	 * without an external preloader.
	 * @return {Object} An object with the modified values that were passed in, which defines the sound. Returns false
	 * if the source cannot be parsed.
	 * @static
	 * @since 0.4.0
	 */
	s.registerSound = function (src, id, data, preload) {
		if (!s.initializeDefaultPlugins()) {
			return false;
		}

		if (src instanceof Object) {
			src = src.src;
			id = src.id;
			data = src.data;
			//OJR also do? preload = src.preload;
		}
		var details = s.parsePath(src, "sound", id, data);
		if (details == null) {
			return false;
		}

		if (id != null) {
			s.idHash[id] = details.src;
		}

		var numChannels = null; // null will set all SoundChannel to set this to it's internal maxDefault
		if (data != null) {
			if (!isNaN(data.channels)) {
				numChannels = parseInt(data.channels);
			}
			else if (!isNaN(data)) {
				numChannels = parseInt(data);
			}
		}
		var loader = s.activePlugin.register(details.src, numChannels);  // Note only HTML audio uses numChannels

		if (loader != null) {
			if (loader.numChannels != null) {
				numChannels = loader.numChannels;
			} // currently only HTMLAudio returns this
			SoundChannel.create(details.src, numChannels);

			// return the number of instances to the user.  This will also be returned in the load event.
			if (data == null || !isNaN(data)) {
				data = details.data = numChannels || SoundChannel.maxPerChannel();
			} else {
				data.channels = details.data.channels = numChannels || SoundChannel.maxPerChannel();
			}

			// If the loader returns a tag, return it instead for preloading.
			if (loader.tag != null) {
				details.tag = loader.tag;
			}
			else if (loader.src) {
				details.src = loader.src;
			}
			// If the loader returns a complete handler, pass it on to the prelaoder.
			if (loader.completeHandler != null) {
				details.completeHandler = loader.completeHandler;
			}
			details.type = loader.type;
		}

		if (preload != false) {
			if (!s.preloadHash[details.src]) {
				s.preloadHash[details.src] = [];
			}  // we do this so we can store multiple id's and data if needed
			s.preloadHash[details.src].push({ src: src, id: id, data: data });  // keep this data so we can return it onLoadComplete
			if (s.preloadHash[details.src].length == 1) {
				s.activePlugin.preload(details.src, loader)
			}
			;  // if already loaded once, don't load a second time  // OJR note this will disallow reloading a sound if loading fails or the source changes
		}

		return details;
	}

	/**
	 * Register a manifest of sounds to playback in Sound. It is recommended to register all sounds that need to be
	 * played back in order to properly prepare and preload them. Sound does internal preloading when required.
	 *
	 * <h4>Example</h4>
	 *      var manifest = [
	 *          {src:"assetPath/asset0.mp3|assetPath/asset0.ogg", id:"example"}, // Note the Sound.DELIMITER
	 *          {src:"assetPath/asset1.mp3|assetPath/asset1.ogg", id:"1", data:6},
	 *          {src:"assetPath/asset2.mp3", id:"works"}
	 *      ];
	 *      createjs.Sound.addEventListener("loadComplete", doneLoading); // call doneLoading when each sound loads
	 *      createjs.Sound.registerManifest(manifest);
	 *
	 *
	 * @method registerManifest
	 * @param {Array} manifest An array of objects to load. Objects are expected to be in the format needed for
	 * {{#crossLink "Sound/registerSound"}}{{/crossLink}}: <code>{src:srcURI, id:ID, data:Data, preload:UseInternalPreloader}</code>
	 * with "id", "data", and "preload" being optional.
	 * @return {Object} An array of objects with the modified values that were passed in, which defines each sound. It
	 * will return false for any values that the source cannot be parsed.
	 * @static
	 * @since 0.4.0
	 */
	s.registerManifest = function (manifest) {
		var returnValues = [];
		for (var i = 0, l = manifest.length; i < l; i++) {
			returnValues[i] = createjs.Sound.registerSound(manifest[i].src, manifest[i].id, manifest[i].data, manifest[i].preload)
		}
		return returnValues;
	}

	/**
	 * Check if a source has been loaded by internal preloaders. This is necessary to ensure that sounds that are
	 * not completed preloading will not kick off a new internal preload if they are played.
	 * @method loadComplete
	 * @param {String} src The src or id that is being loaded.
	 * @return {Boolean} If the src is already loaded.
	 * @since 0.4.0
	 */
	s.loadComplete = function (src) {
		var details = s.parsePath(src, "sound");
		if (details) {
			src = s.getSrcById(details.src);
		} else {
			src = s.getSrcById(src);
		}
		return (s.preloadHash[src][0] == true);  // src only loads once, so if it's true for the first it's true for all
	}

	/**
	 * Parse the path of a sound, usually from a manifest item. Manifest items support single file paths, as well as
	 * composite paths using <code>Sound.DELIMITER</code>, which defaults to "|". The first path supported by the
	 * current browser/plugin will be used.
	 * @method parsePath
	 * @param {String} value The path to an audio source.
	 * @param {String} [type] The type of path. This will typically be "sound" or null.
	 * @param {String} [id] The user-specified sound ID. This may be null, in which case the src will be used instead.
	 * @param {Number | String | Boolean | Object} [data] Arbitrary data appended to the sound, usually denoting the
	 * number of channels for the sound. This method doesn't currently do anything with the data property.
	 * @return {Object} A formatted object that can be registered with the <code>Sound.activePlugin</code> and returned
	 * to a preloader like <a href="http://preloadjs.com" target="_blank">PreloadJS</a>.
	 * @protected
	 */
	s.parsePath = function (value, type, id, data) {
		if (typeof (value) != "string") { value = value.toString(); }
		var sounds = value.split(s.DELIMITER);
		var ret = { type: type || "sound", id: id, data: data };
		var c = s.getCapabilities();
		for (var i = 0, l = sounds.length; i < l; i++) {
			var sound = sounds[i];

			var match = sound.match(s.FILE_PATTERN);
			if (match == null) {
				return false;
			}
			var name = match[4];
			var ext = match[5];

			if (c[ext] && s.SUPPORTED_EXTENSIONS.indexOf(ext) > -1) {
				ret.name = name;
				ret.src = sound;
				ret.extension = ext;
				return ret;
			}
		}
		return null;
	}


	/* ---------------
	 Static API.
	 --------------- */
	/**
	 * Play a sound and get a {{#crossLink "SoundInstance"}}{{/crossLink}} to control. If the sound fails to play, a
	 * SoundInstance will still be returned, and have a playState of <code>Sound.PLAY_FAILED</code>. Note that even on
	 * sounds with failed playback, you may still be able to call SoundInstance {{#crossLink "SoundInstance/play"}}{{/crossLink}},
	 * since the failure could be due to lack of available channels. If there is no available plugin,
	 * <code>Sound.defaultSoundInstance</code> will be returned, which will not play any audio, but will not generate
	 * errors.
	 *
	 * <h4>Example</h4>
	 *      createjs.Sound.registerSound("myAudioPath/mySound.mp3", "myID", 3);
	 *      // wait until load is complete
	 *      createjs.Sound.play("myID");
	 *      // alternately we could call the following
	 *      var myInstance = createjs.Sound.play("myAudioPath/mySound.mp3", createjs.Sound.INTERRUPT_ANY, 0, 0, -1, 1, 0);
	 *
	 * @method play
	 * @param {String} src The src or ID of the audio.
	 * @param {String} [interrupt="none"] How to interrupt other instances of audio. Values are defined as <code>INTERRUPT_TYPE</code>
	 * constants on the Sound class.
	 * @param {Number} [delay=0] The amount of time to delay the start of the audio in milliseconds.
	 * @param {Number} [offset=0] The point to start the audio in milliseconds.
	 * @param {Number} [loop=0] How many times the audio loops when it reaches the end of playback. The efault is 0 (no
	 * loops), and -1 can be used for infinite playback.
	 * @param {Number} [volume=1] The volume of the sound, between 0 and 1. Note that the master volume is applied
	 * against the individual volume.
	 * @param {Number} [pan=0] The left-right pan of the sound (if supported), between -1 (left) and 1 (right).
	 * @return {SoundInstance} A {{#crossLink "SoundInstance"}}{{/crossLink}} that can be controlled after it is created.
	 * @static
	 */
	s.play = function (src, interrupt, delay, offset, loop, volume, pan) {
		var instance = s.createInstance(src);

		var ok = s.playInstance(instance, interrupt, delay, offset, loop, volume, pan);
		if (!ok) {
			instance.playFailed();
		}
		return instance;
	}

	/**
	 * Creates a {{#crossLink "SoundInstance"}}{{/crossLink}} using the passed in src. If the src does not have a
	 * supported extension, a default SoundInstance will be returned that can be called safely but does nothing.
	 * @method createInstance
	 * @param {String} src The src of the audio.
	 * @return {SoundInstance} A {{#crossLink "SoundInstance"}}{{/crossLink}} that can be controlled after it is created.
	 * Unsupported extensions will return the default SoundInstance.
	 * @since 0.4.0
	 */
	s.createInstance = function (src) {
		//TODO this function appears to be causing a memory leak, and needs spike tested.
		// OJR it is not EventDispatcher.  It appears to be var instance = s.activePlugin.create(src);  HTML makes sense because of the tag pool.  web audio is crashing though.
		// in new SoundInstance
		if (!s.initializeDefaultPlugins()) {
			return s.defaultSoundInstance;
		}
		var details = s.parsePath(src, "sound");
		if (details) {
			src = s.getSrcById(details.src);
		} else {
			src = s.getSrcById(src);
		}

		var dot = src.lastIndexOf(".");
		var ext = src.slice(dot + 1);  // sound have format of "path+name . ext"
		if (dot != -1 && s.SUPPORTED_EXTENSIONS.indexOf(ext) > -1) {  // we have an ext and it is one of our supported,Note this does not mean the plugin supports it.  // OJR consider changing to check against activePlugin.capabilities[ext]
			// make sure that we have a sound channel (sound is registered or previously played)
			SoundChannel.create(src);

			var instance = s.activePlugin.create(src);
		} else var instance = Sound.defaultSoundInstance;  // the src is not supported, so give back a dummy instance.
		// This can happen if PreloadJS fails because the plugin does not support the ext, and was passed an id which
		// will not get added to the idHash.

		instance.uniqueId = s.lastId++;  // OJR moved this here so we can have multiple plugins active in theory

		return instance;
	}

	/**
	 * Set the master volume of Sound. The master volume is multiplied against each sound's individual volume.
	 * To set individual sound volume, use SoundInstance {{#crossLink "SoundInstance/setVolume"}}{{/crossLink}} instead.
	 * @method setVolume
	 * @param {Number} value The master volume value. The acceptable range is 0-1.
	 * @static
	 */
	s.setVolume = function (value) {
		if (Number(value) == null) {
			return false;
		}
		value = Math.max(0, Math.min(1, value));
		s.masterVolume = value;
		if (!this.activePlugin || !this.activePlugin.setVolume || !this.activePlugin.setVolume(value)) {
			var instances = this.instances;  // OJR does this impact garbage collection more than it helps performance?
			for (var i = 0, l = instances.length; i < l; i++) {
				instances[i].setMasterVolume(value);
			}
		}
	}

	/**
	 * Get the master volume of Sound. The master volume is multiplied against each sound's individual volume.
	 * To get individual sound volume, use SoundInstance {{#crossLink "SoundInstance/getVolume"}}{{/crossLink}} instead.
	 * @method getVolume
	 * @return {Number} The master volume, in a range of 0-1.
	 * @static
	 */
	s.getVolume = function (value) {
		return s.masterVolume;
	}

	/**
	 * Mute/Unmute all audio. Please see {{#crossLink "Sound/setMute"}}{{/crossLink}}.
	 * @method mute
	 * @param {Boolean} value Whether the audio should be muted or not.
	 * @static
	 * @deprecated This function has been deprecated. Please use setMute instead.
	 */
	s.mute = function (value) {
		this.masterMute = value;
		if (!this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(value)) {
			var instances = this.instances;
			for (var i = 0, l = instances.length; i < l; i++) {
				instances[i].setMasterMute(value);
			}
		}
	}

	/**
	 * Mute/Unmute all audio. Note that muted audio still plays at 0 volume. This global mute value is maintained
	 * separately and will override, but not change the mute property of individual instances. To mute an individual
	 * instance, use SoundInstance {{#crossLink "SoundInstance/setMute"}}{{/crossLink}} instead.
	 * @method setMute
	 * @param {Boolean} value Whether the audio should be muted or not.
	 * @return {Boolean} If the mute was set.
	 * @static
	 * @since 0.4.0
	 */
	s.setMute = function (value) {
		if (value == null || value == undefined) {
			return false
		}
		;

		this.masterMute = value;
		if (!this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(value)) {
			var instances = this.instances;
			for (var i = 0, l = instances.length; i < l; i++) {
				instances[i].setMasterMute(value);
			}
		}
		return true;
	}

	/**
	 * Returns the global mute value. To get the mute value of an individual instance, use SoundInstance
	 * {{#crossLink "SoundInstance/getMute"}}{{/crossLink}} instead.
	 * @method getMute
	 * @return {Boolean} The mute value of Sound.
	 * @static
	 * @since 0.4.0
	 */
	s.getMute = function () {
		return this.masterMute;
	}

	/**
	 * Stop all audio (global stop). Stopped audio is reset, and not paused. To play back audio that has been stopped,
	 * call {{#crossLink "SoundInstance.play"}}{{/crossLink}}.
	 * @method stop
	 * @static
	 */
	s.stop = function () {
		var instances = this.instances;
		for (var i = instances.length; i > 0; i--) {
			instances[i - 1].stop();  // NOTE stop removes instance from this.instances
		}
	}


	/* ---------------
	 Internal methods
	 --------------- */
	/**
	 * Play an instance. This is called by the static API, as well as from plugins. This allows the core class to
	 * control delays.
	 * @method playInstance
	 * @param {SoundInstance} instance The {{#crossLink "SoundInstance"}}{{/crossLink}} to start playing.
	 * @param {String} [interrupt=none] How this sound interrupts other instances with the same source.  Defaults to
	 * <code>Sound.INTERRUPT_NONE</code>. All interrupt values are defined as <code>INTERRUPT_TYPE</code>constants on Sound.
	 * @param {Number} [delay=0] Time in milliseconds before playback begins.
	 * @param {Number} [offset=instance.offset] Time into the sound to begin playback in milliseconds.  Defaults to the
	 * current value on the instance.
	 * @param {Number} [loop=0] The number of times to loop the audio. Use 0 for no loops, and -1 for an infinite loop.
	 * @param {Number} [volume] The volume of the sound between 0 and 1. Defaults to current instance value.
	 * @param {Number} [pan] The pan of the sound between -1 and 1. Defaults to current instance value.
	 * @return {Boolean} If the sound can start playing. Sounds that fail immediately will return false. Sounds that
	 * have a delay will return true, but may still fail to play.
	 * @protected
	 * @static
	 */
	s.playInstance = function (instance, interrupt, delay, offset, loop, volume, pan) {
		interrupt = interrupt || s.defaultInterruptBehavior;
		if (delay == null) {
			delay = 0;
		}
		if (offset == null) {
			offset = instance.getPosition();
		}
		if (loop == null) {
			loop = 0;
		}
		if (volume == null) {
			volume = instance.getVolume();
		}
		if (pan == null) {
			pan = instance.getPan();
		}

		if (delay == 0) {
			var ok = s.beginPlaying(instance, interrupt, offset, loop, volume, pan);
			if (!ok) {
				return false;
			}
		} else {
			//Note that we can't pass arguments to proxy OR setTimeout (IE only), so just wrap the function call.
			var delayTimeoutId = setTimeout(function () {
				s.beginPlaying(instance, interrupt, offset, loop, volume, pan);
			}, delay);
			instance.delayTimeoutId = delayTimeoutId;
		}

		this.instances.push(instance);

		return true;
	}

	/**
	 * Begin playback. This is called immediately or after delay by {{#crossLink "Sound/playInstance"}}{{/crossLink}}.
	 * @method beginPlaying
	 * @param {SoundInstance} instance A {{#crossLink "SoundInstance"}}{{/crossLink}} to begin playback.
	 * @param {String} [interrupt=none] How this sound interrupts other instances with the same source. Defaults to
	 * <code>Sound.INTERRUPT_NONE</code>. Interrupts are defined as <code>INTERRUPT_TYPE</code> constants on Sound.
	 * @param {Number} [offset] Time in milliseconds into the sound to begin playback.  Defaults to the current value on
	 * the instance.
	 * @param {Number} [loop=0] The number of times to loop the audio. Use 0 for no loops, and -1 for an infinite loop.
	 * @param {Number} [volume] The volume of the sound between 0 and 1. Defaults to the current value on the instance.
	 * @param {Number} [pan=instance.pan] The pan of the sound between -1 and 1. Defaults to current instance value.
	 * @return {Boolean} If the sound can start playing. If there are no available channels, or the instance fails to
	 * start, this will return false.
	 * @protected
	 * @static
	 */
	s.beginPlaying = function (instance, interrupt, offset, loop, volume, pan) {
		if (!SoundChannel.add(instance, interrupt)) {
			return false;
		}
		var result = instance.beginPlaying(offset, loop, volume, pan);
		if (!result) {
			//LM: Should we remove this from the SoundChannel (see finishedPlaying)
			var index = this.instances.indexOf(instance);
			if (index > -1) {
				this.instances.splice(index, 1);
			}
			return false;
		}
		return true;
	}

	/**
	 * Get the source of a sound via the ID passed in with a register call. If no ID is found the value is returned
	 * instead.
	 * @method getSrcById
	 * @param {String} value The ID the sound was registered with.
	 * @return {String} The source of the sound.  Returns null if src has been registered with this id.
	 * @protected
	 * @static
	 */
	s.getSrcById = function (value) {
		if (s.idHash == null || s.idHash[value] == null) {
			return value;
		}
		return s.idHash[value];
	}

	/**
	 * A sound has completed playback, been interrupted, failed, or been stopped. This method removes the instance from
	 * Sound management. It will be added again, if the sound re-plays. Note that this method is called from the
	 * instances themselves.
	 * @method playFinished
	 * @param {SoundInstance} instance The instance that finished playback.
	 * @protected
	 * @static
	 */
	s.playFinished = function (instance) {
		SoundChannel.remove(instance);
		var index = this.instances.indexOf(instance);
		if (index > -1) {
			this.instances.splice(index, 1);
		}
	}

	/**
	 * A function proxy for Sound methods. By default, JavaScript methods do not maintain scope, so passing a
	 * method as a callback will result in the method getting called in the scope of the caller. Using a proxy
	 * ensures that the method gets called in the correct scope.
	 * @method proxy
	 * @param {Function} method The function to call
	 * @param {Object} scope The scope to call the method name on
	 * @protected
	 * @static
	 * @deprecated Deprecated in favor of createjs.proxy.
	 */
	s.proxy = function (method, scope) {
		return function () {
			return method.apply(scope, arguments);
		}
	}

	createjs.Sound = Sound;

	/**
	 * A function proxy for Sound methods. By default, JavaScript methods do not maintain scope, so passing a
	 * method as a callback will result in the method getting called in the scope of the caller. Using a proxy
	 * ensures that the method gets called in the correct scope.
	 * Note arguments can be passed that will be applied to the function when it is called.
	 *
	 * <h4>Example<h4>
	 *     myObject.myCallback = createjs.proxy(myHandler, this, arg1, arg2);
	 *
	 * #method proxy
	 * @param {Function} method The function to call
	 * @param {Object} scope The scope to call the method name on
	 * @param {mixed} [arg] * Arguments that are appended to the callback for additional params.
	 * @protected
	 * @static
	 */
	createjs.proxy = function (method, scope) {
		var aArgs = Array.prototype.slice.call(arguments, 2);
		return function () {
			return method.apply(scope, Array.prototype.slice.call(arguments, 0).concat(aArgs));
		};
	}


	/**
	 * An internal class that manages the number of active {{#crossLink "SoundInstance"}}{{/crossLink}} instances for
	 * each sound type. This method is only used internally by the {{#crossLink "Sound"}}{{/crossLink}} class.
	 *
	 * The number of sounds is artificially limited by Sound in order to prevent over-saturation of a
	 * single sound, as well as to stay within hardware limitations, although the latter may disappear with better
	 * browser support.
	 *
	 * When a sound is played, this class ensures that there is an available instance, or interrupts an appropriate
	 * sound that is already playing.
	 * #class SoundChannel
	 * @param {String} src The source of the instances
	 * @param {Number} [max=1] The number of instances allowed
	 * @constructor
	 * @protected
	 */
	function SoundChannel(src, max) {
		this.init(src, max);
	}

	/* ------------
	 Static API
	 ------------ */
	/**
	 * A hash of channel instances indexed by source.
	 * #property channels
	 * @type {Object}
	 * @static
	 */
	SoundChannel.channels = {};

	/**
	 * Create a sound channel. Note that if the sound channel already exists, this will fail.
	 * #method create
	 * @param {String} src The source for the channel
	 * @param {Number} max The maximum amount this channel holds. The default is {{#crossLink "SoundChannel.maxDefault"}}{{/crossLink}}.
	 * @return {Boolean} If the channels were created.
	 * @static
	 */
	SoundChannel.create = function (src, max) {
		var channel = SoundChannel.get(src);
		//if (max == null) { max = -1; }  // no longer need this check
		if (channel == null) {
			SoundChannel.channels[src] = new SoundChannel(src, max);
			return true;
		}
		return false;
	}
	/**
	 * Add an instance to a sound channel.
	 * #method add
	 * @param {SoundInstance} instance The instance to add to the channel
	 * @param {String} interrupt The interrupt value to use. Please see the {{#crossLink "Sound/play"}}{{/crossLink}}
	 * for details on interrupt modes.
	 * @return {Boolean} The success of the method call. If the channel is full, it will return false.
	 * @static
	 */
	SoundChannel.add = function (instance, interrupt) {
		var channel = SoundChannel.get(instance.src);
		if (channel == null) {
			return false;
		}
		return channel.add(instance, interrupt);
	}
	/**
	 * Remove an instance from the channel.
	 * #method remove
	 * @param {SoundInstance} instance The instance to remove from the channel
	 * @return The success of the method call. If there is no channel, it will return false.
	 * @static
	 */
	SoundChannel.remove = function (instance) {
		var channel = SoundChannel.get(instance.src);
		if (channel == null) {
			return false;
		}
		channel.remove(instance);
		return true;
	}
	/**
	 * Get the maximum number of sounds you can have in a channel.
	 * #method
	 * @return {Number} The maximum number of sounds you can have in a channel.
	 */
	SoundChannel.maxPerChannel = function () {
		return p.maxDefault;
	}
	/**
	 * Get a channel instance by its src.
	 * #method get
	 * @param {String} src The src to use to look up the channel
	 * @static
	 */
	SoundChannel.get = function (src) {
		return SoundChannel.channels[src];
	}

	var p = SoundChannel.prototype = {

		/**
		 * The source of the channel.
		 * #property src
		 * @type {String}
		 */
		src: null,

		/**
		 * The maximum number of instances in this channel.  -1 indicates no limit
		 * #property max
		 * @type {Number}
		 */
		max: null,

		/**
		 * The default value to set for max, if it isn't passed in.  Also used if -1 is passed.
		 * #property maxDefault
		 * @type {Number}
		 * @default 100
		 * @since 0.4.0
		 */
		maxDefault: 100,

		/**
		 * The current number of active instances.
		 * #property length
		 * @type {Number}
		 */
		length: 0,

		/**
		 * Initialize the channel.
		 * #method init
		 * @param {String} src The source of the channel
		 * @param {Number} max The maximum number of instances in the channel
		 * @protected
		 */
		init: function (src, max) {
			this.src = src;
			this.max = max || this.maxDefault;
			if (this.max == -1) {
				this.max == this.maxDefault;
			}
			this.instances = [];
		},

		/**
		 * Get an instance by index.
		 * #method get
		 * @param {Number} index The index to return.
		 * @return {SoundInstance} The SoundInstance at a specific instance.
		 */
		get: function (index) {
			return this.instances[index];
		},

		/**
		 * Add a new instance to the channel.
		 * #method add
		 * @param {SoundInstance} instance The instance to add.
		 * @return {Boolean} The success of the method call. If the channel is full, it will return false.
		 */
		add: function (instance, interrupt) {
			if (!this.getSlot(interrupt, instance)) {
				return false;
			}
			;
			this.instances.push(instance);
			this.length++;
			return true;
		},

		/**
		 * Remove an instance from the channel, either when it has finished playing, or it has been interrupted.
		 * #method remove
		 * @param {SoundInstance} instance The instance to remove
		 * @return {Boolean} The success of the remove call. If the instance is not found in this channel, it will
		 * return false.
		 */
		remove: function (instance) {
			var index = this.instances.indexOf(instance);
			if (index == -1) {
				return false;
			}
			this.instances.splice(index, 1);
			this.length--;
			return true;
		},

		/**
		 * Get an available slot depending on interrupt value and if slots are available.
		 * #method getSlot
		 * @param {String} interrupt The interrupt value to use.
		 * @param {SoundInstance} instance The sound instance that will go in the channel if successful.
		 * @return {Boolean} Determines if there is an available slot. Depending on the interrupt mode, if there are no slots,
		 * an existing SoundInstance may be interrupted. If there are no slots, this method returns false.
		 */
		getSlot: function (interrupt, instance) {
			var target, replacement;

			for (var i = 0, l = this.max; i < l; i++) {
				target = this.get(i);

				// Available Space
				if (target == null) {
					return true;
				} else if (interrupt == Sound.INTERRUPT_NONE && target.playState != Sound.PLAY_FINISHED) {
					continue;
				}

				// First replacement candidate
				if (i == 0) {
					replacement = target;
					continue;
				}

				// Audio is complete or not playing
				if (target.playState == Sound.PLAY_FINISHED ||
						target == Sound.PLAY_INTERRUPTED ||
						target == Sound.PLAY_FAILED) {
					replacement = target;

					// Audio is a better candidate than the current target, according to playhead
				} else if (
						(interrupt == Sound.INTERRUPT_EARLY && target.getPosition() < replacement.getPosition()) ||
								(interrupt == Sound.INTERRUPT_LATE && target.getPosition() > replacement.getPosition())) {
					replacement = target;
				}
			}

			if (replacement != null) {
				replacement.interrupt();
				this.remove(replacement);
				return true;
			}
			return false;
		},

		toString: function () {
			return "[Sound SoundChannel]";
		}

	}

	// do not add SoundChannel to namespace


	// This is a dummy sound instance, which allows Sound to return something so developers don't need to check nulls.
	function SoundInstance() {
		this.isDefault = true;
		this.addEventListener = this.removeEventListener = this.removeAllEventListener = this.dispatchEvent = this.hasEventListener = this._listeners = this.interrupt = this.playFailed = this.pause = this.resume = this.play = this.beginPlaying = this.cleanUp = this.stop = this.setMasterVolume = this.setVolume = this.mute = this.setMute = this.getMute = this.setPan = this.getPosition = this.setPosition = function () {
			return false;
		};
		this.getVolume = this.getPan = this.getDuration = function () {
			return 0;
		}
		this.playState = Sound.PLAY_FAILED;
		this.toString = function () {
			return "[Sound Default Sound Instance]";
		}
	}

	Sound.defaultSoundInstance = new SoundInstance();


	/**
	 * An additional module to determine the current browser, version, operating system, and other environment
	 * variables. It is not publically documented.
	 * #class BrowserDetect
	 * @param {Boolean} isFirefox True if our browser is Firefox.
	 * @param {Boolean} isOpera True if our browser is opera.
	 * @param {Boolean} isChrome True if our browser is Chrome.  Note that Chrome for Android returns true, but is a
	 * completely different browser with different abilities.
	 * @param {Boolean} isIOS True if our browser is safari for iOS devices (iPad, iPhone, and iPad).
	 * @param {Boolean} isAndroid True if our browser is Android.
	 * @param {Boolean} isBlackberry True if our browser is Blackberry.
	 * @constructor
	 * @static
	 */
	function BrowserDetect() {
	}

	BrowserDetect.init = function () {
		var agent = navigator.userAgent;
		BrowserDetect.isFirefox = (agent.indexOf("Firefox") > -1);
		BrowserDetect.isOpera = (window.opera != null);
		BrowserDetect.isChrome = (agent.indexOf("Chrome") > -1);  // NOTE that Chrome on Android returns true but is a completely different browser with different abilities
		BrowserDetect.isIOS = agent.indexOf("iPod") > -1 || agent.indexOf("iPhone") > -1 || agent.indexOf("iPad") > -1;
		BrowserDetect.isAndroid = (agent.indexOf("Android") > -1);
		BrowserDetect.isBlackberry = (agent.indexOf("Blackberry") > -1);
	}

	BrowserDetect.init();

	createjs.Sound.BrowserDetect = BrowserDetect;


}());

/*
 * HTMLAudioPlugin for SoundJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 *
 * Copyright (c) 2012 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @module SoundJS
 */

// namespace:
this.createjs = this.createjs || {};

(function () {

	/**
	 * Play sounds using HTML &lt;audio&gt; tags in the browser. This plugin is the second priority plugin installed
	 * by default, after the {{#crossLink "WebAudioPlugin"}}{{/crossLink}}, which is supported on Chrome, Safari, and
	 * iOS. This handles audio in all other modern browsers. For non-supported browsers, include and install the
	 * {{#crossLink "FlashPlugin"}}{{/crossLink}}.
	 *
	 * <h4>Known Browser and OS issues for HTML Audio</h4>
	 * <b>All browsers</b><br />
	 * Testing has shown in all browsers there is a limit to how many audio tag instances you are allowed.  If you exceed
	 * this limit, you can expect to see unpredictable results.  This will be seen as soon as you register sounds, as
	 * tags are precreated to all Chrome to load them.  Please use {{#crossLink "Sound.MAX_INSTANCES"}}{{/crossLink}} as
	 * a guide to how many total audio tags you can safely use in all browsers.
	 *
	 * <b>IE 9 html audio quirk</b><br />
	 * Note in IE 9 there is a delay in applying volume changes to tags that occurs once playback is started. So if you have
	 * muted all sounds, they will all play during this delay until the mute applies internally. This happens regardless of
	 * when or how you apply the volume change, as the tag seems to need to play to apply it.
	 *
	 * <b>iOS 6 limitations</b><br />
	 * Note it is recommended to use {{#crossLink "WebAudioPlugin"}}{{/crossLink}} for iOS (6+). HTML Audio can only
	 * have one &lt;audio&gt; tag, can not preload or autoplay the audio, can not cache the audio, and can not play the
	 * audio except inside a user initiated event.
	 *
	 * <b>Android limitations</b><br />
	 *      <li>We have no control over audio volume. Only the user can set volume on their device.</li>
	 *      <li>We can only play audio inside a user event (touch).  This currently means you cannot loop sound.</li></ul>
	 *
	 * See {{#crossLink "Sound"}}{{/crossLink}} for general notes on known issues.
	 *
	 * @class HTMLAudioPlugin
	 * @constructor
	 */
	function HTMLAudioPlugin() {
		this.init();
	}

	var s = HTMLAudioPlugin;

	/**
	 * The maximum number of instances that can be played. This is a browser limitation. The actual number varies from
	 * browser to browser (and is largely hardware dependant), but this is a safe estimate.
	 * @property MAX_INSTANCES
	 * @type {Number}
	 * @default 30
	 * @static
	 */
	s.MAX_INSTANCES = 120;

	/**
	 * The capabilities of the plugin. This is generated via the the SoundInstance {{#crossLink "TMLAudioPlugin/generateCapabilities"}}{{/crossLink}}
	 * method. Please see the Sound {{#crossLink "Sound/getCapabilities"}}{{/crossLink}} method for an overview of all
	 * of the available properties.
	 * @property capabilities
	 * @type {Object}
	 * @static
	 */
	s.capabilities = null;

	/**
	 * Event constant for the "canPlayThrough" event for cleaner code.
	 * @property AUDIO_READY
	 * @type {String}
	 * @default canplaythrough
	 * @static
	 */
	s.AUDIO_READY = "canplaythrough";

	/**
	 * Event constant for the "ended" event for cleaner code.
	 * @property AUDIO_ENDED
	 * @type {String}
	 * @default ended
	 * @static
	 */
	s.AUDIO_ENDED = "ended";

	/**
	 * Event constant for the "error" event for cleaner code.
	 * @property AUDIO_ERROR
	 * @type {String}
	 * @default error
	 * @static
	 */
	s.AUDIO_ERROR = "error"; //TODO: Handle error cases

	/**
	 * Event constant for the "stalled" event for cleaner code.
	 * @property AUDIO_STALLED
	 * @type {String}
	 * @default stalled
	 * @static
	 */
	s.AUDIO_STALLED = "stalled";


	/**
	 * Determine if the plugin can be used in the current browser/OS. Note that HTML audio is available in most modern
	 * browsers except iOS, where it is limited.
	 * @method isSupported
	 * @return {Boolean} If the plugin can be initialized.
	 * @static
	 */
	s.isSupported = function () {
		if (createjs.Sound.BrowserDetect.isIOS) {
			return false;
		}
		// You can enable this plugin on iOS by removing this line, but it is not recommended due to the limitations:
		// iOS can only have a single <audio> instance, cannot preload or autoplay, cannot cache sound, and can only be
		// played in response to a user event (click)
		s.generateCapabilities();
		var t = s.tag;  // OJR do we still need this check, when cap will already be null if this is the case
		if (t == null || s.capabilities == null) {
			return false;
		}
		return true;
	};

	/**
	 * Determine the capabilities of the plugin. Used internally. Please see the Sound API {{#crossLink "Sound/getCapabilities"}}{{/crossLink}}
	 * method for an overview of plugin capabilities.
	 * @method generateCapabiities
	 * @static
	 * @protected
	 */
	s.generateCapabilities = function () {
		if (s.capabilities != null) {
			return;
		}
		var t = s.tag = document.createElement("audio");
		if (t.canPlayType == null) {
			return null;
		}

		s.capabilities = {
			panning:true,
			volume:true,
			tracks:-1
		};

		// determine which extensions our browser supports for this plugin by iterating through Sound.SUPPORTED_EXTENSIONS
		var supportedExtensions = createjs.Sound.SUPPORTED_EXTENSIONS;
		var extensionMap = createjs.Sound.EXTENSION_MAP;
		for (var i = 0, l = supportedExtensions.length; i < l; i++) {
			var ext = supportedExtensions[i];
			var playType = extensionMap[ext] || ext;
			s.capabilities[ext] = (t.canPlayType("audio/" + ext) != "no" && t.canPlayType("audio/" + ext) != "") || (t.canPlayType("audio/" + playType) != "no" && t.canPlayType("audio/" + playType) != "");
		}  // OJR another way to do this might be canPlayType:"m4a", codex: mp4
	}

	var p = s.prototype = {

		/**
		 * The capabilities of the plugin, created by the {{#crossLink "HTMLAudioPlugin/generateCapabilities"}}{{/crossLink}}
		 * method.
		 */
		capabilities:null,

		/**
		 * Object hash indexed by the source of each file to indicate if an audio source is loaded, or loading.
		 * @property audioSources
		 * @type {Object}
		 * @protected
		 * @since 0.4.0
		 */
		audioSources:null,

		/**
		 * The default number of instances to allow.  Passed back to {{#crossLink "Sound"}}{{/crossLink}} when a source
		 * is registered using the {{#crossLink "Sound/register"}}{{/crossLink}} method.  This is only used if
		 * a value is not provided.
		 *
		 * <b>NOTE this only exists as a limitation of HTML audio.</b>
		 * @property defaultNumChannels
		 * @type {Number}
		 * @default 2
		 * @since 0.4.0
		 */
		defaultNumChannels:2,

		/**
		 * An initialization function run by the constructor
		 * @method init
		 * @private
		 */
		init:function () {
			this.capabilities = s.capabilities;
			this.audioSources = {};
		},

		/**
		 * Pre-register a sound instance when preloading/setup. This is called by {{#crossLink "Sound"}}{{/crossLink}}.
		 * Note that this provides an object containing a tag used for preloading purposes, which
		 * <a href="http://preloadjs.com">PreloadJS</a> can use to assist with preloading.
		 * @method register
		 * @param {String} src The source of the audio
		 * @param {Number} instances The number of concurrently playing instances to allow for the channel at any time.
		 * @return {Object} A result object, containing a tag for preloading purposes and a numChannels value for internally
		 * controlling how many instances of a source can be played by default.
		 */
		register:function (src, instances) {
			this.audioSources[src] = true;  // Note this does not mean preloading has started
			var channel = TagPool.get(src);
			var tag = null;
			var l = instances || this.defaultNumChannels;
			for (var i = 0; i < l; i++) {  // OJR should we be enforcing s.MAX_INSTANCES here?  Does the chrome bug still exist, or can we change this code?
				tag = this.createTag(src);
				channel.add(tag);
			}
			return {
				tag:tag, // Return one instance for preloading purposes
				numChannels:l  // The default number of channels to make for this Sound or the passed in value
			};
		},

		/**
		 * Create an HTML audio tag.
		 * @method createTag
		 * @param {String} src The source file to set for the audio tag.
		 * @return {HTMLElement} Returns an HTML audio tag.
		 * @protected
		 */
		createTag:function (src) {
			var tag = document.createElement("audio");
			tag.autoplay = false;
			tag.preload = "none";
			tag.src = src;
			return tag;
		},

		/**
		 * Create a sound instance. If the sound has not been preloaded, it is internally preloaded here.
		 * @method create
		 * @param {String} src The sound source to use.
		 * @return {SoundInstance} A sound instance for playback and control.
		 */
		create:function (src) {
			// if this sound has not be registered, create a tag and preload it
			if (!this.isPreloadStarted(src)) {
				var channel = TagPool.get(src);
				var tag = this.createTag(src);
				channel.add(tag);
				this.preload(src, {tag:tag});
			}

			return new SoundInstance(src, this);
		},

		/**
		 * Checks if preloading has started for a specific source.
		 * @method isPreloadStarted
		 * @param {String} src The sound URI to check.
		 * @return {Boolean} If the preload has started.
		 * @since 0.4.0
		 */
		isPreloadStarted:function (src) {
			return (this.audioSources[src] != null);
		},

		/**
		 * Internally preload a sound.
		 * @method preload
		 * @param {String} src The sound URI to load.
		 * @param {Object} instance An object containing a tag property that is an HTML audio tag used to load src.
		 * @since 0.4.0
		 */
		preload:function (src, instance) {
			this.audioSources[src] = true;
			new HTMLAudioLoader(src, instance.tag);
		},

		toString:function () {
			return "[HTMLAudioPlugin]";
		}

	}

	createjs.HTMLAudioPlugin = HTMLAudioPlugin;


// NOTE Documentation for the SoundInstance class in WebAudioPlugin file. Each plugin generates a SoundInstance that
// follows the same interface.
	function SoundInstance(src, owner) {
		this.init(src, owner);
	}

	var p = SoundInstance.prototype = {

		src:null,
		uniqueId:-1,
		playState:null,
		owner:null,
		loaded:false,
		offset:0,
		delay:0,
		volume:1,
		pan:0,
		duration:0,
		remainingLoops:0,
		delayTimeoutId:null,
		tag:null,
		muted:false,
		paused:false,

// mix-ins:
		// EventDispatcher methods:
		addEventListener:null,
		removeEventListener:null,
		removeAllEventListeners:null,
		dispatchEvent:null,
		hasEventListener:null,
		_listeners:null,

// Callbacks
		onComplete:null,
		onLoop:null,
		onReady:null,
		onPlayFailed:null,
		onPlayInterrupted:null,
		onPlaySucceeded:null,

		// Proxies, make removing listeners easier.
		endedHandler:null,
		readyHandler:null,
		stalledHandler:null,

// Constructor
		init:function (src, owner) {
			this.src = src;
			this.owner = owner;

			this.endedHandler = createjs.proxy(this.handleSoundComplete, this);
			this.readyHandler = createjs.proxy(this.handleSoundReady, this);
			this.stalledHandler = createjs.proxy(this.handleSoundStalled, this);
		},

		sendEvent:function (eventString) {
			var event = {
				target:this,
				type:eventString
			};
			this.dispatchEvent(event);
		},

		cleanUp:function () {
			var tag = this.tag;
			if (tag != null) {
				tag.pause();
				try {
					tag.currentTime = 0;
				} catch (e) {
				} // Reset Position
				tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_ENDED, this.endedHandler, false);
				tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_READY, this.readyHandler, false);
				TagPool.setInstance(this.src, tag);
				this.tag = null;
			}

			clearTimeout(this.delayTimeoutId);
			if (window.createjs == null) {
				return;
			}
			createjs.Sound.playFinished(this);
		},

		interrupt:function () {
			if (this.tag == null) {
				return;
			}
			this.playState = createjs.Sound.PLAY_INTERRUPTED;
			if (this.onPlayInterrupted) {
				this.onPlayInterrupted(this);
			}
			this.sendEvent("interrupted");
			this.cleanUp();
			this.paused = false;
		},

// Public API
		play:function (interrupt, delay, offset, loop, volume, pan) {
			this.cleanUp(); //LM: Is this redundant?
			createjs.Sound.playInstance(this, interrupt, delay, offset, loop, volume, pan);
		},

		beginPlaying:function (offset, loop, volume, pan) {
			if (window.createjs == null) {
				return -1;
			}
			var tag = this.tag = TagPool.getInstance(this.src);
			if (tag == null) {
				this.playFailed();
				return -1;
			}

			this.duration = this.tag.duration * 1000;
			// OJR would like a cleaner way to do this in init, discuss with LM
			// need this for setPosition on stopped sounds

			tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_ENDED, this.endedHandler, false);

			// Reset this instance.
			this.offset = offset;
			this.volume = volume;
			this.updateVolume();  // note this will set for mute and masterMute
			this.remainingLoops = loop;

			if (tag.readyState !== 4) {
				tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_READY, this.readyHandler, false);
				tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_STALLED, this.stalledHandler, false);
				tag.load();
			} else {
				this.handleSoundReady(null);
			}

			this.onPlaySucceeded && this.onPlaySucceeded(this);
			this.sendEvent("succeeded");
			return 1;
		},

		// Note: Sounds stall when trying to begin playback of a new audio instance when the existing instances
		//  has not loaded yet. This doesn't mean the sound will not play.
		handleSoundStalled:function (event) {
			if (this.onPlayFailed != null) {
				this.onPlayFailed(this);
			}
			this.sendEvent("failed");
			this.cleanUp();  // OJR NOTE this will stop playback, and I think we should remove this and let the developer decide how to handle stalled instances
		},

		handleSoundReady:function (event) {
			if (window.createjs == null) {
				return;
			}
			this.playState = createjs.Sound.PLAY_SUCCEEDED;
			this.paused = false;
			this.tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_READY, this.readyHandler, false);

			if (this.offset >= this.getDuration()) {
				this.playFailed();  // OJR: throw error?
				return;
			} else if (this.offset > 0) {
				this.tag.currentTime = this.offset * 0.001;
			}
			if (this.remainingLoops == -1) {
				this.tag.loop = true;
			}
			this.tag.play();
		},

		pause:function () {
			if (!this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED && this.tag != null) {
				this.paused = true;
				// Note: when paused by user, we hold a reference to our tag. We do not release it until stopped.
				this.tag.pause();

				clearTimeout(this.delayTimeoutId);

				return true;
			}
			return false;
		},

		resume:function () {
			if (!this.paused || this.tag == null) {
				return false;
			}
			this.paused = false;
			this.tag.play();
			return true;
		},

		stop:function () {
			this.offset = 0;
			this.pause();
			this.playState = createjs.Sound.PLAY_FINISHED;
			this.cleanUp();
			return true;
		},

		setMasterVolume:function (value) {
			this.updateVolume();
			return true;
		},

		setVolume:function (value) {
			if (Number(value) == null) {
				return false;
			}
			value = Math.max(0, Math.min(1, value));
			this.volume = value;
			this.updateVolume();
			return true;
		},

		updateVolume:function () {
			if (this.tag != null) {
				var newVolume = (this.muted || createjs.Sound.masterMute) ? 0 : this.volume * createjs.Sound.masterVolume;
				if (newVolume != this.tag.volume) {
					this.tag.volume = newVolume;
				}
				return true;
			} else {
				return false;
			}
		},

		getVolume:function (value) {
			return this.volume;
		},

		mute:function (isMuted) {
			this.muted = isMuted;
			this.updateVolume();
			return true;
		},

		setMasterMute:function (isMuted) {
			this.updateVolume();
			return true;
		},

		setMute:function (isMuted) {
			if (isMuted == null || isMuted == undefined) {
				return false
			}
			;

			this.muted = isMuted;
			this.updateVolume();
			return true;
		},

		getMute:function () {
			return this.muted;
		},

		setPan:function (value) {
			return false;
		}, // Can not set pan in HTML

		getPan:function () {
			return 0;
		},

		getPosition:function () {
			if (this.tag == null) {
				return this.offset;
			}
			return this.tag.currentTime * 1000;
		},

		setPosition:function (value) {
			if (this.tag == null) {
				this.offset = value
			} else try {
				this.tag.currentTime = value * 0.001;
			} catch (error) { // Out of range
				return false;
			}
			return true;
		},

		getDuration:function () {  // NOTE this will always return 0 until sound has been played.
			return this.duration;
		},

		handleSoundComplete:function (event) {
			this.offset = 0;

			if (this.remainingLoops != 0) {
				this.remainingLoops--;

				//try { this.tag.currentTime = 0; } catch(error) {}
				this.tag.play();
				if (this.onLoop != null) {
					this.onLoop(this);
				}
				this.sendEvent("loop");
				return;
			}

			if (window.createjs == null) {
				return;
			}
			this.playState = createjs.Sound.PLAY_FINISHED;
			if (this.onComplete != null) {
				this.onComplete(this);
			}
			this.sendEvent("complete");
			this.cleanUp();
		},

		playFailed:function () {
			if (window.createjs == null) {
				return;
			}
			this.playState = createjs.Sound.PLAY_FAILED;
			if (this.onPlayFailed != null) {
				this.onPlayFailed(this);
			}
			this.sendEvent("failed");
			this.cleanUp();
		},

		toString:function () {
			return "[HTMLAudioPlugin SoundInstance]";
		}

	}

	createjs.EventDispatcher.initialize(SoundInstance.prototype);

	// Do not add SoundInstance to namespace.


	/**
	 * An internal helper class that preloads html audio via HTMLAudioElement tags. Note that PreloadJS will NOT use
	 * this load class like it does Flash and WebAudio plugins.
	 * Note that this class and its methods are not documented properly to avoid generating HTML documentation.
	 * #class HTMLAudioLoader
	 * @param {String} src The source of the sound to load.
	 * @param {HTMLAudioElement} tag The audio tag of the sound to load.
	 * @constructor
	 * @private
	 * @since 0.4.0
	 */
	function HTMLAudioLoader(src, tag) {
		this.init(src, tag);
	}

	HTMLAudioLoader.prototype = {

		/**
		 * The source to be loaded.
		 * #property src
		 * @type {String}
		 * @default null
		 * @protected
		 */
		src:null,

		/**
		 * The tag to load the source with / into.
		 * #property tag
		 * @type {AudioTag}
		 * @default null
		 * @protected
		 */
		tag:null,

		/**
		 * An intervale used to give us progress.
		 * #property preloadTimer
		 * @type {String}
		 * @default null
		 * @protected
		 */
		preloadTimer:null,

		// Proxies, make removing listeners easier.
		loadedHandler:null,

		// constructor
		init:function (src, tag) {
			this.src = src;
			this.tag = tag;

			this.preloadTimer = setInterval(createjs.proxy(this.preloadTick, this), 200);


			// This will tell us when audio is buffered enough to play through, but not when its loaded.
			// The tag doesn't keep loading in Chrome once enough has buffered, and we have decided that behaviour is sufficient.
			// Note that canplaythrough callback doesn't work in Chrome, we have to use the event.
			this.loadedHandler = createjs.proxy(this.sendLoadedEvent, this);  // we need this bind to be able to remove event listeners
			this.tag.addEventListener && this.tag.addEventListener("canplaythrough", this.loadedHandler);
			this.tag.onreadystatechange = createjs.proxy(this.sendLoadedEvent, this);  // OJR not 100% sure we need this, just copied from PreloadJS

			this.tag.preload = "auto";
			this.tag.src = src;
			this.tag.load();

		},

		/**
		 * Allows us to have preloading progress and tell when its done.
		 * #method preloadTick
		 * @protected
		 */
		preloadTick:function () {
			var buffered = this.tag.buffered;
			var duration = this.tag.duration;

			if (buffered.length > 0) {
				if (buffered.end(0) >= duration - 1) {
					this.handleTagLoaded();
				}
			}
		},

		/**
		 * Internal handler for when a tag is loaded.
		 * #method handleTagLoaded
		 * @protected
		 */
		handleTagLoaded:function () {
			clearInterval(this.preloadTimer);
		},

		/**
		 * Communicates back to Sound that a load is complete.
		 * #method sendLoadedEvent
		 * @param {Object} evt The load Event
		 */
		sendLoadedEvent:function (evt) {
			this.tag.removeEventListener && this.tag.removeEventListener("canplaythrough", this.loadedHandler);  // cleanup and so we don't send the event more than once
			this.tag.onreadystatechange = null;  // cleanup and so we don't send the event more than once
			createjs.Sound.sendLoadComplete(this.src);  // fire event or callback on Sound
		},

		// used for debugging
		toString:function () {
			return "[HTMLAudioPlugin HTMLAudioLoader]";
		}
	}

	// Do not add HTMLAudioLoader to namespace


	/**
	 * The TagPool is an object pool for HTMLAudio tag instances. In Chrome, we have to pre-create the number of HTML
	 * audio tag instances that we are going to play before we load the data, otherwise the audio stalls.
	 * (Note: This seems to be a bug in Chrome)
	 * #class TagPool
	 * @param {String} src The source of the channel.
	 * @private
	 */
	function TagPool(src) {
		this.init(src);
	}

	/**
	 * A hash lookup of each sound channel, indexed by the audio source.
	 * #property tags
	 * @static
	 * @private
	 */
	TagPool.tags = {};

	/**
	 * Get a tag pool. If the pool doesn't exist, create it.
	 * #method get
	 * @param {String} src The source file used by the audio tag.
	 * @static
	 * @private
	 */
	TagPool.get = function (src) {
		var channel = TagPool.tags[src];
		if (channel == null) {
			channel = TagPool.tags[src] = new TagPool(src);
		}
		return channel;
	}

	/**
	 * Get a tag instance. This is a shortcut method.
	 * #method getInstance
	 * @param {String} src The source file used by the audio tag.
	 * @static
	 * @private
	 */
	TagPool.getInstance = function (src) {
		var channel = TagPool.tags[src];
		if (channel == null) {
			return null;
		}
		return channel.get();
	}

	/**
	 * Return a tag instance. This is a shortcut method.
	 * #method setInstance
	 * @param {String} src The source file used by the audio tag.
	 * @param {HTMLElement} tag Audio tag to set.
	 * @static
	 * @private
	 */
	TagPool.setInstance = function (src, tag) {
		var channel = TagPool.tags[src];
		if (channel == null) {
			return null;
		}
		return channel.set(tag);
	}

	TagPool.prototype = {

		/**
		 * The source of the tag pool.
		 * #property src
		 * @type {String}
		 * @private
		 */
		src:null,

		/**
		 * The total number of HTMLAudio tags in this pool. This is the maximum number of instance of a certain sound
		 * that can play at one time.
		 * #property length
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		length:0,

		/**
		 * The number of unused HTMLAudio tags.
		 * #property available
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		available:0,

		/**
		 * A list of all available tags in the pool.
		 * #property tags
		 * @type {Array}
		 * @private
		 */
		tags:null,

		// constructor
		init:function (src) {
			this.src = src;
			this.tags = [];
		},

		/**
		 * Add an HTMLAudio tag into the pool.
		 * #method add
		 * @param {HTMLAudioElement} tag A tag to be used for playback.
		 */
		add:function (tag) {
			this.tags.push(tag);
			this.length++;
			this.available++;
		},

		/**
		 * Get an HTMLAudioElement for immediate playback. This takes it out of the pool.
		 * #method get
		 * @return {HTMLAudioElement} An HTML audio tag.
		 */
		get:function () {
			if (this.tags.length == 0) {
				return null;
			}
			this.available = this.tags.length;
			var tag = this.tags.pop();
			if (tag.parentNode == null) {
				document.body.appendChild(tag);
			}
			return tag;
		},

		/**
		 * Put an HTMLAudioElement back in the pool for use.
		 * #method set
		 * @param {HTMLAudioElement} tag HTML audio tag
		 */
		set:function (tag) {
			var index = this.tags.indexOf(tag);
			if (index == -1) {
				this.tags.push(tag);
			}
			this.available = this.tags.length;
		},

		toString:function () {
			return "[HTMLAudioPlugin TagPool]";
		}

	}

	// do not add TagPool to namespace

}());

/*
 * WebAudioPlugin for SoundJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 *
 * Copyright (c) 2012 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @module SoundJS
 */

// namespace:
this.createjs = this.createjs || {};

(function () {

	/**
	 * Play sounds using Web Audio in the browser. The WebAudio plugin has been successfully tested with:
	 * <ul><li>Google Chrome, version 23+ on OS X and Windows</li>
	 *      <li>Safari 6+ on OS X</li>
	 *      <li>Mobile Safari on iOS 6+</li>
	 * </ul>
	 *
	 * The WebAudioPlugin is currently the default plugin, and will be used anywhere that it is supported. To change
	 * plugin priority, check out the Sound API {{#crossLink "Sound/registerPlugins"}}{{/crossLink}} method.

	 * <h4>Known Browser and OS issues for Web Audio Plugin</h4>
	 * <b>Webkit (Chrome and Safari)</b><br />
	 * <ul><li>AudioNode.disconnect does not always seem to work.  This can cause your file size to grow over time if you
	 * are playing a lot of audio files.</li>
	 *
	 * <b>iOS 6 limitations</b><br />
	 * <ul><li>Sound is initially muted and will only unmute through play being called inside a user initiated event (touch).</li>
	 *
	 * @class WebAudioPlugin
	 * @constructor
	 * @since 0.4.0
	 */
	function WebAudioPlugin() {
		this.init();
	}

	var s = WebAudioPlugin;

	/**
	 * The capabilities of the plugin. This is generated via the <code>"WebAudioPlugin/generateCapabilities</code>
	 * method.
	 * @property capabilities
	 * @type {Object}
	 * @default null
	 * @static
	 */
	s.capabilities = null;

	/**
	 * Determine if the plugin can be used in the current browser/OS.
	 * @method isSupported
	 * @return {Boolean} If the plugin can be initialized.
	 * @static
	 */
	s.isSupported = function () {
		if (location.protocol == "file:") { return false; }  // Web Audio requires XHR, which is not available locally
		s.generateCapabilities();
		if (s.context == null) {
			return false;
		}
		return true;
	};

	/**
	 * Determine the capabilities of the plugin. Used internally. Please see the Sound API {{#crossLink "Sound/getCapabilities"}}{{/crossLink}}
	 * method for an overview of plugin capabilities.
	 * @method generateCapabiities
	 * @static
	 * @protected
	 */
	s.generateCapabilities = function () {
		if (s.capabilities != null) {
			return;
		}
		// Web Audio can be in any formats supported by the audio element, from http://www.w3.org/TR/webaudio/#AudioContext-section,
		// therefore tag is still required for the capabilities check
		var t = document.createElement("audio");

		if (t.canPlayType == null) {
			return null;
		}

		// This check is first because it's what is currently used, but the spec calls for it to be AudioContext so this
		//  will probably change in time
		if (window.webkitAudioContext) {
			s.context = new webkitAudioContext();
		} else if (window.AudioContext) {
			s.context = new AudioContext();
		} else {
			return null;
		}

		s.capabilities = {
			panning: true,
			volume: true,
			tracks: -1
		};

		// determine which extensions our browser supports for this plugin by iterating through Sound.SUPPORTED_EXTENSIONS
		var supportedExtensions = createjs.Sound.SUPPORTED_EXTENSIONS;
		var extensionMap = createjs.Sound.EXTENSION_MAP;
		for (var i = 0, l = supportedExtensions.length; i < l; i++) {
			var ext = supportedExtensions[i];
			var playType = extensionMap[ext] || ext;
			s.capabilities[ext] = (t.canPlayType("audio/" + ext) != "no" && t.canPlayType("audio/" + ext) != "") || (t.canPlayType("audio/" + playType) != "no" && t.canPlayType("audio/" + playType) != "");
		}  // OJR another way to do this might be canPlayType:"m4a", codex: mp4

		// 0=no output, 1=mono, 2=stereo, 4=surround, 6=5.1 surround.
		// See http://www.w3.org/TR/webaudio/#AudioChannelSplitter for more details on channels.
		if (s.context.destination.numberOfChannels < 2) {
			s.capabilities.panning = false;
		}

		// set up AudioNodes that all of our source audio will connect to
		s.dynamicsCompressorNode = s.context.createDynamicsCompressor();
		s.dynamicsCompressorNode.connect(s.context.destination);
		s.gainNode = s.context.createGainNode();
		s.gainNode.connect(s.dynamicsCompressorNode);
	}

	var p = s.prototype = {

		capabilities: null, // doc'd above

		/**
		 * The internal volume value of the plugin.
		 * @property volume
		 * @type {Number}
		 * @default 1
		 * @protected
		 */
		volume: 1,

		/**
		 * The web audio context, which WebAudio uses to play audio. All nodes that interact with the WebAudioPlugin
         * need to be created within this context.
		 * @property context
		 * @type {AudioContext}
		 */
		context: null,

		/**
		 * A DynamicsCompressorNode, which is used to improve sound and prevent audio distortion according to
		 * http://www.w3.org/TR/webaudio/#DynamicsCompressorNode. It is connected to <code>context.destination</code>.
		 * @property dynamicsCompressorNode
		 * @type {AudioNode}
		 */
		dynamicsCompressorNode: null,

		/**
		 * A GainNode for controlling master volume. It is connected to <code>dynamicsCompressorNode</code>.
		 * @property gainNode
		 * @type {AudioGainNode}
		 */
		gainNode: null,

		/**
		 * A hash used internally to store ArrayBuffers, indexed by the source URI used  to load it. This prevents
		 * having to load and decode audio files more than once. If a load has been started on a file, <code>arrayBuffers[src]</code>
		 * will be set to true. Once load is complete, it is set the the loaded ArrayBuffer instance.
		 * @property arrayBuffers
		 * @type {Object}
		 * @protected
		 */
		arrayBuffers: null,

		/**
		 * An initialization function run by the constructor
		 * @method init
		 * @private
		 */
		init: function () {
			this.capabilities = s.capabilities;
			this.arrayBuffers = {};

			this.context = s.context;
			this.gainNode = s.gainNode;
			this.dynamicsCompressorNode = s.dynamicsCompressorNode;
		},

		/**
		 * Pre-register a sound for preloading and setup. This is called by {{#crossLink "Sound"}}{{/crossLink}}.
		 * Note that WebAudio provides a <code>WebAudioLoader</code> instance, which <a href="http://preloadjs.com">PreloadJS</a>
		 * can use to assist with preloading.
		 * @method register
		 * @param {String} src The source of the audio
		 * @param {Number} instances The number of concurrently playing instances to allow for the channel at any time.
		 * Note that the WebAudioPlugin does not manage this property.
		 * @return {Object} A result object, containing a "tag" for preloading purposes.
		 */
		register: function (src, instances) {
			this.arrayBuffers[src] = true;  // This is needed for PreloadJS
			var tag = new WebAudioLoader(src, this);
			return {
				tag: tag
			};
		},

		/**
		 * Checks if preloading has started for a specific source. If the source is found, we can assume it is loading,
		 * or has already finished loading.
		 * @method isPreloadStarted
		 * @param {String} src The sound URI to check.
		 * @return {Boolean}
		 */
		isPreloadStarted: function (src) {
			return (this.arrayBuffers[src] != null);
		},

		/**
		 * Checks if preloading has finished for a specific source. If the source is defined (but not === true), then
		 * it has finished loading.
		 * @method isPreloadComplete
		 * @param {String} src The sound URI to load.
		 * @return {Boolean}
		 */
		isPreloadComplete: function (src) {
			return (!(this.arrayBuffers[src] == null || this.arrayBuffers[src] == true));
		},

		/**
		 * Remove a source from our preload list. Note this does not cancel a preload.
		 * @method removeFromPreload
		 * @param {String} src The sound URI to unload.
		 * @return {Boolean}
		 */
		removeFromPreload: function (src) {
			delete (this.arrayBuffers[src]);
		},

		/**
		 * Add loaded results to the preload hash.
		 * @method addPreloadResults
		 * @param {String} src The sound URI to unload.
		 * @return {Boolean}
		 */
		addPreloadResults: function (src, result) {
			this.arrayBuffers[src] = result;
		},

		/**
		 * Handles internal preload completion.
		 * @method handlePreloadComplete
		 * @private
		 */
		handlePreloadComplete: function () {
			//LM: I would recommend having the WebAudioLoader include an "event" in the onload, and properly binding this callback.
			createjs.Sound.sendLoadComplete(this.src);  // fire event or callback on Sound
			// note "this" will reference WebAudioLoader object
		},

		/**
		 * Internally preload a sound. Loading uses XHR2 to load an array buffer for use with WebAudio.
		 * @method preload
		 * @param {String} src The sound URI to load.
		 * @param {Object} instance Not used in this plugin.
		 * @protected
		 */
		preload: function (src, instance) {
			this.arrayBuffers[src] = true;
			var loader = new WebAudioLoader(src, this);
			loader.onload = this.handlePreloadComplete;
			loader.load();
		},

		/**
		 * Create a sound instance. If the sound has not been preloaded, it is internally preloaded here.
		 * @method create
		 * @param {String} src The sound source to use.
		 * @return {SoundInstance} A sound instance for playback and control.
		 */
		create: function (src) {
			if (!this.isPreloadStarted(src)) {
				this.preload(src);
			}
			return new SoundInstance(src, this);
		},

		/**
		 * Set the master volume of the plugin, which affects all SoundInstances.
		 * @method setVolume
		 * @param {Number} value The volume to set, between 0 and 1.
		 * @return {Boolean} If the plugin processes the setVolume call (true). The Sound class will affect all the
		 * instances manually otherwise.
		 */
		setVolume: function (value) {
			this.volume = value;
			this.updateVolume();
			return true;
		},

		/**
		 * Set the gain value for master audio. Should not be called externally.
		 * @method updateVolume
		 * @protected
		 */
		updateVolume: function () {
			var newVolume = createjs.Sound.masterMute ? 0 : this.volume;
			if (newVolume != this.gainNode.gain.value) {
				this.gainNode.gain.value = newVolume;
			}
		},

		/**
		 * Get the master volume of the plugin, which affects all SoundInstances.
		 * @method getVolume
		 * @return The volume level, between 0 and 1.
		 */
		getVolume: function () {
			return this.volume;
		},

		/**
		 * Mute all sounds via the plugin.
		 * @method setMute
		 * @param {Boolean} value If all sound should be muted or not. Note that plugin-level muting just looks up
		 * the mute value of Sound {{#crossLink "Sound/masterMute"}}{{/crossLink}}, so this property is not used here.
		 * @return {Boolean} If the mute call succeeds.
		 */
		setMute: function (value) {
			this.updateVolume();
			return true;
		},

		toString: function () {
			return "[WebAudioPlugin]";
		}

	}

	createjs.WebAudioPlugin = WebAudioPlugin;


	/**
	 * A SoundInstance is created when any calls to the Sound API method {{#crossLink "Sound/play"}}{{/crossLink}} or
	 * {{#crossLink "Sound/createInstance"}}{{/crossLink}} are made. The SoundInstance is returned by the active plugin
	 * for control by the user.
	 *
	 * <h4>Example</h4>
	 *      Sound.play("myAssetPath/mySrcFile.mp3");
	 *
	 * A number of additional parameters provide a quick way to determine how a sound is played. Please see the Sound
	 * API method {{#crossLink "Sound/play"}}{{/crossLink}} for a list of arguments.
	 *
	 * Once a SoundInstance is created, a reference can be stored that can be used to control the audio directly through
	 * the SoundInstance. If the reference is not stored, the SoundInstance will play out its audio (and any loops), and
	 * is then de-referenced from the {{#crossLink "Sound"}}{{/crossLink}} class so that it can be cleaned up. If audio
	 * playback has completed, a simple call to the {{#crossLink "SoundInstance/play"}}{{/crossLink}} instance method
	 * will rebuild the references the Sound class need to control it.
	 *
	 *      var myInstance = Sound.play("myAssetPath/mySrcFile.mp3");
	 *      myInstance.addEventListener("complete", playAgain);
	 *      function playAgain(event) {
	 *          myInstance.play();
	 *      }
	 *
	 * Events are dispatched from the instance to notify when the sound has completed, looped, or when playback fails
	 *
	 *      var myInstance = Sound.play("myAssetPath/mySrcFile.mp3");
	 *      myInstance.addEventListener("complete", playAgain);
	 *      myInstance.addEventListener("loop", handleLoop);
	 *      myInstance.addEventListener("playbackFailed", handleFailed);
	 *
	 *
	 * @class SoundInstance
	 * @param {String} src The path to and file name of the sound.
	 * @param {Object} owner The plugin instance that created this SoundInstance.
	 * @uses EventDispatcher
	 * @constructor
	 */
	// TODO noteGrainOn and noteOff have been deprecated in favor of start and stop, once those are implemented in browsers we should make the switch.  http://www.w3.org/TR/webaudio/#deprecation-section
	function SoundInstance(src, owner) {
		this.init(src, owner);
	}

	var p = SoundInstance.prototype = {

		/**
		 * The source of the sound.
		 * @property src
		 * @type {String}
		 * @default null
		 * @protected
		 */
		src: null,

		/**
		 * The unique ID of the instance. This is set by <code>Sound</code>.
		 * @property uniqueId
		 * @type {String} | Number
		 * @default -1
		 */
		uniqueId: -1,

		/**
		 * The play state of the sound. Play states are defined as constants on <code>Sound</code>.
		 * @property playState
		 * @type {String}
		 * @default null
		 */
		playState: null,

		/**
		 * The plugin that created the instance
		 * @property owner
		 * @type {WebAudioPlugin}
		 * @default null
		 * @protected
		 */
		owner: null,

		/**
		 * How far into the sound to begin playback in milliseconds. This is passed in when play is called and used by
		 * pause and setPosition to track where the sound should be at.
		 * Note this is converted from milliseconds to seconds for consistency with the WebAudio API.
		 * @property offset
		 * @type {Number}
		 * @default 0
		 * @protected
		 */
		offset: 0,

		/**
		 * The time in milliseconds before the sound starts.
		 * Note this is handled by <code>Sound</code>.
		 * @property delay
		 * @type {Number}
		 * @default 0
		 * @protected
		 */
		delay: 0,


		/**
		 * The volume of the sound, between 0 and 1.
		 * Use <code>getVolume</code> and <code>setVolume</code> to access.
		 * @property volume
		 * @type {Number}
		 * @default 0
		 * @protected
		 */
		volume: 1,

		/**
		 * The pan of the sound, between -1 (left) and 1 (right). Note that pan does not work for HTML Audio.
		 * Use <code>getPan</code> and <code>setPan</code> to access.
		 * @property pan
		 * @type {Number}
		 * @default 0
		 * @protected
		 */
		pan: 0,


		/**
		 * The length of the audio clip, in milliseconds.
		 * Use <code>getDuration</code> to access.
		 * @property pan
		 * @type {Number}
		 * @default 0
		 * @protected
		 */
		duration: 0,

		/**
		 * The number of play loops remaining. Negative values will loop infinitely.
		 * @property remainingLoops
		 * @type {Number}
		 * @default 0
		 * @protected
		 */
		remainingLoops: 0,

		/**
		 * A Timout created by <code>Sound</code> when this SoundInstance is played with a delay. This allows SoundInstance
		 * to remove the delay if stop or pause or cleanup are called before playback begins.
		 * @property delayTimeoutId
		 * @type {timeoutVariable}
		 * @default null
		 * @protected
		 * @since 0.4.0
		 */
		delayTimeoutId: null, // OJR should we clear this when playback begins?  If they call play with delay and then just play it will behave oddly.

		/**
		 * Timeout that is created internally to handle sound playing to completion. Stored so we can remove it when
		 * stop, pause, or cleanup are called
		 * @property soundCompleteTimeout
		 * @type {timeoutVariable}
		 * @default null
		 * @protected
		 * @since 0.4.0
		 */
		soundCompleteTimeout: null,

		/**
		 * NOTE this only exists as a <code>WebAudioPlugin</code> property and is only intended for use by advanced users.
		 * A panNode allowing left and right audio channel panning only. Connected to our <code>WebAudioPlugin.gainNode</code>
		 * that sequences to <code>context.destination</code>.
		 * @property panNode
		 * @type {AudioPannerNode}
		 * @default null
		 * @since 0.4.0
		 */
		// OJR expose the Nodes for more advanced users, test with LM how it will impact docs
		panNode: null,

		/**
		 * NOTE this only exists as a <code>WebAudioPlugin</code> property and is only intended for use by advanced users.
		 * GainNode for controlling <code>SoundInstance</code> volume. Connected to <code>panNode</code>.
		 * @property gainNode
		 * @type {AudioGainNode}
		 * @default null
		 * @since 0.4.0
		 *
		 */
		gainNode: null,

		/**
		 * NOTE this only exists as a <code>WebAudioPlugin</code> property and is only intended for use by advanced users.
		 * sourceNode is our audio source. Connected to <code>gainNode</code>.
		 * @property sourceNode
		 * @type {AudioSourceNode}
		 * @default null
		 * @since 0.4.0
		 *
		 */
		sourceNode: null,

		/**
		 * Determines if the audio is currently muted.
		 * Use <code>getMute</code> and <code>setMute</code> to access.
		 * @property muted
		 * @type {Boolean}
		 * @default false
		 * @protected
		 */
		muted: false,

		/**
		 * Determines if the audio is currently paused.
		 * Use <code>pause()</code> and <code>resume()</code> to set.
		 * @property paused
		 * @type {Boolean}
		 * @default false
		 * @protected
		 */
		paused: false,

		/**
		 * WebAudioPlugin only.
		 * Time audio started playback, in seconds. Used to handle set position, get position, and resuming from paused.
		 * @property startTime
		 * @type {Number}
		 * @default 0
		 * @since 0.4.0
		 */
		startTime: 0,

		// mix-ins:
		// EventDispatcher methods:
		addEventListener: null,
		removeEventListener: null,
		removeAllEventListeners: null,
		dispatchEvent: null,
		hasEventListener: null,
		_listeners: null,

		// Proxies, make removing listeners easier.
		endedHandler: null,
		readyHandler: null,
		stalledHandler: null,

		// Events
		/**
		 * The event that is fired when a sound is ready to play.
		 * @event ready
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		/**
		 * The event that is fired when playback has started successfully.
		 * @event succeeded
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		/**
		 * The event that is fired when playback is interrupted. This happens when another sound with the same
		 * src property is played using an interrupt value that causes this instance to stop playing.
		 * @event interrupted
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		/**
		 * The event that is fired when playback has failed. This happens when there are too many channels with the same
		 * src property already playing (and the interrupt value doesn't cause an interrupt of another instance), or
		 * the sound could not be played, perhaps due to a 404 error.
		 * @event failed
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		/**
		 * The event that is fired when a sound has finished playing but has loops remaining.
		 * @event loop
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		/**
		 * The event that is fired when playback completes. This means that the sound has finished playing in its
		 * entirety, including its loop iterations.
		 * @event complete
		 * @param {Object} target The object that dispatched the event.
		 * @param {String} type The event type.
		 * @since 0.4.0
		 */

		// Callbacks
		/**
		 * The callback that is fired when a sound is ready to play.
		 * @property onReady
		 * @type {Function}
		 * @deprecated In favor of the "ready" event. Will be removed in a future version.
		 */
		onReady: null,

		/**
		 * The callback that is fired when playback has started successfully.
		 * @property onPlaySucceeded
		 * @type {Function}
		 * @deprecated In favour of the "succeeded" event. Will be removed in a future version.
		 */
		onPlaySucceeded: null,

		/**
		 * The callback that is fired when a sound has been interrupted.
		 * @property onPlayInterrupted
		 * @type {Function}
		 * @deprecated Deprecated in favor of the "interrupted" event. Will be removed in a future version.
		 */
		onPlayInterrupted: null,

		/**
		 * The callback that is fired when a sound has failed to start.
		 * @property onPlayFailed
		 * @type {Function}
		 * @deprecated In favor of the "failed" event. Will be removed in a future version.
		 */
		onPlayFailed: null,

		/**
		 * The callback that is fired when a sound has completed playback.
		 * @property onComplete
		 * @type {Function}
		 * @deprecated In favor of the "complete" event. Will be removed in a future version.
		 */
		onComplete: null,

		/**
		 * The callback that is fired when a sound has completed playback, but has loops remaining.
		 * @property onLoop
		 * @type {Function}
		 * @deprecated In favor of the "loop" event. Will be removed in a future version.
		 */
		onLoop: null,


		/**
		 * A helper method that dispatches all events for SoundInstance.
		 * @method sendEvent
		 * @param {String} type The event type
		 * @private
		 */
		sendEvent: function (type) {
			var event = {
				target: this,
				type: type
			};
			this.dispatchEvent(event);
		},

		// Constructor
		/**
		 * Initialize the SoundInstance. This is called from the constructor.
		 * @method init
		 * @param {string} src The source of the audio.
		 * @param {Class} owner The plugin that created this instance.
		 * @protected
		 */
		init: function (src, owner) {
			this.owner = owner;
			this.src = src;

			this.panNode = this.owner.context.createPanner();  // allows us to manipulate left and right audio  // TODO test how this affects when we have mono audio

			this.gainNode = this.owner.context.createGainNode();  // allows us to manipulate instance volume
			this.gainNode.connect(this.panNode);  // connect us to our sequence that leads to context.destination

			if (this.owner.isPreloadComplete(this.src)) {
				this.duration = this.owner.arrayBuffers[this.src].duration * 1000;
			}

			this.endedHandler = createjs.proxy(this.handleSoundComplete, this);
			this.readyHandler = createjs.proxy(this.handleSoundReady, this);
			this.stalledHandler = createjs.proxy(this.handleSoundStalled, this);
		},

		/**
		 * Clean up the instance. Remove references and clean up any additional properties such as timers.
		 * @method cleanup
		 * @protected
		 */
		cleanUp: function () {
			// if playbackState is UNSCHEDULED_STATE, then noteON or noteGrainOn has not been called so calling noteOff would throw an error
			if (this.sourceNode && this.sourceNode.playbackState != this.sourceNode.UNSCHEDULED_STATE) {
				this.sourceNode.noteOff(0);
				this.sourceNode = null; // release reference so Web Audio can handle removing references and garbage collection
			}

			if (this.panNode.numberOfOutputs != 0) {
				this.panNode.disconnect(0);
			}  // this works because we only have one connection, and it returns 0 if we've already disconnected it.
			// OJR there appears to be a bug that this doesn't always work in webkit (Chrome and Safari). According to the documentation, this should work. // TODO test in safari

			clearTimeout(this.delayTimeoutId); // clear timeout that plays delayed sound
			clearTimeout(this.soundCompleteTimeout);  // clear timeout that triggers sound complete

			if (window.createjs == null) {
				return;
			}
			createjs.Sound.playFinished(this);
		},

		/**
		 * The sound has been interrupted.
		 * @method interrupt
		 * @protected
		 */
		interrupt: function () {
			this.playState = createjs.Sound.PLAY_INTERRUPTED;
			if (this.onPlayInterrupted) {
				this.onPlayInterrupted(this);
			}
			this.sendEvent("interrupted");
			this.cleanUp();
			this.paused = false;
		},

		// Playback has stalled, and therefore failed.
		handleSoundStalled: function (event) {
			if (this.onPlayFailed != null) {
				this.onPlayFailed(this);
			}
			this.sendEvent("failed");
		},

		// The sound is ready for playing
		handleSoundReady: function (event) {
			if (window.createjs == null) {
				return;
			}

			if (this.offset > this.getDuration()) {
				this.playFailed();
				return;
			} else if (this.offset < 0) {  // may not need this check if noteGrainOn ignores negative values, this is not specified in the API http://www.w3.org/TR/webaudio/#AudioBufferSourceNode
				this.offset = 0;
			}

			this.playState = createjs.Sound.PLAY_SUCCEEDED;
			this.paused = false;

			this.panNode.connect(this.owner.gainNode);  // this line can cause a memory leak.  Nodes need to be disconnected from the audioDestination or any sequence that leads to it.

			// WebAudio supports BufferSource, MediaElementSource, and MediaStreamSource.
			// NOTE MediaElementSource requires different commands to play, pause, and stop because it uses audio tags.
			// The same is assumed for MediaStreamSource, although it may share the same commands as MediaElementSource.
			this.sourceNode = this.owner.context.createBufferSource();
			this.sourceNode.buffer = this.owner.arrayBuffers[this.src];
			this.duration = this.owner.arrayBuffers[this.src].duration * 1000;
			this.sourceNode.connect(this.gainNode);

			this.soundCompleteTimeout = setTimeout(this.endedHandler, (this.sourceNode.buffer.duration - this.offset) * 1000);  // NOTE *1000 because WebAudio reports everything in seconds but js uses milliseconds

			this.startTime = this.owner.context.currentTime - this.offset;
			this.sourceNode.noteGrainOn(0, this.offset, this.sourceNode.buffer.duration - this.offset);
		},

		// Public API
		/**
		 * Play an instance. This method is intended to be called on SoundInstances that already exist (were created
		 * with the Sound API {{#crossLink "createInstance"}}{{/crossLink}}, or have completed playback, and need to
		 * be played again.
		 *
		 * <h4>Example</h4>
		 *      var myInstance = createJS.Sound.createInstance(mySrc);
		 *      myInstance.play(createJS.Sound.INTERRUPT_ANY);
		 *
		 * @method play
		 * @param {String} [interrupt=none] How this sound interrupts other instances with the same source. Interrupt values
		 * are defined as constants on {{#crossLink "Sound"}}{{/crossLink}}. The default value is <code>Sound.INTERRUPT_NONE</code>.
		 * @param {Number} [delay=0] The delay in milliseconds before the sound starts
		 * @param {Number} [offset=0] How far into the sound to begin playback, in milliseconds.
		 * @param {Number} [loop=0] The number of times to loop the audio. Use -1 for infinite loops.
		 * @param {Number} [volume=1] The volume of the sound, between 0 and 1.
		 * @param {Number} [pan=0] The pan of the sound between -1 (left) and 1 (right). Note that pan does not work
		 * for HTML Audio.
		 */
		play: function (interrupt, delay, offset, loop, volume, pan) {
			this.cleanUp();
			createjs.Sound.playInstance(this, interrupt, delay, offset, loop, volume, pan);
		},

		/**
		 * Called by the Sound class when the audio is ready to play (delay has completed). Starts sound playing if the
		 * src is loaded, otherwise playback will fail.
		 * @method beginPlaying
		 * @param {Number} offset How far into the sound to begin playback, in milliseconds.
		 * @param {Number} loop The number of times to loop the audio. Use -1 for infinite loops.
		 * @param {Number} volume The volume of the sound, between 0 and 1.
		 * @param {Number} pan The pan of the sound between -1 (left) and 1 (right). Note that pan does not work for HTML Audio.
		 * @protected
		 */
		beginPlaying: function (offset, loop, volume, pan) {
			if (window.createjs == null) {
				return;
			}

			if (!this.src) {
				return;
			}

			this.offset = offset / 1000;  //convert ms to sec
			this.remainingLoops = loop;
			this.setVolume(volume);
			this.setPan(pan);

			if (this.owner.isPreloadComplete(this.src)) {
				this.handleSoundReady(null);
				this.onPlaySucceeded && this.onPlaySucceeded(this);
				this.sendEvent("succeeded");
				return 1;
			} else {
				this.playFailed();
				return;
			}
		},

		/**
		 * Pause the instance. Paused audio will stop at the current time, and can be resumed using
		 * {{#crossLink "SoundInstance/resume"}}{{/crossLink}}.
		 *
		 * <h4>Example</h4>
		 *      myInstance.pause();
		 *
		 * @method pause
		 * @return {Boolean} If the pause call succeeds. This will return false if the sound isn't currently playing.
		 */
		pause: function () {
			if (!this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED) {
				this.paused = true;

				this.offset = this.owner.context.currentTime - this.startTime;  // this allows us to restart the sound at the same point in playback
				this.sourceNode.noteOff(0);  // note this means the sourceNode cannot be reused and must be recreated

				if (this.panNode.numberOfOutputs != 0) {
					this.panNode.disconnect();
				}  // this works because we only have one connection, and it returns 0 if we've already disconnected it.

				clearTimeout(this.delayTimeoutId); // clear timeout that plays delayed sound
				clearTimeout(this.soundCompleteTimeout);  // clear timeout that triggers sound complete
				return true;
			}
			return false;
		},

		/**
		 * Resume an instance that has been paused using {{#crossLink "SoundInstance/pause"}}{{/crossLink}}. Audio that
		 * has not been started may not resume when this method is called.
		 * @method resume
		 * @return {Boolean} If the resume call succeeds. This will return false if called on a sound that is not paused.
		 */
		resume: function () {
			if (!this.paused) {
				return false;
			}
			this.handleSoundReady(null);
			return true;
		},

		/**
		 * Stop playback of the instance. Stopped sounds will reset their position, and calls to {{#crossLink "SoundInstance/resume"}}{{/crossLink}}
		 * may fail.
		 * @method stop
		 * @return {Boolean} If the stop call succeeds.
		 */
		stop: function () {
			this.playState = createjs.Sound.PLAY_FINISHED;
			this.cleanUp();
			this.offset = 0;  // set audio to start at the beginning
			return true;
		},

		/**
		 * Set the volume of the instance. You can retrieve the volume using {{#crossLink "SoundInstance/getVolume"}}{{/crossLink}}.
		 *
		 * <h4>Example</h4>
		 *      myInstance.setVolume(0.5);
		 *
		 * Note that the master volume set using the Sound API method {{#crossLink "Sound/setVolume"}}{{/crossLink}}
		 * will apply on top of the instance volume.
		 *
		 * @method setVolume
		 * @param value The volume to set, between 0 and 1.
		 * @return {Boolean} If the setVolume call succeeds.
		 */
		setVolume: function (value) {
			if (Number(value) == null) {
				return false;
			}
			value = Math.max(0, Math.min(1, value));
			this.volume = value;
			this.updateVolume();
			return true;  // This is always true because even if the volume is not updated, the value is set
		},

		/**
		 * Internal function used to update the volume based on the instance volume, master volume, instance mute value,
		 * and master mute value.
		 * @method updateVolume
		 * @return {Boolean} if the volume was updated.
		 * @protected
		 */
		updateVolume: function () {
			var newVolume = this.muted ? 0 : this.volume;
			if (newVolume != this.gainNode.gain.value) {
				this.gainNode.gain.value = newVolume;
				return true;
			}
			return false;
		},

		/**
		 * Get the volume of the instance. The actual output volume of a sound can be calculated using:
		 *
		 *      instance.getVolume() x Sound.getVolume();
		 *
		 * @method getVolume
		 * @return The current volume of the sound instance.
		 */
		getVolume: function () {
			return this.volume;
		},

		/**
		 * Mute and unmute the sound. Muted sounds will still play at 0 volume. Note that an unmuted sound may still be
		 * muted depending on the Sound volume, instance volume, and Sound mute.
		 * @method mute
		 * @param {Boolean} value If the sound should be muted or not.
		 * @return {Boolean} If the mute call succeeds.
		 * @deprecated This method has been replaced by setMute.
		 */
		mute: function (value) {
			this.muted = value;
			this.updateVolume();
			return true;
		},

		/**
		 * Mute and unmute the sound. Muted sounds will still play at 0 volume. Note that an unmuted sound may still be
		 * muted depending on the Sound volume, instance volume, and Sound mute.
		 * @method mute
		 * @param {Boolean} value If the sound should be muted.
		 * @return {Boolean} If the mute call succeeds.
		 * @since 0.4.0
		 */
		setMute: function (value) {
			if (value == null || value == undefined) {
				return false
			}
			;
			this.muted = value;
			this.updateVolume();
			return true;
		},

		/**
		 * Get the mute value of the instance.
		 *
		 * <h4>Example</h4>
		 *      var isMuted = myInstance.getMute();
		 *
		 * @method getMute
		 * @return {Boolean} If the sound is muted.
		 * @since 0.4.0
		 */
		getMute: function () {
			return this.muted;
		},

		/**
		 * Set the left/right pan of the instance. Note that {{#crossLink "HTMLAudioPlugin"}}{{/crossLink}} does not
		 * support panning, and only simple left/right panning has been implemented for {{#crossLink "WebAudioPlugin"}}{{/crossLink}}.
		 * The default pan value is 0 (center).
		 * @method setPan
		 * @param {Number} value The pan value, between -1 (left) and 1 (right).
		 * @return {Number} If the setPan call succeeds.
		 */
		setPan: function (value) {
			if (this.owner.capabilities.panning) {
				// OJR consider putting in value check to make sure it stays in -1 to 1 bound
				// Note that panning in WebAudioPlugin can support 3D audio, but our implementation does not.
				this.panNode.setPosition(value, 0, -0.5);  // z need to be -0.5 otherwise the sound only plays in left, right, or center
				this.pan = value;  // Unfortunately panner does not give us a way to access this after it is set http://www.w3.org/TR/webaudio/#AudioPannerNode
			} else {
				return false;
			}
		},

		/**
		 * Get the left/right pan of the instance. Note in WebAudioPlugin this only gives us the "x" value of what is
		 * actually 3D audio.
		 * @method getPan
		 * @return {Number} The value of the pan, between -1 (left) and 1 (right).
		 */
		getPan: function () {
			return this.pan;
		},

		/**
		 * Get the position of the playhead in the instance in milliseconds.
		 * @method getPosition
		 * @return {Number} The position of the playhead in the sound, in milliseconds.
		 */
		getPosition: function () {
			if (this.paused || this.sourceNode == null) {
				var pos = this.offset;
			} else {
				var pos = this.owner.context.currentTime - this.startTime;
			}

			return pos * 1000; // pos in seconds * 1000 to give milliseconds
		},

		/**
		 * Set the position of the playhead in the instance. This can be set while a sound is playing, paused, or even
		 * stopped.
		 *
		 * <h4>Example</h4>
		 *      myInstance.setPosition(myInstance.getDuration()/2); // set audio to it's halfway point.
		 *
		 * @method setPosition
		 * @param {Number} value The position to place the playhead, in milliseconds.
		 */
		setPosition: function (value) {
			this.offset = value / 1000; // convert milliseconds to seconds

			if (this.sourceNode && this.sourceNode.playbackState != this.sourceNode.UNSCHEDULED_STATE) {  // if playbackState is UNSCHEDULED_STATE, then noteON or noteGrainOn has not been called so calling noteOff would throw an error
				this.sourceNode.noteOff(0);  // we need to stop this sound from continuing to play, as we need to recreate the sourceNode to change position
				clearTimeout(this.soundCompleteTimeout);  // clear timeout that triggers sound complete
			}  // NOTE we cannot just call cleanup because it also calls the Sound function playFinished which releases this instance in SoundChannel

			if (!this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED) {
				this.handleSoundReady(null);
			}

			return true;
		},

		/**
		 * Get the duration of the instance, in milliseconds. Note in most cases, you need to play as sound using
		 * {{#crossLink "SoundInstance/play"}}{{/crossLink}} or the Sound API {{#crossLink "Sound.play"}}{{/crossLink}}
		 * method before it's duration can be reported accurately.
		 * @method getDuration
		 * @return {Number} The duration of the sound instance in milliseconds.
		 */
		getDuration: function () {
			return this.duration;
		},

		// Audio has finished playing. Manually loop it if required.
		// called internally by soundCompleteTimeout in WebAudioPlugin
		handleSoundComplete: function (event) {
			this.offset = 0;  // have to set this as it can be set by pause during playback

			if (this.remainingLoops != 0) {
				this.remainingLoops--;  // NOTE this introduces a theoretical limit on loops = float max size x 2 - 1

				this.handleSoundReady(null);

				if (this.onLoop != null) {
					this.onLoop(this);
				}
				this.sendEvent("loop");
				return;
			}

			if (window.createjs == null) {
				return;
			}
			this.playState = createjs.Sound.PLAY_FINISHED;
			if (this.onComplete != null) {
				this.onComplete(this);
			}
			this.sendEvent("complete");
			this.cleanUp();
		},

		// Play has failed, which can happen for a variety of reasons.
		playFailed: function () {
			if (window.createjs == null) {
				return;
			}
			this.playState = createjs.Sound.PLAY_FAILED;
			if (this.onPlayFailed != null) {
				this.onPlayFailed(this);
			}
			this.sendEvent("failed");
			this.cleanUp();
		},

		toString: function () {
			return "[WebAudioPlugin SoundInstance]";
		}

	}

	// This is for the above SoundInstance.
	createjs.EventDispatcher.initialize(SoundInstance.prototype); // inject EventDispatcher methods.


	/**
	 * An internal helper class that preloads web audio via XHR. Note that this class and its methods are not documented
	 * properly to avoid generating HTML documentation.
	 * #class WebAudioLoader
	 * @param {String} src The source of the sound to load.
	 * @param {Object} owner A reference to the class that created this instance.
	 * @constructor
	 */
	function WebAudioLoader(src, owner) {
		this.init(src, owner);
	}

	var p = WebAudioLoader.prototype = {

		// the request object for or XHR2 request
		request: null,

		owner: null,
		progress: -1,

		/**
		 * The source of the sound to load. Used by callback functions when we return this class.
		 * #property src
		 * @type {String}
		 */
		src: null,

		/**
		 * The decoded AudioBuffer array that is returned when loading is complete.
		 * #property result
		 * @type {AudioBuffer}
		 * @protected
		 */
		result: null,

		// Calbacks
		/**
		 * The callback that fires when the load completes. This follows HTML tag naming.
		 * #property onload
		 * @type {Method}
		 */
		onload: null,

		/**
		 * The callback that fires as the load progresses. This follows HTML tag naming.
		 * #property onprogress
		 * @type {Method}
		 */
		onprogress: null,

		/**
		 * The callback that fires if the load hits an error.
		 * #property onError
		 * @type {Method}
		 * @protected
		 */
		onError: null,

		// constructor
		init: function (src, owner) {
			this.src = src;
			this.owner = owner;
		},

		/**
		 * Begin loading the content.
		 * #method load
		 * @param {String} src The path to the sound.
		 */
		load: function (src) {
			if (src != null) {
				this.src = src;
			}

			this.request = new XMLHttpRequest();
			this.request.open("GET", this.src, true);
			this.request.responseType = "arraybuffer";
			this.request.onload = createjs.proxy(this.handleLoad, this);
			this.request.onError = createjs.proxy(this.handleError, this);
			this.request.onprogress = createjs.proxy(this.handleProgress, this);

			this.request.send();
		},

		/**
		 * The loader has reported progress.
		 * #method handleProgress
		 * @param {Number} loaded The loaded amount.
		 * @param {Number} total The total amount.
		 * @private
		 */
		handleProgress: function (loaded, total) {
			this.progress = loaded / total;
			if (this.onprogress == null) {
				return;
			}
			this.onprogress({ loaded: loaded, total: total, progress: this.progress });
		},

		/**
		 * The sound has completed loading.
		 * #method handleLoad
		 * @protected
		 */
		handleLoad: function () {
			s.context.decodeAudioData(this.request.response,
					createjs.proxy(this.handleAudioDecoded, this),
					createjs.proxy(this.handleError, this));
		},

		/**
		 * The audio has been decoded.
		 * #method handleAudioDecoded
		 * @protected
		 */
		handleAudioDecoded: function (decodedAudio) {
			this.progress = 1;
			this.result = decodedAudio;
			this.owner.addPreloadResults(this.src, this.result);
			this.onload && this.onload();
		},

		/**
		 * Errors have been caused by the loader.
		 * #method handleError
		 * @protected
		 */
		handleError: function (evt) {
			this.owner.removeFromPreload(this.src);
			this.onerror && this.onerror(evt);
		},

		toString: function () {
			return "[WebAudioPlugin WebAudioLoader]";
		}
	}

}());
