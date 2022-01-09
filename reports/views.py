from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Sum
# Create your views here.
from account.decorators import allowed_users
from account.models import UserProfile
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
    prisons = Prison.objects.all()
    orders = Order.objects.filter(product__category=category).count()
    requests = Order.objects.filter(product__category=category).values('request').count()
    orders_price = Order.objects.filter(product__category=category).aggregate(Sum('quantity'))
    context = {
        'categories': categories,
        'orders': orders,
        'orders_price': orders_price['quantity__sum'],
        'category': category,
        'requests': requests,
        'prisons': prisons
    }
    return render(request, 'reports/home.html', context)


@login_required(login_url='account:login')
@allowed_users(['administrator'])
def search_category(request):
    if request.method == 'POST':
        category_name = json.loads(request.body).get('category_name')
        prison_id = json.loads(request.body).get('prison_id')
        start_date = json.loads(request.body).get('start_date')
        end_date = json.loads(request.body).get('end_date')
        category = Category.objects.get(name=category_name)
        brand_count = category.suppliers.all().count()
        expert_fullname = category.user_expert.userprofile.first_name + ' ' + category.user_expert.userprofile.last_name

        if start_date != '' and end_date != '':
            start_date = jdatetime.datetime.strptime(start_date, '%Y/%m/%d').togregorian()
            end_date = jdatetime.datetime.strptime(end_date, '%Y/%m/%d').togregorian()
            orders_count = Order.objects.filter(product__category=category,
                                                created_date__range=[start_date, end_date])
            requests_count = Order.objects.filter(product__category=category,
                                                  created_date__range=[start_date, end_date])
        elif start_date != '' and end_date == '':
            start_date = jdatetime.datetime.strptime(start_date, '%Y/%m/%d').togregorian()
            orders_count = Order.objects.filter(product__category=category,
                                                created_date__gte=start_date)
            requests_count = Order.objects.filter(product__category=category,
                                                  created_date__gte=start_date)
        elif start_date == '' and end_date != '':
            end_date = jdatetime.datetime.strptime(end_date, '%Y/%m/%d').togregorian()
            orders_count = Order.objects.filter(product__category=category,
                                                created_date__lte=end_date)
            requests_count = Order.objects.filter(product__category=category,
                                                  created_date__lte=end_date)


        else:
            orders_count = Order.objects.filter(product__category=category)
            requests_count = Order.objects.filter(product__category=category)
        if prison_id != '0':
            print(prison_id)
            prison = Prison.objects.get(id=prison_id)
            orders_count = orders_count.filter(request__prison=prison)
            requests_count = requests_count.filter(request__prison=prison).values('request__number',
                                                                                  'request__request_status',
                                                                                  'request__shipping_status',
                                                                                  'request__prison__name',
                                                                                  'request__branch__name').distinct().order_by(
                'created_date')
        else:
            requests_count = requests_count.values('request__number',
                                                   'request__request_status',
                                                   'request__shipping_status',
                                                   'request__prison__name',
                                                   'request__branch__name').distinct().order_by(
                'created_date')
        orders_count_quantity = orders_count.aggregate(Sum('quantity'))['quantity__sum']
    data = {
        'orders_count': orders_count.count(),
        'requests_count': requests_count.count(),
        'orders_count_quantity': orders_count_quantity,
        'expert': expert_fullname,
        'brand_count': brand_count,
        'requests': list(requests_count),
        'category': category.name
    }
    return JsonResponse(data, safe=False)


@login_required(login_url='account:login')
@allowed_users(['administrator'])
def review_request(request):
    if request.method == 'POST':
        request_number = json.loads(request.body).get('request_number')
        request_n = Request.objects.get(number=request_number)
        user = UserProfile.objects.get(user__email=request_n.user)

        retrieved_request = {'number': request_n.number, 'status': request_n.request_status,
                             'shipping_status': request_n.shipping_status,
                             'request_datetime': request_n.get_created_date}
        user_profile = {'first_name': user.first_name,
                        'last_name': user.last_name,
                        'phone_number': user.phone_number, 'national_id': user.national_id, 'email': request.user.email}
        prison_profile = {'id': request_n.prison.id, 'name': request_n.prison.name, 'address': request_n.branch.address,
                          'phone_number': request_n.branch.phone_number,
                          'branch_deputy': request_n.branch.branch_deputy}
        orders = Order.objects.filter(request=request_n)

        request_orders = []
        for order in orders:
            try:
                supplier_product_price = SupplierProduct.objects.filter(request=request_n, product=order.product,
                                                                        supplier=order.supplier)
                if len(supplier_product_price) != 0:
                    sellprice = supplier_product_price[0].price2m
                    buyprice = supplier_product_price[0].price
                else:
                    sellprice = 0
                    buyprice = 0
            except SupplierProduct.DoesNotExist:
                sellprice = 0
                buyprice = 0
            request_orders.append({'product_name': order.product.name, 'product_category': order.product.category.name,
                                   'product_supplier': order.supplier.company_name,
                                   'product_brand': order.brand.company_name, 'product_quantity': order.quantity,
                                   'product_quantity_unit': order.product.based_quantity, 'sellprice': sellprice,
                                   'buyprice': buyprice})

        data = {
            'userprofile': user_profile,
            'prisonprofile': prison_profile,
            'request_orders': request_orders,
            'branch': request_n.branch.name,
            'request': retrieved_request
        }
        return JsonResponse(data, safe=False)
