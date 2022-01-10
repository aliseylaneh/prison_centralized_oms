from django.urls import path
from reports import views
from django.views.decorators.csrf import csrf_exempt

app_name = 'reports'

urlpatterns = [

    path('report', views.report_home, name='report'),
    path('category_report', csrf_exempt(views.search_category), name='category_report'),
    path('review_request_report', csrf_exempt(views.review_request), name='review_request_report'),

    path('product_report', views.product_report, name='product_report'),
    path('product_search_report', csrf_exempt(views.search_product), name='product_search_report')

]
