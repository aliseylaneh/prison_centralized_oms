from django.contrib import admin
from import_export import resources

from main.models import *
from import_export.admin import ImportExportModelAdmin


# Register your models here.

class PrisonBranchResource(resources.ModelResource):
    class Meta:
        model = PrisonBranch
        exclude = 'id'


class PrisonBranchAdmin(ImportExportModelAdmin):
    to_encoding = 'utf-8'


class PrisonResource(resources.ModelResource):
    class Meta:
        model = Prison
        exclude = 'id'


class PrisonAdmin(ImportExportModelAdmin):
    to_encoding = 'utf-8'


class CategoryResource(resources.ModelResource):
    class Meta:
        model = Category
        import_id_fields = ['name']


class CategoryAdmin(ImportExportModelAdmin):
    to_encoding = 'utf-8'
    resource_class = CategoryResource


class SupplierResource(resources.ModelResource):
    class Meta:
        model = Supplier
        exclude = 'id'


class SupplierAdmin(ImportExportModelAdmin):
    to_encoding = 'utf-8'


class ProductAdmin(ImportExportModelAdmin):
    to_encoding = 'utf-8'


class BrandResource(resources.ModelResource):
    class Meta:
        model = Brand
        exclude = 'id'


class BrandAdmin(ImportExportModelAdmin):
    to_encoding = 'utf-8'


admin.site.register(Ticket)
admin.site.register(Order)
admin.site.register(Product, ProductAdmin)
admin.site.register(Request)
admin.site.register(Supplier, SupplierAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Prison, PrisonAdmin)
admin.site.register(Conversation)
admin.site.register(Brand, BrandAdmin)
admin.site.register(PrisonBranch, PrisonBranchAdmin)
admin.site.register(SupplierProduct)
