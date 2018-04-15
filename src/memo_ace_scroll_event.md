# aceにおけるchangeScrollTopイベントのタイミングについて

* o: スクロール実行の直前
* x: スクロール実行の直後

changeScrollTopイベントで`editor.getFirstVisibleRow()`を実行すると、直前の値が取得されているっぽい。

そのせいで、最初の行が表示されているのに、changeしないから最初行数が取得できない。

## 原因

https://github.com/ajaxorg/ace/issues/3419

`editor.getFirstVisibleRow()`は描画したあとに算出されるらしい。

つまり、`changeScrollTop`イベントは描画前に発火しているということになる。

描画後に発火するイベントは以下。

```js
editor.renderer.on("afterRender", () => {})
```

# キャレット移動の処理が重い

位置合わせ用処理が連続して発生しているため。

debounce

https://memocarilog.info/jquery/7203

var timer = false;
$(window).イベント(function() {
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
        // イベント中の処理
    }, 秒数指定);
});

## 矢印キーを話したら反映された

debounceで0.2秒遅延させた。

すると、矢印キーで押下したらフリーズするくらい重かったのが、軽くなった。

しかし、スクロールしなくなった。

矢印キーを話したら反映された。どうやらKeyDownイベントのたびに位置合わせが実行されていたっぽい。

### throttle

メソッド|説明
--------|----
debounce|
throttle|

http://ktkne.st/elab/post/2012/strcount-throttle-debounce.html

イベント|説明
--------|----
keyDown|押下中ずっと発火
keyUp|離した時に発火
keyPress|押下後離した時に発火

パフォーマンス改善案。

* 矢印キーをkeyDownしているときは500msごとに位置合わせ。
* 矢印キーを離した時にも位置合わせ。

## 位置合わせアルゴリズムの改善

テキストが変更されたとき、MD行数とHTML座標の対応表を更新する。

スクロール位置が変更されたとき、現在行数を取得し、対応したHMLT座標を指定する。

こうすることで、スクロールするたびにMDからHTMLへパースするコストが不要になり、高速化を狙える。

