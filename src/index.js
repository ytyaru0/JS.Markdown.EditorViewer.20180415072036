App = App || {};
App.Editor = null;
App.Viewer = null;
App.SrcCountElements = null;
App.DstCountElements = null;
(function(){
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
	editor.focus();
	editor.on("change", function(e) {
	    $("#Viewer").html(marked(editor.getSession().getValue()));
	})();
	editor.session.on("changeScrollTop", function(scrollTop) {
	    //console.log('Editor: ' + scrollTop, + ' line: ' + editor.getFirstVisibleRow() + ' current: ' + editor.selection.getCursor().row)
	    /*
	    console.log('changeScrollTop');
	    //console.log(editor.renderere.getScrollTopRow());
	    var s = editor.getSession();
	    console.log(s);
	    
	    var top_row = s.getScrollTopRow();
	    var top_col = s.getLine(top_row).length;
	    var btm_row = s.getScrollBottomRow();
	    var btm_col = s.getLine(btm_row).length;
	    //var top_row = editor.renderer.getScrollTopRow();
	    //var top_col = editor.renderer.getLine(top_row).length;
	    //var btm_row = editor.renderer.getScrollBottomRow();
	    //var btm_col = editor.renderer.getLine(btm_row).length;
	    //var top_row = s.renderer.getScrollTopRow();
	    //var top_col = s.renderer.getLine(top_row).length;
	    //var btm_row = s.renderer.getScrollBottomRow();
	    //var btm_col = s.renderer.getLine(btm_row).length;
	    var range = new ace.Range(top_row, top_col, btm_row, btm_col);
	    SyncScroll(editor, range);
	    */
	})();
	editor.session.selection.on("changeCursor", function(e){
	    // エディタの先頭からキャレット位置までのMDにおけるHTML要素を取得する
	    var c = editor.selection.getCursor();
	    var range = new ace.Range(0,0,c.row,editor.getSession().getLine(c.row).length);
	    SyncScroll(editor, range);
	});
	return editor;
    }
    function SyncScroll(editor, range) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(marked(editor.getSession().getTextRange(range)), 'text/html');
	var totalLines = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');

	// 上記とビューア側の要素の位置を比較して位置指定する
	var body = document.getElementById("Viewer");
	var elems = body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
	if (elems.length > 0) {
	    App.Viewer.scrollTop = elems[totalLines.length-1].offsetTop;
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

