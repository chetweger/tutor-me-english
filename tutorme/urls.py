"""This file describes the url routes.
"""

from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()
import settings

urlpatterns = patterns('',
    url(r'^$', 'tutorme.views.home'),
    url(r'^language_partners/$', 'tutorme.views.language_partners'),
    url(r'^signup/$', 'tutorme.views.signup'),
    url(r'^login/$', 'tutorme.views.login'),
    url(r'^auth/$', 'tutorme.views.auth_view'),
    url(r'^dashboard/$', 'tutorme.views.dashboard'),
    url(r'^logout/$', 'tutorme.views.logout'),
    url(r'^profile/$', 'tutorme.views.profile'),
    url(r'^search/$', 'tutorme.views.search'),

    (r'^media/(?P<path>.*)$', 'django.views.static.serve', { 'document_root': settings.MEDIA_ROOT }),

    url(r'^admin/', include(admin.site.urls)),
)
