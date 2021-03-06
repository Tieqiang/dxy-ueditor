UE.plugin.register('editorstyle', function(){
var editor = this;
var styles = 'body{line-height: 1.7;font-size: 14px;color: #333;font-family: "Avenir", "Hiragino Sans GB", "Noto Sans S Chinese", "Microsoft Yahei", "Microsoft Sans Serif", "WenQuanYi Micro Hei", "sans-serif";padding: 20px;}'+
'img{max-width: 100%;}'+
'h4, h5, h6, hr, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td{'+
'	margin: 0px;'+
'	padding: 0px;'+
'}'+
'table{'+
'    width: 100%;'+
'    table-layout: fixed;'+
'    border-collapse: collapse;'+
'    border-spacing: 0;'+
'    margin: 15px 0;'+
'}'+
'th, td{'+
'    height: 30px;'+
'    border: 1px solid #ccc;'+
'    vertical-align: top;'+
'    padding: 2px 4px;'+
'    text-align: left;'+
'    box-sizing: border-box;'+
'}'+
'a{'+
'    color: #7c68b4;'+
'    text-decoration: none;'+
'}'+
'hr {display: block; height: 0; border: 0; border-top: 1px solid #ccc; margin: 15px 0; padding: 0; }'+
'blockquote{'+
'    border-left: 6px solid #ddd;'+
'    padding: 5px 0 5px 10px;'+
'    margin: 15px 0 15px 15px;'+
'}'+
'blockquote p {'+
'	color: rgb(153, 153, 153);'+
'}'+
' '+
'h1{'+
'	font-size: 24px;'+
'	font-weight: bolder;'+
'	margin-bottom: 25px;'+
'	line-height: 1.7;'+
'	margin-top: 0px;'+
'	padding: 1% 0;'+
'    color: #333; '+
'    border-bottom: 1px solid #e2e2e2;'+
'    word-wrap: break-word;'+
'}'+
'h2{'+
'    padding: 1% 0;'+
'    color: #333;'+
'    font-size: 18px;'+
'    font-weight: bolder;'+
'    border-bottom: 1px solid #e2e2e2;'+
'    margin-bottom: 25px;'+
'    margin-top: 0px;'+
'    line-height: 1.7;'+
'    word-wrap: break-word;'+
'}'+
'h3{'+
'    font-size: 16px;'+
'    font-weight: bolder;'+
'    margin-bottom: 25px;'+
'    margin-top: 0px;'+
'    padding: 1% 0;'+
'    line-height: 1.7;'+
'    color: #333; '+
'    border-bottom: 1px solid #e2e2e2;'+
'    word-wrap: break-word;'+
'}'+
'ul, ol{'+
'	list-style: disc outside none;'+
'	margin: 15px 0 !important;'+
'	padding: 0 0 0 40px;'+
'	line-height: 1.7;'+
'	font-size: 14px;'+
'}'+
'p{'+
'	margin-top: 0px;'+
'	font-size:14px;'+
'	margin-bottom:15px;'+
'	line-height:1.7;'+
'	color: #444;'+
'	word-wrap: break-word;'+
'}'+
'li p{'+
'	margin-bottom: 0px;'+
'}'+
'.dxy-meta-replaced-view{'+
'    border: 1px solid #ddd;'+
'    padding: 20px;'+
'    cursor: pointer;'+
'}'+
'.editor-vote-container p span{'+
'    padding: 3px 6px;'+
'    background: #c5c5c5;'+
'    color: #fff;'+
'    border-radius: 10px;'+
'}'+
'.editor-vote-wraper img{'+
'    width: 50px!important;'+
'    height: 50px!important;'+
'}';
	if(this.wechatready){
		this.registerWechatStyle(styles, true);
	}else{
		this.addListener('wechatready', function(){
			editor.registerWechatStyle(styles, true);
		});
	}
});