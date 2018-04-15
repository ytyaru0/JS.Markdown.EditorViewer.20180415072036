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
