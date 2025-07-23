from django.urls import reverse

def dashboard_pages():
    return [{
        'title': 'Dialog Scripts',
        'icon': 'account_tree',
        'url': reverse('dashboard_dialog_scripts'),
    }]
