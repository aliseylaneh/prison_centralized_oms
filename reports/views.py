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
from django.db.models import Q, Avg, Count
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


# Category Report
@login_required(login_url='account:login')
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
    return render(request, 'reports/category_report.html', context)


@login_required(login_url='account:login')
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

            supplier_product_price = SupplierProduct.objects.filter(request=request_n, product=order.product,
                                                                    supplier=order.supplier,
                                                                    brand=order.brand).order_by("-created_date")
            if len(supplier_product_price) == 0:
                supplier_product_price = SupplierProduct.objects.filter(product=order.product,
                                                                        supplier=order.supplier,
                                                                        brand=order.brand).order_by("-created_date")
                if len(supplier_product_price) != 0:
                    sellprice = supplier_product_price[0].price2m
                    buyprice = supplier_product_price[0].price
                else:
                    sellprice = 0
                    buyprice = 0
            else:
                sellprice = supplier_product_price[0].price2m
                buyprice = supplier_product_price[0].price

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


# Product Report
def product_report(request):
    categories = Category.objects.all()

    context = {
        'categories': categories
    }
    return render(request, "reports/product_report.html", context)


def search_product(request):
    product_id = json.loads(request.body).get('product_id')
    supplier_id = json.loads(request.body).get('supplier_id')
    start_date = json.loads(request.body).get('start_date')
    end_date = json.loads(request.body).get('end_date')
    product = Product.objects.get(id=product_id)
    supplier = Supplier.objects.get(company_name=supplier_id)
    if supplier.company_name != 'بدون تامین کننده':
        supplier_products = SupplierProduct.objects.filter(product=product, supplier=supplier)
    else:
        supplier_products = SupplierProduct.objects.filter(product=product)

    if start_date != '' and end_date != '':
        start_date = jdatetime.datetime.strptime(start_date, '%Y/%m/%d').togregorian()
        end_date = jdatetime.datetime.strptime(end_date, '%Y/%m/%d').togregorian()
        supplier_products = supplier_products.filter(created_date__range=[start_date, end_date])
    elif start_date != '' and end_date == '':
        start_date = jdatetime.datetime.strptime(start_date, '%Y/%m/%d').togregorian()
        supplier_products = supplier_products.filter(created_date__gte=start_date)
    elif start_date == '' and end_date != '':
        end_date = jdatetime.datetime.strptime(end_date, '%Y/%m/%d').togregorian()
        supplier_products = supplier_products.filter(created_date__lte=end_date)

    supplier_products = supplier_products.order_by("-created_date")
    supplier_count = supplier_products.values('supplier').distinct().count()
    brand_count = supplier_products.values('brand').exclude(brand__company_name='بدون برند').distinct().count()
    request_count = supplier_products.values('request').distinct().count()
    buy_price_avg = supplier_products.aggregate(Avg('price'))['price__avg']
    sell_price_avg = supplier_products.aggregate(Avg('price2m'))['price2m__avg']
    most_supplier = supplier_products.values_list('supplier', 'supplier__company_name').annotate(
        supplier_count=Count('supplier')).order_by(
        '-supplier_count')
    if len(supplier_products) == 0:
        return JsonResponse({"data": []}, safe=False)
    most_supplier_count = most_supplier[0][2]
    most_supplier = most_supplier[0][1]
    latest_supplier = supplier_products[0].supplier.company_name

    data = []
    for supplier in supplier_products:
        data.append({'product_name': supplier.product.name, 'supplier_name': supplier.supplier.company_name,
                     'brand_name': supplier.brand.company_name,
                     'price': supplier.price, 'price2m': supplier.price2m,
                     'created_date': f'{supplier.get_created_time} {supplier.get_created_date}',
                     'last_edition': supplier.last_edition.userprofile.first_name + ' ' + supplier.last_edition.userprofile.last_name if supplier.last_edition is not None else 'نامعلوم'})

    context = {
        'data': data,
        'supplier_count': supplier_count,
        'brand_count': brand_count,
        'request_count': request_count,
        'buy_price_avg': buy_price_avg,
        'sell_price_avg': sell_price_avg,
        'most_supplier': most_supplier,
        'latest_supplier': latest_supplier

    }
    return JsonResponse(context, safe=False)


def product_detailed_report(request):
    categories = Category.objects.all()
    prisons = Prison.objects.all()

    context = {
        'categories': categories,
        'prisons': prisons
    }
    return render(request, "reports/product_detailed_report.html", context)


def search_detailed_product(request):
    product_id = json.loads(request.body).get('product_id')
    prison_id = json.loads(request.body).get('prison_id')
    start_date = json.loads(request.body).get('start_date')
    end_date = json.loads(request.body).get('end_date')
    product = Product.objects.get(id=product_id)
    prisons = Prison.objects.all()
    suppliers = Supplier.objects.all()

    orders = Order.objects.filter(product=product)
    if start_date != '' and end_date != '':
        start_date = jdatetime.datetime.strptime(start_date, '%Y/%m/%d').togregorian()
        end_date = jdatetime.datetime.strptime(end_date, '%Y/%m/%d').togregorian()
        orders = orders.filter(request__created_date__range=[start_date, end_date])
    elif start_date != '' and end_date == '':
        start_date = jdatetime.datetime.strptime(start_date, '%Y/%m/%d').togregorian()
        orders = orders.filter(request__created_date__gte=start_date)
    elif start_date == '' and end_date != '':
        end_date = jdatetime.datetime.strptime(end_date, '%Y/%m/%d').togregorian()
        orders = orders.filter(request__created_date__lte=end_date)

    orders = orders.order_by("-created_date")
    product_name = product.name
    product_category = product.category.name
    product_unit = product.based_quantity
    orders_count = orders.count()
    orders_quantity = orders.aggregate(Sum("quantity"))
    dq_sum = orders.aggregate(Sum('delivered_quantity'))
    sdp_avg = orders.aggregate(Avg('sell_deliver_price'))
    supplier_count = orders.values('supplier').distinct().count()
    with_brand_count = orders.values('brand').exclude(brand__company_name='بدون برند').distinct().count()
    no_brand_count = orders.filter(brand__company_name='بدون برند').count()
    if orders.count == 0:
        return JsonResponse({'orders_count': 0}, safe=False)
    prison_response = []
    for prison in prisons:
        prison_orders = orders.filter(request__prison=prison)
        if len(prison_orders) != 0:
            prison_response.append({'prison_name': prison.name,
                                    'order_quantity': prison_orders.aggregate(
                                        Sum("quantity"))['quantity__sum'], 'order_counter': prison_orders.count()})

    suppliers_response = []
    for supplier in suppliers:
        supplier_orders = orders.filter(supplier=supplier)
        if len(supplier_orders) != 0:
            suppliers_response.append(
                {'supplier_name': supplier.company_name,
                 'order_quantity': supplier_orders.aggregate(Sum("quantity"))['quantity__sum'],
                 'order_counter': supplier_orders.count()})

    requests_response = []
    for order in orders:
        supplier_product_price = SupplierProduct.objects.filter(request=order.request, product=order.product,
                                                                supplier=order.supplier,
                                                                brand=order.brand).order_by("-created_date")
        if len(supplier_product_price) == 0:
            supplier_product_price = SupplierProduct.objects.filter(product=order.product,
                                                                    supplier=order.supplier,
                                                                    brand=order.brand).order_by("-created_date")
            if len(supplier_product_price) != 0:
                sellprice = supplier_product_price[0].price2m
                buyprice = supplier_product_price[0].price
            else:
                sellprice = 0
                buyprice = 0
        else:
            sellprice = supplier_product_price[0].price2m
            buyprice = supplier_product_price[0].price

        requests_response.append(
            {'request_number': order.request.number, 'request_prison': order.request.prison.name,
             'request_branch': order.request.branch.name,
             'order_supplier': order.supplier.company_name, 'order_brand': order.brand.company_name,
             'order_quantity': order.quantity, 'order_delivered_quantity': order.delivered_quantity,
             'order_dsell_price': order.sell_deliver_price, 'order_sell_price': sellprice})

    context = {
        'supplier_count': supplier_count,
        'product_name': product_name,
        'product_category': product_category,
        'product_unit': product_unit,
        'orders_count': orders_count,
        'dq_sum': dq_sum,
        'sdp_avg': sdp_avg,
        'with_brand_count': with_brand_count,
        'no_brand_count': no_brand_count,
        'prisons_response': prison_response,
        'suppliers_response': suppliers_response,
        'requests_response': requests_response,
        'orders_quantity': orders_quantity

    }
    return JsonResponse(context, safe=False)
