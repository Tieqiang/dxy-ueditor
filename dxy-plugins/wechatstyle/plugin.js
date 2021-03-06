UE.plugin.register('wechatstyle', function(){
var editor = this;
var styles = 'h2{'+
'	font-size: 20px;'+
'	color : #262626;'+
'	line-height: 1.75;'+
'	margin-bottom: 0px;'+
'}'+
'p{'+
'	font-size: 17px;'+
'	color: #3f3f3f;'+
'	line-height: 1.75;'+
'	margin-bottom: 0px;'+
'}'+
'li p{'+
'	margin-bottom: 10px;'+
'}'+
'li:last p{'+
'	margin-bottom: 0px;'+
'}'+
'ul, ol{'+
'	margin: 0 0 !important;'+
'}'+
'strong{'+
'	color : #262626;'+
'}';
	if(this.wechatready){
		this.registerWechatStyle(styles);
	}else{
		this.addListener('wechatready', function(){
			editor.registerWechatStyle(styles);
		});
	}
});