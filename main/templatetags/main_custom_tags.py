from django import template

from account.models import UserProfile

register = template.Library()


@register.filter(name='groupIndex')
def group_index(group, i):
    return group[i]


@register.filter(name='get_price')
def get_price(value, percent):
    percent = 100 - percent
    return int((percent * value) / 100)


@register.filter(name='multiply_price')
def multiply_price(value, count):
    return value * count


@register.filter(name='get_name')
def get_name(email):
    last_name = UserProfile.objects.get(user__email=email).last_name
    return last_name


@register.filter(name='get_margin')
def sell_price_margin(sell_price, consumer_price):
    if consumer_price >= 1000 and sell_price >= 1000:
        return "{:.2f}".format(((consumer_price - sell_price) / consumer_price) * 100)
    return None


@register.filter(name='tax_price')
def tax_price(price):
    three_percent = int((9 * price) / 100)
    return three_percent


@register.filter(name='tax_final_price')
def tax_final_price(price, tax):
    three_percent = int((97 * tax) / 100)
    six_percent = int((94 * tax) / 100)
    tax = three_percent + six_percent
    return price + tax
