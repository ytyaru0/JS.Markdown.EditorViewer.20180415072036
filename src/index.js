App = App || {};
App.Editor = null;
App.Viewer = null;
App.SrcCountElements = null;
App.DstCountElements = null;
(function(){
    //editorCountElements = null; // 位置合わせ用データのキャッシュ
    viewerCountElements = null; // 位置合わせ用データのキャッシュ
    mdLine_htmlHeight = []; // 行ごとの座標キャッシュ
    preRow = 0; // キャレット移動時の位置合わせ負荷を間引く
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
	    //console.log('change', e);
	})();
	editor.session.on("changeScrollTop", function(scrollTop) {
	    var row = editor.renderer.getScrollTopRow();
	    // キャレット移動時の負荷軽減
	    if (0 < scrollTop && Math.abs(preRow-row) < 4) { return; }
	    else {preRow=row;}
	    var range = new ace.Range(0,0,row,editor.getSession().getLine(row).length);
	    //console.log('changeScrollTop', row, editor.getSession().getLength(), mdLine_htmlHeight.length-1);
	    SyncScroll(editor, range);
	})();
	return editor;
    }
    function SyncScroll(editor, range) {
	row = Math.round(range.end.row);
	var parser = new DOMParser();
	var doc = parser.parseFromString(marked(editor.getSession().getTextRange(range)), 'text/html');
	var editorElms = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
	if (0 < editorElms.length) {
	    App.Viewer.scrollTop = viewerCountElements[editorElms.length-1].offsetTop;
	}
    }
    function SyncScrollAndCache(editor, range) {
	// 1行ごとに座標をキャッシュ
	row = Math.round(range.end.row);
	if (mdLine_htmlHeight.length < row) {
	    for (var i=0; i<row - mdLine_htmlHeight.length-1 ; i++) {
		mdLine_htmlHeight.push(-1);
	    }
	    //console.log('新規作成', row, row-mdLine_htmlHeight.length);
	}
	if (mdLine_htmlHeight.length-1 < row) {App.Viewer.scrollTop = mdLine_htmlHeight[mdLine_htmlHeight.length-1];}
	else if (-1 != mdLine_htmlHeight[row]) { App.Viewer.scrollTop = mdLine_htmlHeight[row]; }
	else {
	    var parser = new DOMParser();
	    var doc = parser.parseFromString(marked(editor.getSession().getTextRange(range)), 'text/html');
	    var editorElms = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
	    if (0 < editorElms.length) {
		App.Viewer.scrollTop = viewerCountElements[editorElms.length-1].offsetTop;
		mdLine_htmlHeight[row] = App.Viewer.scrollTop;
	    }
	    //console.log(row, mdLine_htmlHeight[row]);
	}
	//console.log(row, mdLine_htmlHeight.length, mdLine_htmlHeight);
    }
    /*
    function UpdateScrollMap(editor, range) {
	var c = editor.selection.getCursor();
	var line = editor.getSession().getLine(c.row);
	console.log(line, c);
	var html = marked(line);
	console.log(html);
	
	var parser = new DOMParser();
	var doc = parser.parseFromString(html, 'text/html');
	console.log(doc);
	console.log(doc.tagName);
	var elements = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table')
	console.log(elements.length);
	if (0==elements.length) return;
	// すべてゼロ...。多分CSSがないせい。
	console.log(elements[0]);
	console.log(elements[0].clientHeight);
	console.log(elements[0].offsetHeight);
	console.log(elements[0].offsetTop);
    }
    */
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

