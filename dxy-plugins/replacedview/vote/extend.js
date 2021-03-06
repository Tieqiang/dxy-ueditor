(function(){
	var IMG_PREFIX = 'http://img.dxycdn.com/dotcom/';
	var UPLOAD_ACTION = 'http://dxy.com/admin/i/att/upload?type=column_content';
	var IS_PC = isPC();
	var isLogin = (function(){
		try{
			if(+window.GDATA.userId){
				return true;
			}else{
				return false;
			}
		}catch(e){
			return false;
		}
	})();
	function fomat(date, fmt){
		var o = {   
			"YYYY" : date.getFullYear(),
		    "MM" : date.getMonth()+1,                   
		    "DD" : date.getDate(),                   
		    "hh" : date.getHours(),              
		    "mm" : date.getMinutes(), 
		    "ss" : date.getSeconds()           
		};   
		return fmt.replace('YYYY', o.YYYY).replace('MM', o.MM).replace('DD', o.DD).replace('hh', o.hh).replace('mm',o.mm).replace('ss', o.ss);
	}
	function isPC(){  
        	var userAgentInfo = navigator.userAgent;  
        	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        	var flag = true;  
        	for (var i = 0; i < Agents.length; i++) {  
				if (userAgentInfo.indexOf(Agents[i]) > 0){
					flag = false;
					break; 
				}  
        	}  
        	return flag;  
	}
	if(document.domain === 'dxy.us'){
		IMG_PREFIX = 'http://dxy.us/upload/public/';
		UPLOAD_ACTION = "http://dxy.us/admin/i/att/upload?type=column_content"
	}

	var VoteView = Backbone.View.extend({
		events: {
			'click #vote-list-tab' : 'fetchVoteList',
			'click #vote-list-page-prev' : 'VoteListPrevPage',
			'click #vote-list-page-next' : 'VoteListNextPage',
			'click .J-add-vote-from-votelist' : 'insertGroup',
			'keyup #J-vote-group-search' : 'search',
			'click #search-list-container li' : 'insertSearchGroup'
		},
		initialize : function(view){
			var me = this;
			me.view = view;
			console.log('init');
			window.__hack = true;
			require(['VoteModel'], function(m){
				me.model = new m.VoteMarkModel({});
				me.searchModel = new m.VoteGroupsModel([]);
				me.fetchVoteList();
			});
		},
		render: function() {
		  	var me = this;
		  	require(['dxy-plugins/replacedview/vote/views/dialog.view'], function(tpl){
		  		me.el.innerHTML = _.template(tpl)({mark: me.model, votelist : me.votelist, panel : me.currentPanel});
		  		me.delegateEvents(me.events);
				me.trigger('render');
		  	});
			return me;
		},
		search : function(e){
			var me = this,
				q = $(e.currentTarget).val();
			if(!q){
				$('#search-list-container').html('');
				return;
			}
			this.searchModel.search(q,10).then(function(res){
				if(res.error){
					$('#search-list-container').html('');
					return;
				}
				require(['dxy-plugins/replacedview/vote/views/searchList.view'], function(tpl){
			  		$('#search-list-container')[0].innerHTML = _.template(tpl)({list: me.searchModel.models});
			  	});
			}, function(res){
				$('#search-list-container').html('');
			});
		},
		fetchVoteList : function(){
			var me =this;
			require(['VoteModel'], function(m){
				var list = new m.VoteGroupsModel([],{items_per_page:8});
				list.fetch().then(function(){
					list.on('all', me.render, me);
					me.votelist = list;
					me.currentPanel = 'votelist';
					me.render();
				}, function(model, res){
					console.log(res);
					alert(res.error.message);
				});
			});
		},
		insertSearchGroup : function(e){
			var t = $(e.currentTarget),
				me =this,
				id = t.data('id'),
				group = me.searchModel.at(+id);
			if(group){
				me._insertGroup(group);
			}
		},
		insertGroup : function(e){
			if(!window.__hack){
				return;
			}
			window.__hack = false;
			console.log('insert group');
			var t = $(e.currentTarget),
				me =this,
				id = t.data('id'),
				group = me.votelist.get(+id);
			if(group){
				me._insertGroup(group);
			}
		},
		_insertGroup : function(group){
			window.group = group;
			this.model.isInsert = true;
			$('#confirm-vote').click();
		},
		VoteListPrevPage : function(){
			var me = this;
			if(this.votelist.fetching){
				return;
			}
			this.votelist.fetching = true;
			this.votelist.goto(-1).then(function(){
				me.votelist.fetching = false;
			}, function(model,res){
				alert(res.error.message);
				me.votelist.fetching = false;
			});
		},
		VoteListNextPage : function(){
			var me = this;
			if(this.votelist.fetching){
				return;
			}
			this.votelist.fetching = true;
			this.votelist.goto(1).then(function(){
				me.votelist.fetching = false;
			}, function(model,res){
				alert(res.error.message);
				me.votelist.fetching = false;
			});
		},
	});

	var VoteAppView = Backbone.View.extend({
		initialize : function(view){
			try{
				var me = this;
				me.view = view;
				require(['VoteModel'], function(m){
					if(!view.data.group_id){
						return;
					}else{
						var mark = new m.VoteUserMarkModel({obj_id:view.data.group_id,type:10});
						mark.fetch({
							success:function(model, res){
								if(res.error){
									console.log(res);
									return;
								}
								try{
									var xhr = mark.get('group').getUserVotes();
									if(xhr.readyState===4 && xhr.status===200){
										var res = JSON.parse(xhr.responseText);
										var votes = [];
										if(res.error){
											if(res.error.code==101){
												votes = [];
											}else{
												console.log(res);
												return;
											}
										}else{
											votes = res.data.items;
										}
										_.each(votes, function(vote){
											var vote_id = vote.vote_id,
												node_id = vote.node_id;
											mark.get('group').attach.findByAttachId(vote_id).attach.attach.findByAttachId(node_id).checked = true;
											mark.get('group').attach.findByAttachId(vote_id).attach.user_voted = true;
											mark.get('group').user_voted = true;
										});
									}
								}catch(e){

								}
								try{
									xhr = mark.get('group').getVotesStat();
									if(xhr.readyState===4 && xhr.status===200){
										var res = JSON.parse(xhr.responseText);
										if(res.data){
											_.each(res.data.items, function(item, i){
												var vote = mark.get('group').attach.findByAttachId(item.vote_id),
													opt = mark.get('group').attach.findByAttachId(item.vote_id).attach.attach.findByAttachId(item.node_id);
												if(!vote.vote_total){
													vote.vote_total = 0;
												}
												if(!opt.total){
													opt.total = 0;
												}
												vote.vote_total += item.count;
												opt.total += item.count;
											});
										}
									}
								}catch(e){

								}
								mark.on('change', me.render, me);
								me.model = mark;
								me.render();
							},
							error : function(model,res){
								console.log(res);
								return;
							}
						});
					}
				});
			}catch(e){
				console.log(e);
			}
		},
		render : function(){
			var me = this;
			require(['dxy-plugins/replacedview/vote/views/mobile.view'], function(tpl){
		  		me.el.innerHTML = _.template(tpl)({
		  			votes: me.model.get('group').attach.models, 
		  			group: me.model.get('group'),
		  			expired : new Date()>new Date(me.model.get('group').get('e_time')),
		  			isLogin : isLogin
		  		});
				me.trigger('render');
		  	});
			return me;
		},
		events : {
			'click .vote-multiple.user_not_voted li' : 'multipleCheck',
			'click .vote-single.user_not_voted li' : 'singleCheck',
			'click .user_not_voted .user-vote' : 'userVote'
		},
		multipleCheck : function(e){
			var target = $(e.currentTarget),
				id = target.data('id'),
				options = this.model.find(target.data('model')).models;
			options[+id].checked = !options[+id].checked;
			this.model.trigger('change');
		},
		singleCheck : function(e){
			var target = $(e.currentTarget),
				id = target.data('id'),
				options = this.model.find(target.data('model')).models;
			_.each(options, function(opt, i){
				if(i===+id){
					opt.checked = true;
				}else{
					opt.checked = false;
				}
			});
			this.model.trigger('change');
		},
		userVote : function(e){
			var tag = false,
				me = this;
			window.__voted = false;
			try{
			_.each(me.model.get('group').attach.models, function(vote, i){
				tag = false;
				_.each(vote.attach.attach.models, function(opt){
					if(opt.checked){
						tag = true;
					}
				});
				if(!tag){
					throw new Error();
				}
			});
			}catch(e){
				if(IS_PC){
					me.showWebAlertBox({
						title : '请填完当前组内的所有选项后再投票',
						button_title : '好吧',
						cls : 'web-alert',
						index : me.model.get('group').attach.models.length-1
					});
				}else{
					me.showAlertBox({
						title : '请填完当前组内的所有选项后再投票',
						button_title : '好吧',
						cls : '',
						index : me.model.get('group').attach.models.length-1
					});
				}
				return;
			}
			_.each(me.model.get('group').attach.models, function(vote, i){
				tag = false;
				_.each(vote.attach.attach.models, function(opt){
					if(opt.checked){
						tag = true;
					}
				});
				if(!tag){
					return;
				}else{
					var dtds =[];
					if(vote.attach.user_voted){
						return;
					}
					_.each(vote.attach.attach.models, function(opt){
						if(opt.checked){
							dtds.push(me.model.userChooseVoteOption(opt.get('node_id'), vote.get('vote_id'), vote.get('group_id')));
						}
					});
					$.when.apply(null, dtds).then(function(res, textStatus, jqXHR){
						vote.attach.user_voted = true;
						_.each(vote.attach.attach.models, function(opt){
							if(opt.checked){
								opt.total++;
								vote.vote_total++;
							}
						});
						me.model.get('group').user_voted = true;
						me.render();
					}, function(res){
						if(!window.__voted){
							me.showAlertBox({
								title : '请登陆',
								button_title : '好吧',
								cls : 'global-alert',
								container : $('body')
							});
						}
						window.__voted = true;
					});
				}
			});
		},
		removeAlertBox : function(){
			$('.msg-mark, .editor-alert-box').remove();
		},
		showAlertBox : function(opt){
			var me = this;
			this.removeAlertBox();
			$('<div class="msg-mark"></div>').appendTo($('body'));
			require(['dxy-plugins/replacedview/vote/views/alert.view'],function(tpl){
				$(_.template(tpl)(opt)).appendTo($('body'));
				$('.editor-alert-box a').click(function(){
					me.removeAlertBox();
				});
			});
		},
		showWebAlertBox : function(opt){
			var me = this;
			this.removeAlertBox();
			opt.index = opt.index || 0;
			opt.container = opt.container || $($('.editor-vote-wraper',me.el)[opt.index]);
			require(['dxy-plugins/replacedview/vote/views/alert.view'],function(tpl){
				$(_.template(tpl)(opt)).appendTo(opt.container);
				$('.editor-alert-box a').click(function(){
					me.removeAlertBox();
				});
			});
		}
	});

	window.VoteReplacedView = ReplacedView.register('vote', {
		toWechatView : function(){
		},
		toWebView : function(){
			return this.toAppView();
		},
		toAppView : function(){
			var ele = this.createWrapNode(true),
				me = this,
				dtd = $.Deferred(),
				view = new VoteAppView(this);
			view.on('render', function(){
				ele.appendChild(view.el);
				me.ele = ele;
				dtd.resolve(ele);
			});
			return dtd;
		},
		toEditorView : function(){
			var ele = this.createWrapNode(),
				me = this,
				dtd = $.Deferred();
			ele.setAttribute('contenteditable', 'false');
			require(['dxy-plugins/replacedview/vote/views/editor.view', 'VoteModel'], function(tpl, m){
				var mark = new m.VoteMarkModel({obj_id:me.data.group_id,type:10});
				mark.fetch({
					success:function(model, res){
						if(res.error){
							alert(res.error.message);
							return;
						}
						ele.innerHTML = _.template(tpl)({group : mark.get('group'),votes: mark.get('group').attach.models});
						me.ele = ele;
						dtd.resolve(ele);
					},
					error : function(model,res){
						console.log(res);
						alert(res.error.message);
					}
				});
				// var group = new m.VoteGroupModel({id: me.data.group_id});
				// group.fetch().success(function(res){
				// 	if(res.error){
				// 		alert(res.error.message);
				// 		console.log(res);
				// 		return;
				// 	}
				// 	ele.innerHTML = _.template(tpl)(group.attributes);
				// 	me.ele = ele;
				// 	dtd.resolve(ele);
				// }).error(function(res){
				// 	console.log(res);
				// 	alert(res.error.message);
				// });
		  	});
			return dtd;
		},
		onModalShow : function(){
			this.vote =  new VoteView(this);
			$('#dxy-vote-modal .modal-body').html($(this.vote.el));
		},
		onModalHide : function(){

		}, 
		onModalConfirm : function(){
			var data, dtd = $.Deferred(),me =this;
			me.vote.model.save({}, {data : {obj_id: window.group.get('id'), type: 10}}).then(function(res){
				if(res.error){
					alert(res.error.message);
					dtd.reject();
					return;
				}
				me.data.obj_id = me.data.group_id = window.group.get('id');
				me.data.type_id = 10;
				me.data.id = res.data.items[0].id;
				dtd.resolve();
			}, function(res){
				alert('保存标记失败');
				dtd.reject();
			});
			return dtd;
		},
		modalInit : function(){
			
		}
	});
})();