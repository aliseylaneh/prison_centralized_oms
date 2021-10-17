from django.http import HttpResponseRedirect, Http404
from django.shortcuts import redirect, render
from django.contrib import messages

from django.contrib.auth import login, logout


def unauthenticated_user(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('account:homepage')
        else:
            return view_func(request, *args, **kwargs)

    return wrapper_func


def allowed_users(allowed_roles=[]):
    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):
            group = None
            if request.user.groups.exists():
                group = request.user.groups.all()[0].name
            if group in allowed_roles:
                return view_func(request, *args, **kwargs)
            else:
                raise Http404

        return wrapper_func

    return decorator


def admin_only(view_func):
    def wrapper_function(request, *args, **kwargs):
        group = None
        if request.user.groups.exists():
            group = request.user.groups.all()[0].name
        if group == 'regular_user':
            messages.info()
            return redirect("account:login")
        if group == 'admin':
            return view_func(request, *args, **kwargs)

    return wrapper_function

