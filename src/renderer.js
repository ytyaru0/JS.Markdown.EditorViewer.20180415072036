App = App || {};
App.Renderer = null;
(function(){
    function CreateRenderer() {
	if (null != App.Renderer) { return App.Renderer; }
	App.Renderer = new marked.Renderer();
	_Code();
	return App.Renderer;
    }
    function _Code() {
	//renderer.code = function(code, language) {
	//return '<pre><code class="hljs">' + hljs.highlightAuto(code).value + '</code></pre>';
	//};
	//App.Renderer.code = function(code, language) {
	//    return '<pre><code class="hljs">' + hljs.highlightAuto(code).value + '</code></pre>';
	//};
	// ```lang:filename
	App.Renderer.code = function(code, language) {
	    return '<pre>' + FileNameTag(language)+ '<code class="hljs">' + hljs.highlightAuto(code).value + '</code></pre>';
	};
	function FileNameTag(language) {
	    var delimiter = ':';
	    var info = language.split(delimiter);
	    var lang = info.shift();
	    var fileName = info.join(delimiter);
	    if (fileName) { return '<code class="filename">'+fileName+'</code>'; }
	    else { return ''; }
	}
    }
    CreateRenderer();
})();
