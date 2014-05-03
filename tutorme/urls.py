"""This file describes the url routes.
"""

from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()
import settings

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'tutorme.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^json/', 'tutorme.views.json_endpoint'),
    url(r'^$', 'tutorme.views.index'),

    (r'^js/(?P<path>.*)$', 'django.views.static.serve', { 'document_root': settings.MEDIA_ROOT }),


    url(r'^admin/', include(admin.site.urls)),
)
