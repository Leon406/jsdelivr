## 字体格式

- TTF（TrueType Font） **所有主流浏览器都支持**

  > 由美国苹果公司和微软公司共同开发的一种电脑轮廓字体（曲线描边字）类型标准， 能给开发者提供关于字体显示、不同字体大小的像素级显示等的高级控制。

- TTC （TrueType Collection）

  > TTC字体是TrueType字体集成文件(. TTC文件)，是在一单独文件结构中包含多种字体,以便更有效地共享轮廓数据,当多种字体共享同一笔画时,TTC技术可有效地减小字体文件的大小。

- OTF（OpenType Font）

  >Adobe 和 Microsoft 联合开发的跨平台字体文件格式，也叫 Type 2 字体，它的字体格式采用 Unicode 编码，是一种兼容各种语言的字体格式。

- [VAR （Variable Font）](https://caniuse.com/?search=var)

  > 通过程序可以任意调整字重、倾斜度，甚至拉伸程度，而字体文件体积却更小。

- *EOT (Embedded Open Type)* 

  > 微软设计用来在 Web 上使用的字体。是一个在网页上试图绕过 TTF 和 OTF 版权的方案。你可以使用微软的工具从现有的 TTF/OTF 字体转成 EOT 字体使用，其中对字体进行压缩和裁剪使得文件体积更小。同时为了避免一些收版权保护的字体被随意复制，EOT 还集成了一些特性来阻止复制行为，以及对字体文件进行加密保护。可惜 EOT 格式只有 [IE 支持](https://caniuse.com/?search=eot)

- SVG  (Scalable Vector Graphics font , **向下兼容 Safari**)

  > 使用 SVG 的字体元素定义。这些字体包含作为标准 SVG 元素和属性的字形轮廓，就像它们是 SVG 映像中的单个矢量对象一样。SVG 字体最大的缺点是缺少字体提示（font-hinting）。字体提示是渲染小字体时为了质量和清晰度额外嵌入的信息。同时，SVG 对文本（body text）支持并不是特别好。因为 SVG 的文本选择（text selection）目前在 Safari、Safari Mobile 和 Chrome 的一些版本上完全崩坏，所以你不能选择单个字符、单词或任何自定义选项，你只能选择整行或段落文本。

- [WOFF](https://caniuse.com/?search=woff)（Web Open Font Format, **主流兼容**）

  > 使用zlib压缩，文件大小一般比 TTF 小 40%。flate算法压缩

- [WOFF2](https://caniuse.com/?search=woff2)

  > 在 WOFF1 的基础上，进一步优化了体积压缩，带宽需求更少，同时可以在移动设备上快速解压。 Brotli 算法压缩

## 字体族

字体族即一类字体， 其值主要有6种：

- `serif`：衬线字体，衬线的笔画有粗有细的变化，在每一笔画上都自有风格，笔画末端会有修饰，强调艺术感，适合用于博客，旅游，文化，艺术类网站
- `sans-serif`: 无衬线字体 字体工整方正，给人正式的感觉，适合政务类，企业类网站使用。
- `monospace`: 等宽字体
- `cursive`: 手写字体
- `fantasy`: 奇幻字体
- `system-ui`: 系统UI字体



## 字重

- 100  淡体 Thin (Hairline)
- 200 特细 Extra Light (Ultra Light)
- 300 细体 Light
- 400 标准 Normal (Regular)
- 500 适中 Medium
- 600 次粗 Semi Bold (Demi Bold)
- 700 粗体 Bold
- 800 特粗 Extra Bold (Ultra Bold)
- 900 浓体 Black (Heavy)
- 950 特浓 Extra Black (Ultra Black)
- 1000 Fat

## css3引入字体

```
@font-face {
  font-family: myFirstFont;
  src: url(sansation_light.woff);
}

div {
  font-family: myFirstFont;
}
```

## 常见字体

| **字体**                                         | 系统   | 类型       | **说明**                                                     |
| ------------------------------------------------ | ------ | ---------- | ------------------------------------------------------------ |
| Arial                                            | Win    |            | Helvetica的「克隆」，和Helvetica非常像，细节上比如R和G有小小差别。<br> **Windows 系统默认字体** |
| **Microsoft YaHei**                              | Win    |            | 微软雅黑，**Windows 系统默认的中文字体**，也是最常见的中文字体，委托方正开发 |
| Helvetica                                        | Mac    |            | 被评为设计师最爱的字体，Realist风格，简洁现代的线条，非常受到追捧。在Mac下面被认为是最佳的网页字体<br>**Mac 系统的默认无衬线英文字体** |
| **Helvetica Neue**                               | Mac    |            | **Mac 系统 Helvetica 字体改善版本**，且增加了更多不同粗细与宽度的字形 |
| **PingFang SC**                                  | Mac    |            | **苹果专为中国用户打造的中文字体**，也是 UI 设计师做界面默认使用的字体 |
| **WenQuanYi Micro Hei**                          | Linux  |            | 文泉驿微米黑，**Linux 系统下默认中文字体**，为了兼容 Linux 系统。 |
| **Hiragino Sans GB、Heiti SC**                   | Mac    |            | 苹果丽黑和黑体-简，是 **Mac 旧版本的中文字体**，目前用的不多，主要目的是兼容旧 Mac 系统。 |
| Lucida Family                                    | Mac    |            | **Mac OS UI的标准字体**，属于humanist风格，稍微活泼一点      |
| Georgia                                          |        | 英文 Serif | 正文**屏显**的衬线字体                                       |
| Times                                            |        | 英文 Serif | 为了**报纸**而设计的                                         |
| Open Sans                                        |        |            | 可读性强、中性和极简主义的字体                               |
| Roboto                                           |        |            | 一种友好且专业的字体,是Android 和其他谷歌服务的默认字体      |
| Verdana                                          |        |            |                                                              |
| **sans-serif**                                   |        |            | 无衬线字族，当所有的字体都找不到时，可以使用字体族名称作为操作系统最后选择字体的方向。 |
| [Bookerly](https://typedetail.com/bookerly.html) | Kindle | 英文 Serif | 亚马逊为Kindle设备专门设计的一种**数字阅读字体**。它有着清晰的字形和舒适的阅读体验，特别适合长时间阅读。这种字体的空间利用率非常高，能够在较小的字号下保持良好的可读性，为数字阅读体验带来了很大的提升。 |
| Optima                                           |        | sans-serif | 所有字形都是按照**黄金比例设计**的，这使其具有高度的美感和和谐性。其笔画粗细对比强烈，但整体看起来却非常协调，字宽中等，易于识别 |



## 中文字体

| **字体**                                                     | **类型** | **版本**                                                     | **说明**                                                     |
| ------------------------------------------------------------ | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [**HarmonyOS Sans**](https://developer.huawei.com/consumer/cn/design/resource-V1/) | 中文     |                                                              | **华为和汉仪字库合作定制**                                   |
| [Honor Sans](https://developer.honor.com/cn/doc/guides/100681) | 中文     |                                                              | 荣耀联合方正字库共同开发，是 MagicOS 系统字体                |
| **[MiSans](https://hyperos.mi.com/font/zh/download/)**       | 中文     |                                                              | [与汉仪字库联合开发](https://hyperos.mi.com/font/zh/about/)，是小米兰亭Pro （与方正字库共同开发）的升级版、替换版 |
| [**Oppo Sans**](https://www.coloros.com/article/A00000074/)  | 中文     | 4.0                                                          | **与国内知名字体厂商「汉仪」合作开发出的富有现代感和科技感的全新中文字库** |
| [Vivo Sans](https://developers.vivo.com/doc/d/314fa33cbaec4a93be351cd44757d9d9) | 中文     |                                                              | vivo与方正字库携手设计                                       |
| **[霞鹜文楷](https://github.com/lxgw/LxgwWenKai)**           | CJK      | <a href="https://github.com/lxgw/LxgwWenKai/releases/latest"><img src="https://img.shields.io/github/release/lxgw/LxgwWenKai.svg"/></a> |                                                              |
| **[思源宋体](https://github.com/adobe-fonts/source-han-serif)** | CJK      | <a href="https://github.com/adobe-fonts/source-han-serif/releases/latest"><img src="https://img.shields.io/github/release/adobe-fonts/source-han-serif.svg"/></a> |                                                              |
| <del>[未来荧黑](https://github.com/welai/glow-sans)</del>    | CJK      |                                                              | 基于思源黑体、Fira Sans 和 Raleway 的开源字体项目<br>**2023.8 归档不更新** |
| **[更纱黑体](https://github.com/be5invis/Sarasa-Gothic)**    | CJK      | <a href="https://github.com/be5invis/Sarasa-Gothic/releases/latest"><img src="https://img.shields.io/github/release/be5invis/Sarasa-Gothic.svg"/></a> | **由 Noto Sans / Iosevka 和思源黑体的汉字部分合并而来**<br>适合操作系统页面和编程字体 |
| [天珩字库](http://cheonhyeong.com/Simplified/download.html)  | CJK      |                                                              | **无法商用**，支持汉字最全,支持Unicode15.1                   |
| [全宋体](https://fgwang.blogspot.com/2018/02/blog-post.html) |          |                                                              | WFG, **无法商用**，支持汉字最全,支持Unicode15.1              |
| [全字库](https://magiclen.org/zh-tw-font/)                   |          |                                                              |                                                              |

## [编程字体选择](https://www.programmingfonts.org/)

| **字体**                                                     | **类型** | **版本**                                                     | **说明**                                                     |
| ------------------------------------------------------------ | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **[JetBrains Mono](https://www.jetbrains.com/lp/mono/) github** | 英文     | <a href="https://github.com/JetBrains/JetBrainsMono/releases/latest"><img src="https://img.shields.io/github/release/JetBrains/JetBrainsMono.svg"/></a> | **支持ligature**                                             |
| **[FiraCode](https://github.com/tonsky/FiraCode)**           |          | 6.2                                                          | **支持ligature**                                             |
| **[Cascadia Code](https://github.com/microsoft/cascadia-code/releases)** |          | <a href="https://github.com/microsoft/cascadia-code/releases/latest"><img src="https://img.shields.io/github/release/microsoft/cascadia-code.svg"/></a> | **终端**                                                     |
| **[Source Code Pro](https://github.com/adobe-fonts/source-code-pro)** |          | <a href="https://github.com/adobe-fonts/source-code-pro/releases/latest"><img src="https://img.shields.io/github/release/adobe-fonts/source-code-pro.svg"/></a> | **无衬线字体,被Adobe 公司号称最佳的编程字体**                |
| **[Maple-font](https://github.com/subframe7536/Maple-font)** | 中英     | <a href="https://github.com/subframe7536/Maple-font/releases/latest"><img src="https://img.shields.io/github/release/subframe7536/Maple-font.svg"/></a> | **中英文严格2:1等宽字体,支持ligature**                       |
| **[Hack](https://github.com/source-foundry/Hack)**           |          | 3.003                                                        | **源码,行间距比Consolas略高，字体圆滑，颜值还是很高**        |
| **Courier New(CN)**                                          |          |                                                              | **Windows 的缺省等宽字体**                                   |
| **Consolas**                                                 |          |                                                              | **CN的升级**,Consolas更窄，能够在较少的空间显示更多的内容。<br>同时Consolas也是**VS系列默认字体** |
| **[Monaco](https://github.com/vjpr/monaco-bold)**            |          |                                                              |                                                              |
| **[intel-one-mono](https://github.com/intel/intel-one-mono)** |          | <a href="https://github.com/intel/intel-one-mono/releases/latest"><img src="https://img.shields.io/github/release/intel/intel-one-mono.svg"/></a> |                                                              |
| [monaspae](https://github.com/githubnext/monaspace)          |          | <a href="https://github.com/githubnext/monaspace/releases/latest"><img src="https://img.shields.io/github/release/githubnext/monaspace.svg"/></a> | github 编程字体                                              |
| [losevka](https://github.com/be5invis/Iosevka)               |          | <a href="https://github.com/be5invis/Iosevka/releases/latest"><img src="https://img.shields.io/github/release/be5invis/Iosevka.svg"/></a> | 编程字体                                                     |
|                                                              |          |                                                              |                                                              |



# 参考

[猫啃](https://www.maoken.com/all-fonts)

[CSS Web 字体](https://www.w3school.com.cn/css/css3_fonts.asp)

[The Designer’s Guide to Font Formats in 2023: TTF, OTF, WOFF, EOT & SVG](https://creativemarket.com/blog/the-missing-guide-to-font-formats)