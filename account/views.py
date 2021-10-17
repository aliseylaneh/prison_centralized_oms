from django.contrib import messages
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from .decorators import unauthenticated_user, allowed_users
from .models import *


@allowed_users(allowed_roles=['administrator', 'user', 'ceo', 'site_admin', 'financial_manager', 'commercial_expert',
                              'commercial_manager'])
@login_required(login_url='account:login')
def homepage(request):
    return render(request, 'account/home.html', )


def logout_request(request):
    logout(request)
    messages.warning(request, f"شما از حساب خود خارج شدید")
    return redirect("account:login")


@unauthenticated_user
def login_request(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            messages.success(request, f" {user.email} خوش آمدید")
            login(request, user)
            return redirect("account:homepage")
        else:
            messages.error(
                request, "نام کاربری یا رمز عبور را اشتباه وارد کرده اید")
    context = {}
    return render(request, "account/login.html", context)


@login_required(login_url='account:login')
def user_info(request):
    if request.method == "POST":
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        agent_national_code = request.POST.get('agent_national_code')
        birth_date = request.POST.get('birth_date')
        phone_number = request.POST.get('phone_number')
        postal_code = request.POST.get('postal_code')
        province = request.POST.get('province')
        city = request.POST.get('city')
        profile_picture = request.POST.get('profile_picture')
        UserProfile.objects.create_userprofile(user=request.user, first_name=first_name, last_name=last_name,
                                               agent_national_code=agent_national_code,
                                               birth_date=birth_date, phone_number=phone_number,
                                               postal_code=postal_code, province=province, city=city,
                                               profile_picture=profile_picture)
        return redirect('account:profile')
    context = {}
    return render(request, "account/profile.html", context)


@login_required(login_url='account:login')
def profile(request):
    return render(request, 'account/request.html', {})


@login_required(login_url='account:login')
def error404(request, exception):
    if request.user is not None:
        data = {}
        return render(request, 'account/404.html', {})


def error500(request):
    if request.user is not None:
        data = {}
        return render(request, 'account/500.html', {})
