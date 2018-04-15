App = App || {};
App.Editor = null;
App.Viewer = null;
App.SrcCountElements = null;
App.DstCountElements = null;
(function(){
    viewerCountElements = null;
    $(document).ready(function(){
	App.Viewer = document.getElementById("Viewer");
	SetupParser()
	editor = CreateEditor();
	LoadDefaultMarkdown(editor);
	App.Editor = editor;
    }, false);
    // ハイライトできるような形式で出力する
    function SetupParser() {
	marked.setOptions({
	    renderer: App.Renderer,
	});
	$('#Viewer pre code').each(function(i, e) {
	    hljs.highlightBlock(e, e.className);
	});
    }
    function CreateEditor() {
	var editor = ace.edit("Editor");
	editor.setTheme("ace/theme/twilight");// 唯一背景黒＆箇条書き色分けされる
	editor.setFontSize(14);
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().setUseWrapMode(true);
	editor.getSession().setTabSize(4);
	editor.scrollToLine(50, true, true, function () {});
	editor.focus();
	editor.on("change", function(e) {
	    $("#Viewer").html(marked(editor.getSession().getValue()));
	    viewerCountElements = App.Viewer.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
	})();
	editor.session.on("changeScrollTop", function(scrollTop) {
	    var row = editor.renderer.getScrollTopRow();
	    var range = new ace.Range(0,0,row,editor.getSession().getLine(row).length);
	    SyncScroll(editor, range);
	})();
	return editor;
    }
    function SyncScroll(editor, range) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(marked(editor.getSession().getTextRange(range)), 'text/html');
	var totalLines = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');

	// 上記とビューア側の要素の位置を比較して位置指定する
	//var body = document.getElementById("Viewer");
	//var elems = body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');

	/*
	var elems = App.Viewer.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
	if (elems.length > 0) {
	    App.Viewer.scrollTop = elems[totalLines.length-1].offsetTop;
	}
	*/
	if (viewerCountElements.length > 0) {
	    App.Viewer.scrollTop = viewerCountElements[totalLines.length-1].offsetTop;
	}
    }
    function LoadDefaultMarkdown(editor) {
	$.ajax({
	    url: "./default.md"
	}).done(function (response, textStatus, jqXHR) {
	    editor.setValue(response, -1);
	}).fail(function (jqXHR, textStatus, errorThrown) {
	    $("#Viewer").html("./default.md ファイルが取得できませんでした。")
	    md = "# Markdown ビューア😃\n## h2\n### h3\n#### h4\n##### h5\n###### h6\n\n* A\n* B\n\n段落。<kbd><kbd>Ctrl</kbd>+<kbd>A</kbd></kbd>\n\n```js:index.js\nvar X = 100;\nfor (int i=0; i<10; i++) {\n    console.log(i);\n}\n```\n\n* [highlight.js]\n* [marked]\n* [ace]\n\n[highlight.js]: https://highlightjs.org/\n[marked]: https://github.com/markedjs/marked\n[ace]: https://ace.c9.io/"
	    editor.setValue(md, -1);
	}).always(function (data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {});
    }
})();

