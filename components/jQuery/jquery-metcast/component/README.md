<h1>MetCast</h1>
<p>A small jQuery plugin that fetches the current weather conditions for a specified location and displays them in a fully customisable widget. </p>

<h2>Demo</h2>
<p>
	<a href="http://iamchristill.com/plugins/metcast/">http://iamchristill.com/plugins/metcast/</a>
</p>

<h2>Usage</h2>

<h3>HTML</h3>
<pre>
	&lt;div id="weather"&gt;&lt;/div&gt;
</pre>

<h3>jQuery</h3>
<pre>
	$('#weather').metCast({
		key: 'your-key-here',
		location: 'London'
	});
</pre>

<h3>CSS</h3>
<pre>
.metCast-wrapper {
	width:200px;
	height:94px;
	background:transrparent url('img/bg.png') repeat 0 0;
	border:2px solid rgba(236,246,254,0.8);
	font-family:arial;
}

#metCast-icon{
	width:94px;
	height:94px;
	background:transparent url('img/icon-sprite.png') no-repeat;
}

#metCast-text{
	width:97px;
	float:right;
	height:80px;
	overflow: hidden;
	padding:6px 12px 0 0;
	text-align: right;
}

#metCast-text p{
	margin:7px 0;
	color:#fff;
}

/*---- Weather Sprite Icon Co-ordinates -----*/

#metCast-icon.sunny { background-position: 0 0; }
#metCast-icon.rain { background-position: -94px 0; }
#metCast-icon.cloudy { background-position: -188px 0; }
#metCast-icon.thunder {	background-position: -282px 0; }
#metCast-icon.partlycloudy { background-position: -470px 0; }
#metCast-icon.snow { background-position: -564px 0; }
</pre>

<h2>Dependencies</h2>
<ul>
<li>jQuery</li>
<li>An API key from <a href="http://worldweatheronline.com">http://worldweatheronline.com</a>. This is free to setup and can be done from <a href="http://developer.worldweatheronline.com/member/register">here</a>.
</ul>
<h2>Options</h2>
<table>
<tr>
<th>Option</th>
<th>Default</th>
<th>Required</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>key</td>
<td>null</td>
<td>required</td>
<td>string</td>
<td>An API Key can be obtained from <a href="http://developer.worldweatheronline.com/member/register">here</a>.
</tr>
<tr>
<td>Location</td>
<td>London</td>
<td>required</td>
<td>string</td>
<td>A geographical location to display the weather for.</td>
</tr>
</table>
<h2>Author</h2>
Chris Till - <a href="http://iamchristill.com">iamchristill.com</a>

<h2>Contributors</h2>
Sam Duffy


<h2>Licence</h2>

<pre>
The MIT License (MIT)

MetCast © Chris Till 2013.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the “Software”), 
to deal in the Software without restriction, including without limitation the rights to use, 
copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of 
the Software
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</pre>

<a href="http://mit-license.org/">http://mit-license.org/</a>

