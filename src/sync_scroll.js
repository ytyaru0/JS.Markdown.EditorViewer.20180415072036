/*
 スクロールを連動させる。
 */
(function(){
    $(document).ready(function(){
	$("#Viewer").scroll(function() {
	    console.log('Viewer: ' + $(this).scrollTop())
	});
    }, false);
})();

