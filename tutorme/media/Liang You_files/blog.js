define(["modules/util/util.instances","modules/util/util.model","jq!starfield/jquery.mod","starfield/sf.share","starfield/sf.msg.overlay","modules/ui/dialog"],function(a,b,c){function k(a,c){this.$element=a,this.model=new b(c),this.mode=this.model.get("mode"),this.i18N=this.model.get("i18N"),this.init()}function l(a){var b=/<img[^>]+>/i,d=c('<a href="'+a.link+'" target="_blank" class="wsb-blog-vert-image">'),e=b.exec(a.content);return e&&d.append(e[0]),d}function m(a){var b=/<img[^>]+>/i,d=c('<a href="'+a.link+'" target="_blank" class="wsb-blog-horz-image">'),e=b.exec(a.content);return e?(d.append(e[0]),d):null}function n(a){a.toLowerCase().substring(0,7)!="http://"&&(a="http://"+a);var b=a.toLowerCase(),c=b.indexOf("tumblr.com/blog");return c>-1?(b="http://"+b.substring(27)+".tumblr.com/rss",i="tumblr",b):(c=b.indexOf("tumblr.com"),c>-1?(i="tumblr",b+"/rss"):(c=b.indexOf("blogspot.com"),c>-1?(i="blogger",b.substring(0,c+12)+"/feeds/posts/default"):(i="other",a)))}function o(a){return a=a.toLowerCase(),a.substring(0,7)!="http://"&&(a="http://"+a),"http://"+a.match(/:\/\/(.[^/]+)/)[1]}var d="wsb-blog",e="ui-blog",f=!1,g=!1,h=[],i,j;window.googleAPILoaded=function(){f=!0,g=!1;while(h.length>0){var a=h.shift();google.load("feeds","1",{callback:a})}},k.prototype={init:function(){this.refresh()},initializeGoogleFeeds:function(a){f||typeof google=="object"&&typeof google.feeds=="object"?(f=!0,a()):g?h.push(a):(h.push(a),g=!0,require(["//www.google.com/jsapi?sensor=false&key=AIzaSyAsaQtr02Mt5fQigviYgmIy37VP-hcO9TU&callback=googleAPILoaded"]))},refresh:function(){var a=[];j=this.$element,j.empty();var b=this.model.get("BlogPageLayoutId"),f=this,g=f.model.get("ID"),h;j.addClass(e);if(this.mode=="designer"){if(!this.$overlay||!this.$overlay.length)this.$overlay=c("<div/>").addClass(d+"-overlay");this.$overlay.css({filter:"alpha(opacity = 0)"}).children().remove(),this.$overlay.appendTo(this.$element)}c("#"+g+" .blogContainer").length?(h=c("#"+g+" .blogContainer"),h.empty()):(h=c('<div class="wsb-blog-container blogContainer" style="height: '+f.model.get("Height")+'">'),j.append(h)),h.sfMsgOverlay({message:f.i18N.resources.Loading});var i=function(){var c=n(f.model.get("BlogUrl")),d=new google.feeds.Feed(c),e=f.model.get("BlogListingsPerPage"),g=f.model.get("ShowBlogImages"),i=f.model.get("ShowBlogCategories");d.setNumEntries(e),d.load(function(c){var d=c.error?"":c.feed.entries;h.sfMsgOverlay({message:null});if(d=="")h.append("<div id='nofeeds'>"+f.i18N.resources.Client__No_entries_to_display+"</div>");else{for(var e=0;e<d.length;e++)a[e]=d[e];f.renderFeedEntries(a,b,g,i,h)}})};this.initializeGoogleFeeds(i)},destroy:function(){p.destroy(this.$element),this.$element.remove()},renderFeedEntries:function(a,b,d,e,f){var g=this,h;if(b==1)for(var j=0;j<a.length;j++){var k=c('<div class="wsb-blog-text-vert-wrap">');if(d==1)var n=l(a[j]);k.append('<div class="wsb-blog-post-header"><a href="'+a[j].link+'" target="_blank">'+a[j].title+"</a></div>"),a[j].publishedDate&&(h=new Date(a[j].publishedDate),k.append('<p id="wsb-blog-publish-date">'+h.toLocaleString()+"</p>"));if(e==1)for(var p=0;p<a[j].categories.length;p++)switch(i){case"tumblr":k.append((p>0?", ":"")+'<a class="wsb-blog-category" href="'+o(g.model.get("BlogUrl"))+"/tagged/"+a[j].categories[p]+'" target="_blank">'+a[j].categories[p]+"</a>");break;case"blogger":k.append((p>0?", ":"")+'<a class="wsb-blog-category" href="'+o(g.model.get("BlogUrl"))+"/search/label/"+a[j].categories[p]+'" target="_blank">'+a[j].categories[p]+"</a>");break;default:}k.append('<div class="wsb-blog-entry-text"><a href="'+a[j].link+'" target="_blank">'+a[j].contentSnippet+"</a></div>"),c('<div class="wsb-blog-vert-entry-wrap"></div>').append(n).append(k).appendTo(f)}else{var q=c("<ul class='wsb-blog-horz-wrap'>");f.append(q);for(var r=0;r<a.length;r++){var s=c("<li>");q.append(s);if(d==1){var t=m(a[r]);t&&s.append(t)}else s.css({height:"250px"});s.append('<h3 class="wsb-blog-post-header"><a href="'+a[r].link+'" target="_blank">'+a[r].title+"</a></div>"),a[r].publishedDate&&(h=new Date(a[r].publishedDate),s.append('<p id="wsb-blog-publish-date">'+h.toLocaleString()+"</p>"));if(e==1)for(var u=0;u<a[r].categories.length;u++)switch(i){case"tumblr":s.append((u>0?", ":"")+'<a class="wsb-blog-category" href="'+o(g.model.get("BlogUrl"))+"/tagged/"+a[r].categories[u]+'" target="_blank">'+a[r].categories[u]+"</a>");break;case"blogger":s.append((u>0?", ":"")+'<a class="wsb-blog-category" href="'+o(g.model.get("BlogUrl"))+"/search/label/"+a[r].categories[u]+'" target="_blank">'+a[r].categories[u]+"</a>");break;default:}s.append('<div class="wsb-blog-entry-text"><a href="'+a[r].link+'" target=_blank >'+a[r].contentSnippet+"</a></div>")}}}};var p=new a(d,k);return{render:function(a,b){var c=p.get(a);return c?c.refresh():c=p.create(a,b),c},destroy:function(a){var b=p.get(a);return b?(p.destroy(a),!0):!1}}})