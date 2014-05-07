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

from settings_dev import MEDIA_ROOT

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
  print 'valid_login'
  if request.POST.get('email') and request.POST.get('password'):
    print "count is ", Tutor.objects.filter(email=request.POST['email'], password=request.POST['password']).count()
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
      print dir(request.FILES.get('image'))
      print 'file_name ', file_name
      print 'image_url ', image_url
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
    print '1'
    if valid_login(request):
      return redirect('/language_partners')
    else:
      return redirect('/login?error_message=Invalid login.')

def json_endpoint(request):
  data = get_api()
  list_list_cells = map( lambda x:
                         [x['marker'],
                          x['profile'].get('name', ""),
                          x['rating'], '<img height=100 src="' + x['profile'].get('picUrl', "") + '"></img>'],
                         data['users']
                       )

  return HttpResponse(json.dumps(list_list_cells), mimetype='application/javascript')

def index(request):
  data = get_api()
  google_map = get_gmap_url(data['locations'])
  return render(request, 'tutorme.html',{'data': data,'google_map': google_map, })

def get_api():
  '''Gets the necessary data from the api and stores it in the JsonDump database table.
  Given a request call to get_api at time $now$, if there is an entry in the database from the
  same hour, then we simply return that entry. Otherwise, we make a call to the url and populate
  the JsonDump database table.
  '''
  now = datetime.datetime.now()
  query = JsonDump.objects.all().order_by('time')
  if query:
    most_recent_entry = list(query)[-1] # last element is most recent b/c sorted in ascending order
    if most_recent_entry.time.hour == now.hour:
      # we return this entry instead of making a call to the api
      return json.loads(most_recent_entry.json)

  base = 'http://devtest.sanguinebio.com/API'
  events_url = base + '?resource=e'
  distance_url = base + '?resource=s'
  users_url = base + '?resource=r'

  events = get_unreliable_url(events_url)
  locations = get_unreliable_url(distance_url)
  users = try_bad_json(users_url)
  for i in range(len(users)):
    users[i]['marker'] = i # add in a marker to indicate location on the map
    ratings = map(lambda x: x['merit'], users[i]['ratings'])
    if ratings:
      users[i]['rating'] = float(sum(ratings))/len(ratings)
    else:
      users[i]['rating'] = 0.

  data = {'events': events, 'locations': locations, 'users': users}
  JsonDump.objects.create(time=now, json=json.dumps(data)) # save the data in the JsonDump database table
  return data

def get_gmap_url(locations):
  '''Creates a google maps image src url from the locations.
  '''
  lat_tot = 0
  lon_tot = 0
  markers = ''
  for i, location in enumerate(locations):
    coordinate = location['userInfo']['location']['geo']
    lat_tot += coordinate[0]
    lon_tot += coordinate[1]
    markers += '&markers=color:blue%7Clabel:' + str(i) + '%7C' + str(coordinate[0]) + ',' + str(coordinate[1]) + '%7C'
  first_geo = locations[0]['userInfo']['location']['geo']
  lat_center = first_geo[0]
  lon_center = first_geo[1]
  url = 'http://maps.googleapis.com/maps/api/staticmap?center=' + str(lat_center) + ',' + str(lon_center) + '&zoom=8&size=450x500&maptype=roadmap' + markers + '&sensor=false'
  return url

def get_unreliable_url(url, tries=TRIES):
  '''Gets json from url.
  Fails after having tried [tries] number of times.
  '''
  data = {}
  while tries > 0:
    request = urlopen(url)
    json_str = request.read()
    try:
      data = json.loads(json_str)
      break # if we get json succesfully, we break out of loop.
    except:
      data = None
    tries = tries - 1
  return data

def get_url(url):
  '''Get url with appropriate exception handling...
  '''
  request = urlopen(url)
  try:
    response = request.read()
  except:
    return "Error"
  return response

def try_bad_json(url, tries=TRIES):
  '''Used to get the json from the resources=r endpoint:
  http://devtest.sanguinebio.com/API?resource=r
  This endpoint does not return correctly formatted json.
  I must add commas between dictionaries and add [ and ] to make list of dicts.
  '''
  while tries > 0:
    users = get_url(url)
    if '_id' in users:
      users = '[' + users.replace('\n{"_id', ', {"_id').replace('\n', ' ') + ']' # MAKE the json valid :(
      try:
        users = json.loads(users) # MAKE it json
        break
      except:
        users = ''
      tries -= 1
  return users
