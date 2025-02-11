// Settings
import { MANAGEMENT } from './types';

// Adapted from: https://github.com/rancher/ui/blob/08c379a9529f740666a704b52522a468986c3520/lib/shared/addon/utils/constants.js#L564

// Setting IDs
export const SETTING = {
  VERSION_RANCHER:                  'server-version',
  VERSION_CLI:                      'cli-version',
  VERSION_MACHINE:                  'machine-version',
  VERSION_HELM:                     'helm-version',

  CLI_URL:                          {
    DARWIN:                         'cli-url-darwin',
    WINDOWS:                        'cli-url-windows',
    LINUX:                          'cli-url-linux',
  },

  CA_CERTS: 'cacerts',

  AUTH_TOKEN_MAX_TTL_MINUTES:       'auth-token-max-ttl-minutes',
  KUBECONFIG_GENERATE_TOKEN:        'kubeconfig-generate-token',
  KUBECONFIG_TOKEN_TTL_MINUTES:     'kubeconfig-token-ttl-minutes',
  ENGINE_URL:                       'engine-install-url',
  ENGINE_ISO_URL:                   'engine-iso-url',
  FIRST_LOGIN:                      'first-login',
  INGRESS_IP_DOMAIN:                'ingress-ip-domain',
  SERVER_URL:                       'server-url',
  RKE_METADATA_CONFIG:              'rke-metadata-config',
  TELEMETRY:                        'telemetry-opt',
  EULA_AGREED:                      'eula-agreed',
  AUTH_USER_INFO_MAX_AGE_SECONDS:   'auth-user-info-max-age-seconds',
  AUTH_USER_SESSION_TTL_MINUTES:    'auth-user-session-ttl-minutes',
  AUTH_USER_INFO_RESYNC_CRON:       'auth-user-info-resync-cron',
  AUTH_LOCAL_VALIDATE_DESC:         'auth-password-requirements-description',
  CLUSTER_TEMPLATE_ENFORCEMENT:     'cluster-template-enforcement',
  UI_INDEX:                         'ui-index',
  UI_DASHBOARD_INDEX:               'ui-dashboard-index',
  UI_OFFLINE_PREFERRED:             'ui-offline-preferred',
  SYSTEM_DEFAULT_REGISTRY:          'system-default-registry',
  UI_ISSUES:                        'ui-issues',
  PL:                               'ui-pl',
  PL_RANCHER_VALUE:                 'rancher',
  SUPPORTED:                        'has-support',
  BANNERS:                          'ui-banners',
  ISSUES:                           'ui-issues',
  BRAND:                            'ui-brand',
  LOGO_LIGHT:                       'ui-logo-light',
  LOGO_DARK:                        'ui-logo-dark',
  PRIMARY_COLOR:                    'ui-primary-color'
};

// These are the settings that are allowed to be edited via the UI
export const ALLOWED_SETTINGS = {
  [SETTING.CA_CERTS]:                       { kind: 'multiline', readOnly: true },
  // [SETTING.CLUSTER_DEFAULTS]:            { kind: 'json' },
  [SETTING.ENGINE_URL]:                     {},
  [SETTING.ENGINE_ISO_URL]:                 {},
  // [SETTING.PL]:                             {},
  // [SETTING.ISSUES]:                         {},
  [SETTING.INGRESS_IP_DOMAIN]:              {},
  [SETTING.AUTH_USER_INFO_MAX_AGE_SECONDS]: {},
  [SETTING.AUTH_USER_SESSION_TTL_MINUTES]:  {},
  [SETTING.AUTH_TOKEN_MAX_TTL_MINUTES]:     {},
  [SETTING.KUBECONFIG_GENERATE_TOKEN]:      { kind: 'boolean' },
  [SETTING.KUBECONFIG_TOKEN_TTL_MINUTES]:   {},
  [SETTING.AUTH_USER_INFO_RESYNC_CRON]:     {},
  [SETTING.SERVER_URL]:                     { kind: 'url' },
  [SETTING.RKE_METADATA_CONFIG]:            { kind: 'json' },
  // [SETTING.BANNERS]:                        { kind: 'json' },
  [SETTING.SYSTEM_DEFAULT_REGISTRY]:        {},
  [SETTING.UI_INDEX]:                       {},
  [SETTING.UI_DASHBOARD_INDEX]:             {},
  [SETTING.UI_OFFLINE_PREFERRED]:           {
    kind:    'enum',
    options: ['dynamic', 'true', 'false']
  },
  [SETTING.BRAND]:                          {},
  [SETTING.CLUSTER_TEMPLATE_ENFORCEMENT]:   { kind: 'boolean' },

  [SETTING.TELEMETRY]: {
    kind:    'enum',
    options: ['prompt', 'in', 'out']
  },
};

export const fetchOrCreateSetting = async(store, id, val, save = true) => {
  let setting;

  try {
    setting = await store.dispatch('management/find', { type: MANAGEMENT.SETTING, id });
  } catch {
    const schema = store.getters['management/schemaFor'](MANAGEMENT.SETTING);
    const url = schema.linkFor('collection');

    setting = await store.dispatch('management/create', {
      type: MANAGEMENT.SETTING, metadata: { name: id }, value: val, default: val || ''
    });

    if ( save ) {
      setting.save({ url });
    }
  }

  return setting;
};

export const setSetting = async(store, id, val) => {
  const setting = await fetchOrCreateSetting(store, id, val, false);

  setting.value = val;

  return setting.save();
};
