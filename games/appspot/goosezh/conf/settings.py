USE_I18N = True

# Valid languages
LANGUAGES = (
    # 'en', 'zh_TW' should match the directories in conf/locale/*
    ('en', _('English')),
    ('zh_CN', _('Simplified Chinese')),
    ('zh_TW', _('Taiwan Chinese')),
    ('zh_HK', _('Hong Kong Chinese')),
)

# This is a default language
LANGUAGE_CODE = 'en'

# add the following to force multilingual on these items
aaa = _('Start')
