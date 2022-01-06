from django.contrib.auth.decorators import login_required
from django.shortcuts import render

# Create your views here.
from account.decorators import allowed_users


@login_required(login_url='account:login')
@allowed_users(['administrator'])
def report_home(request):
    return render(request, 'reports/home.html')
