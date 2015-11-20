(function(){
    var domUtils = baidu.editor.dom.domUtils;
    var utils = baidu.editor.utils;
    var editorui = baidu.editor.ui;
    var _Dialog = editorui.Dialog;
    UE.plugin.register('replacedview', function (){
        var me = this;
        function showModal(type, obj){
        	if(!obj){
        		obj = ReplacedView.getInstance(type);
        	}
        	if(!obj){
        		throw new Error('error type : '+type);
        	}
        	obj.showModal();
        }
        me.addOutputRule(function(root){
			root.traversal(function(node){
				if(node.getAttr('class')==='dxy-meta-replaced-view' ){ 
					var view = ReplacedView.getInstance(node.getAttr('data-type'));
					if(view){
						view.data = ReplacedView.deSerialize(node.getAttr('data-params'));
						node.setStyle('display','none');
						node.innerHTML(view.toMetaView().innerHTML);
					}
				}
			});
		});
		me.addInputRule(function(root){
			root.traversal(function(node){
				if(node.getAttr('class')==='dxy-meta-replaced-view' ){ 
					var view = ReplacedView.getInstance(node.getAttr('data-type'));
					if(view){
						view.data = ReplacedView.deSerialize(node.getAttr('data-params'));
						node.setStyle('display','block');
						node.innerHTML(view.toEditorView().innerHTML);
					}
				}
			});
		});
		function addWechatOutputRule(){
			me.addWechatOutputRule(function(root){
				root.traversal(function(node){
					if(node.getAttr('class')==='dxy-meta-replaced-view' ){ 
						var view = ReplacedView.getInstance(node.getAttr('data-type'));
						if(view){
							view.data = ReplacedView.deSerialize(node.getAttr('data-params'));
							node.innerHTML(view.toWechatView().innerHTML);
						}
					}
				});
			}, 'afterStructEdit');
		}
		if(me.wechatready){
			addWechatOutputRule();
		}else{
			me.addListener('wechatready', function(){
				addWechatOutputRule();
			});
		}
        return {
            bindEvents:{
                'ready': function(){

                }
            },
            commands: {
                'replacedview': {
                    execCommand : function(cmd, opt){
                    	var type = opt;
                    	if(!type){
                    		throw new Error('exec replacedview command require 2 arguments');
                    	}
                    	var range = me.selection.getRange(),
                    		cur = range.getCommonAncestor(true),
                    		replacedview = domUtils.findParent(cur, function(node){
                    			return ReplacedView.isReplacedView(node);
                    		}, true);
                    	if(replacedview){
                    		var obj = ReplacedView.getInstance(replacedview);
                    		if(obj.type == type){
                    			showModal(type,obj);
                    		}else{
                    			alert('请选择正确的类型');
                    			return;
                    		}
                    	}else{
                    		showModal(type)
                    	}
                    }
                }
            }
        };
    });

})();