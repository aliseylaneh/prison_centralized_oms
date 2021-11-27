import pickle

import environment as environment

from main.models import Unit, Supplier, Category


def getProductUnit(str):
    if str == 'Gr':
        return Unit.gr
    elif str == 'Kg':
        return Unit.kg
    elif str == 'Box':
        return Unit.box
    elif str == 'Each':
        return Unit.each
    elif str == 'Tn':
        return Unit.tn
    elif str == 'متر':
        return Unit.meter


def deactivated_suppliers():
    suppliers = Supplier.objects.filter(is_active=False)
    data = []
    for supplier in suppliers:
        data.append(supplier.company_name)
    return data


def checkStatus(status):
    if status == 'فعال':
        return True
    elif status == 'غیر فعال':
        return False


def set_user_signatures(user, req_signature):
    user_signatures = pickle.loads(req_signature)

    if user.groups.all()[0].name == "ceo":
        user_signatures['ceo'] = user.email

    elif user.groups.all()[0].name == "commercial_manager":
        if user_signatures['commercial_expert'] is None:
            user_signatures[
                'commercial_expert'] = user.email
            user_signatures[
                'commercial_manager'] = user.email
        else:
            user_signatures[
                'commercial_manager'] = user.email

    elif user.groups.all()[0].name == "commercial_expert":
        user_signatures[
            'commercial_expert'] = user.email + ' ' + user.userprofile.last_name

    elif user.groups.all()[0].name == "financial_manager":
        user_signatures[
            'financial_manager'] = user.email

    return pickle.dumps(user_signatures)


def check_user_signatures(req_signature):
    user_signatures = pickle.loads(req_signature)
    if user_signatures['commercial_expert'] is None:
        return False
    return True


def check_manager_signatures(req_signature):
    user_signatures = pickle.loads(req_signature)
    if user_signatures['commercial_manager'] is None:
        return False
    return True


