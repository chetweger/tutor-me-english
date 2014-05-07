define(["modules/util/util.instances","modules/util/util.model","jq!starfield/jquery.mod","js!//s7.addthis.com/js/300/addthis_widget.js#async=1"],function(a,b,c){function e(a,c){this.$element=a,this.model=new b(c),this.mode=this.model.get("mode"),this.subscriptions=[],this.init()}var d="wsb-social-share";e.prototype={init:function(){var a=this;if(this.mode=="designer"&&this.model.isKO){var b=this.model.get();if(b.mutatorViewModel){var c=function(){a.refresh()};for(var d in b.mutatorViewModel)b.ko.isObservable(b.mutatorViewModel[d])&&this.subscriptions.push(b.mutatorViewModel[d].subscribe(c))}}this.refresh(!0)},ready:function(a){addthis.init(),addthis.toolbox(this.$element[0]),this.mode=="designer"&&this.updateOverlay(a)},refresh:function(a){var b=this;this.$element.attr("class",d).children().remove();var e="",f=d+"-button",g=this.model.get("ShareTheme");if(this.mode=="mobile")switch(g){case"Small Buttons":case"Small Buttons - Vertical":case"Buttons - Vertical":g="Buttons";break;case"Counter":case"Counter - Vertical":case"Horizontal Counter":case"Bubble Counter - Vertical":case"Vertical Counter":g="Bubble Counter"}Boolean(g.match(/- Vertical$/i))&&(f+="-vert");switch(g){case"Buttons":case"Buttons - Vertical":this.$element.addClass("addthis_toolbox addthis_default_style addthis_32x32_style"),this.model.get("ShareFacebook")&&(e+='<a class="addthis_button_facebook '+f+'"></a>'),this.model.get("ShareTwitter")&&(e+='<a class="addthis_button_twitter '+f+'"></a>'),this.model.get("ShareGoogle")&&(e+='<a class="addthis_button_google_plusone_share '+f+'"></a>'),this.model.get("SharePinterest")&&(e+='<a class="addthis_button_pinterest_share '+f+'"></a>'),this.model.get("ShareEmail")&&(e+='<a class="addthis_button_email '+f+'"></a>'),this.model.get("ShareMore")&&(e+='<a class="addthis_button_expanded '+f+'"></a>');break;case"Small Buttons":case"Small Buttons - Vertical":this.$element.addClass("addthis_toolbox addthis_default_style"),this.model.get("ShareFacebook")&&(e+='<a class="addthis_button_facebook '+f+'"></a>'),this.model.get("ShareTwitter")&&(e+='<a class="addthis_button_twitter '+f+'"></a>'),this.model.get("ShareGoogle")&&(e+='<a class="addthis_button_google_plusone_share '+f+'"></a>'),this.model.get("SharePinterest")&&(e+='<a class="addthis_button_pinterest_share '+f+'"></a>'),this.model.get("ShareEmail")&&(e+='<a class="addthis_button_email '+f+'"></a>'),this.model.get("ShareMore")&&(e+='<a class="addthis_button_expanded '+f+'"></a>');break;case"Toolbar":e+='<a class="addthis_button" href="//www.addthis.com/bookmark.php?v=300&amp;pubid=xa-5107daf277cd4d0c"><img src="//s7.addthis.com/static/btn/v2/lg-share-en.gif" width="125" height="16" alt="Bookmark and Share" style="border:0"/></a>';break;default:case"Counter":case"Counter - Vertical":case"Horizontal Counter":this.$element.addClass("addthis_toolbox addthis_default_style"),this.model.get("ShareFacebook")&&(e+='<a class="addthis_button_facebook_like '+f+'" fb:like:layout="button_count"></a>'),this.model.get("ShareTwitter")&&(e+='<a class="addthis_button_tweet '+f+'"></a>'),this.model.get("ShareGoogle")&&(e+='<a class="addthis_button_google_plusone '+f+'" g:plusone:size="medium"></a>');break;case"Bubble Counter":case"Bubble Counter - Vertical":case"Vertical Counter":this.$element.addClass("addthis_toolbox addthis_default_style addthis_counter_style"),this.model.get("ShareFacebook")&&(e+='<a class="addthis_button_facebook_like '+f+'" fb:like:layout="box_count"></a>'),this.model.get("ShareTwitter")&&(e+='<a class="addthis_button_tweet '+f+'" tw:count="vertical"></a>'),this.model.get("ShareGoogle")&&(e+='<a class="addthis_button_google_plusone '+f+'" g:plusone:size="tall"></a>')}this.$element.html(e),typeof addthis!="object"?c(document).ready(function(){b.ready(a)}):b.ready(a)},updateOverlay:function(a){var b=c("."+d+"-overlay",this.$element);b.length||(b=c("<div/>").addClass(d+"-overlay").css({filter:"alpha(opacity = 0)","background-color":"transparent"}).appendTo(this.$element));if(!a&&this.model.isKO){var e=this;clearInterval(this.overlayTimer),this.overlayTimerCount=0;var f=e.model.get("wsb",!0).actionbar.undoer;this.overlayTimer=setInterval(function(){if(e.overlayTimerCount>=20)clearInterval(e.overlayTimer),e.overlayTimerCount=0;else{var a=f.getCurrentState()!="collect";e.overlayTimerCount++,e.$element.removeClass("resized");if(a){var b=e.model.get("getLast",!0)("Width"),c=e.model.get("getLast",!0)("Height");if(parseFloat((b&&b.NewValue||e.model.get("Width")).replace("px",""))<e.$element.outerWidth(!0)){f.disable();var d=e.$element.outerWidth(!0)+"px";b&&(b.NewValue=d),e.model.set("Width",d),f.enable()}if(parseFloat((c&&c.NewValue||e.model.get("Height")).replace("px",""))<e.$element.outerHeight(!0)){f.disable();var g=e.$element.outerHeight(!0)+"px";c&&(c.NewValue=g),e.model.set("Height",g),f.enable()}}else parseFloat(e.model.get("Width").replace("px",""))<e.$element.outerWidth(!0)&&e.model.set("Width",e.$element.outerWidth(!0)+"px"),parseFloat(e.model.get("Height").replace("px",""))<e.$element.outerHeight(!0)&&e.model.set("Height",e.$element.outerHeight(!0)+"px");e.$element.addClass("resized")}},100)}},destroy:function(){for(var a in this.subscriptions)this.subscriptions[a].dispose();f.destroy(this.$element),this.$element.remove()}};var f=new a(d,e);return{render:function(a,b){var c=f.get(a);return c?c.refresh():c=f.create(a,b),c},destroy:function(a){var b=f.get(a);return b?(f.destroy(a),!0):!1}}})