from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from cms.models.pluginmodel import CMSPlugin


class CardPlugin(CMSPluginBase):
    model = CMSPlugin
    render_template = "opaccms/card.html"
    cache = False
    allow_children = True

plugin_pool.register_plugin(CardPlugin)