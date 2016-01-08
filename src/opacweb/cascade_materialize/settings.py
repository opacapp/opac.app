# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _
from cmsplugin_cascade.settings import cascade_config, orig_config

CASCADE_PLUGINS = ('container', )

cascade_config['materialize'] = {
    'breakpoints': (
        ('s', (600, 'mobile-phone', _("mobile"), 600)),
        ('m', (600, 'laptop', _("laptops"), 600)),
        ('l', (992, 'desktop', _("large desktops"), 1170)),
    ),
    'gutter': 30,
}
cascade_config['materialize'].update(orig_config.get('materialize', {}))

