'''Comments are indicated in triple quotes or after #'s
This is the view file: index is called whenever the url is hit.
'''

from django.shortcuts import render, redirect, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import auth
from django.core.context_processors import csrf
import datetime
from models import Tutor

from urllib import urlopen
import json
TRIES = 20

from settings import MEDIA_ROOT

def home(request):
  return render(request, 'home.html')

""" Authentication Package
"""

def dashboard(request):
  """ Only logged in users can access
      Major functions to be added on this page 
  """
  if not request.user.is_authenticated():
        return HttpResponseRedirect('/login')
  return render(request, 'dashboard.html')

def signup(request):
  """ Needs to extend the user model and creation form
  """
  if request.method == 'POST':
    form = UserCreationForm(request.POST)
    if form.is_valid():
      form.save()
      return redirect('/dashboard')

  args = {}
  args.update(csrf(request))

  args['form'] = UserCreationForm()
  return render_to_response('signup.html',args)

def login(request):
  c = {}
  c.update(csrf(request))
  return render_to_response('login.html', c)
  
def auth_view(request):
  username = request.POST.get('username', '')
  password = request.POST.get('password', '')
  user = auth.authenticate(username=username, password=password)

  if user is not None:
    auth.login(request, user)
    return HttpResponseRedirect('/dashboard')
  else:
    return HttpResponseRedirect('/login')

def logout(request):
  auth.logout(request)
  return HttpResponseRedirect('/')
