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
	App.Editor = document.getElementById("Editor");
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
	    if (0 == scrollTop) {App.Viewer.scrollTop=0;return;}
	    else if (editor.getSession().getLength() == editor.renderer.getScrollBottomRow()) {App.Viewer.scrollTop=Number.MAX_VALUE;return;}
	    
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

    // スクロールイベントを定義
    function IsBottomScroll(elm) {
	var sh = elm.scrollHeight;
	var pos = elm.offsetHeight + elm.scrollTop;
	// どれだけ近づいたかを判断する値
	// 0に近いほど、スクロールの最終が近い
	var proximity = 0;
	if ((sh - pos) / sh <= proximity) {
	    alert('Scroll finish!!');
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

