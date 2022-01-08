from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Sum
# Create your views here.
from account.decorators import allowed_users
from main.models import Category, Order
import csv
import io
import json
import logging
import unittest
from datetime import date
from django.db.models import Q
import django
import jdatetime
import xlsxwriter
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.core.handlers import exception
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import JsonResponse, HttpResponseNotFound, HttpResponse, FileResponse
from django.urls import reverse
from io import StringIO

from account.decorators import *
from main.models import *


@login_required(login_url='account:login')
@allowed_users(['administrator'])
def report_home(request):
    category = Category.objects.get(name='دخانیات')
    categories = Category.objects.all()
    orders = Order.objects.filter(product__category=category).count()
    requests = Order.objects.filter(product__category=category).values('request').count()
    orders_price = Order.objects.filter(product__category=category).aggregate(Sum('quantity'))
    context = {
        'categories': categories,
        'orders': orders,
        'orders_price': orders_price['quantity__sum'],
        'category': category,
        'requests': requests
    }
    return render(request, 'reports/home.html', context)


@login_required(login_url='account:login')
@allowed_users(['administrator'])
def search_category(request):
    if request.method == 'POST':
        category_name = json.loads(request.body).get('category_name')
        start_date = json.loads(request.body).get('start_date')
        end_date = json.loads(request.body).get('end_date')
        category = Category.objects.get(name=category_name)
        expert_fullname = category.user_expert.userprofile.first_name + ' ' + category.user_expert.userprofile.last_name
        orders_count = Order.objects.filter(product__category=category).count()
        requests_count = Order.objects.filter(product__category=category).values('request').distinct().count()
        orders_count_quantity = Order.objects.filter(product__category=category).aggregate(Sum('quantity'))[
            'quantity__sum']
        data = {
            'orders_count': orders_count,
            'requests_count': requests_count,
            'orders_count_quantity': orders_count_quantity,
            'expert': expert_fullname
        }
        return JsonResponse(data, safe=False)
