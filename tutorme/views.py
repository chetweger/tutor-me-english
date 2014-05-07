'''Comments are indicated in triple quotes or after #'s
This is the view file: index is called whenever the url is hit.
'''

from django.shortcuts import render, redirect
from django.http import HttpResponse
import datetime
from models import Tutor

from urllib import urlopen
import json
TRIES = 20

from settings import MEDIA_ROOT

def home(request):
  return render(request, 'home.html')

def language_partners(request):
  tutors = Tutor.objects.all()
  return render(request, 'language_partners.html', {'tutors':tutors})

def valid_signup(request):
  if request.POST.get('email') and request.POST.get('password') and request.POST.get('password_repeat') and request.POST.get('name') and request.POST.get('college'):
    if request.POST.get('password') == request.POST.get('password_repeat'):
      if Tutor.objects.filter(email=request.POST['email']).count() == 0:
        return True
  return False

def valid_login(request):
  if request.POST.get('email') and request.POST.get('password'):
    if Tutor.objects.filter(email=request.POST['email'], password=request.POST['password']).count() == 1:
      return True
    if Tutor.objects.filter(email=request.POST['email'], password=request.POST['password']).count() > 1:
      assert False
  return False

def signup(request):
  if request.method == 'GET':
    error_message = request.GET.get('error_message', '')
    return render(request, 'signup.html', {'error_message': error_message})
  else:
    if valid_signup(request):
      suffix = request.FILES.get('image').name.split('.')[-1] # get the image suffix
      name = request.POST.get('email') + '.' + suffix
      file_name = MEDIA_ROOT + '/images/' + name
      image_url = '/media/images/' + name
      with open(file_name, 'w') as destination:
        for chunk in request.FILES.get('image').chunks():
          destination.write(chunk)
      Tutor.objects.create(
                           image_url=image_url,
                           email=request.POST.get('email'),
                           password=request.POST.get('password'),
                           name=request.POST.get('name'),
                           college=request.POST.get('college'))
      return redirect('/language_partners')
    else:
      return redirect('/signup?error_message=Invalid credentials.')

def login(request):
  if request.method == 'GET':
    error_message = request.GET.get('error_message', '')
    return render(request, 'login.html', {'error_message': error_message})
  else:
    if valid_login(request):
      return redirect('/language_partners')
    else:
      return redirect('/login?error_message=Invalid login.')
