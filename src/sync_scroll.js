/*
 スクロールを連動させる。
 */
(function(){
    $(document).ready(function(){
	$("#Viewer").scroll(function() {
	    console.log('Viewer: ' + $(this).scrollTop())
	});

    function SyncScroll(editor, range) {
	// HTML要素のうち先頭に表示された要素を取得
	var rect = App.Viewer.getBoundingClientRect();
	var lastElm = document.elementFromPoint(rect.left, rect.top);
	// 以下、実装方法不明。
	// 先頭表示要素までのHTML要素のうち行位置指定に使う要素一覧を取得
	//elems = App.Viewer.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
	// 先頭表示要素におけるテキストエディタの行数or座標を算出
	// 先頭表示要素行数へスクロール
	//App.Editor.scrollToRow(row);
	//App.Editor.scrollToY(Y);

	/*
	var parser = new DOMParser();
	var doc = parser.parseFromString(marked(editor.getSession().getTextRange(range)), 'text/html');
	var totalLines = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');

	// 上記とビューア側の要素の位置を比較して位置指定する
	var body = document.getElementById("Viewer");
	var elems = body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
	if (elems.length > 0) {
	    App.Viewer.scrollTop = elems[totalLines.length-1].offsetTop;
	}
	*/
    }
    }, false);
})();

