"""This file describes the url routes.
"""

from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()
import settings_dev

urlpatterns = patterns('',
    url(r'^$', 'tutorme.views.home'),
    url(r'^language_partners/$', 'tutorme.views.language_partners'),
    url(r'^signup/$', 'tutorme.views.signup'),
    url(r'^login/$', 'tutorme.views.login'),
    url(r'^auth/$', 'tutorme.views.auth_view'),
    url(r'^dashboard/$', 'tutorme.views.dashboard'),
    url(r'^logout/$', 'tutorme.views.logout'),

    (r'^media/(?P<path>.*)$', 'django.views.static.serve', { 'document_root': settings_dev.MEDIA_ROOT }),


    url(r'^admin/', include(admin.site.urls)),
)
