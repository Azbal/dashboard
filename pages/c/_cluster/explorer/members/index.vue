<script>
import { MANAGEMENT } from '@/config/types';
import ResourceTable from '@/components/ResourceTable';
import Loading from '@/components/Loading';
import { NAME } from '@/config/product/explorer';
import Masthead from '@/components/ResourceList/Masthead';
import { AGE, ROLE, STATE, PRINCIPAL } from '@/config/table-headers';

export default {
  components: {
    Loading, Masthead, ResourceTable
  },

  async fetch() {
    const clusterRoleTemplateBindingSchema = this.$store.getters[`management/schemaFor`](MANAGEMENT.CLUSTER_ROLE_TEMPLATE_BINDING);

    const hydration = [
      this.$store.dispatch(`management/findAll`, { type: MANAGEMENT.USER }),
      this.$store.dispatch(`management/findAll`, { type: MANAGEMENT.ROLE_TEMPLATE })
    ];
    const clusterRoleTemplateBindings = clusterRoleTemplateBindingSchema ? await this.$store.dispatch(`management/findAll`, { type: MANAGEMENT.CLUSTER_ROLE_TEMPLATE_BINDING }) : [];

    await Promise.all(hydration);
    this.$set(this, 'clusterRoleTemplateBindings', clusterRoleTemplateBindings);
  },

  data() {
    return {
      schema:         this.$store.getters[`management/schemaFor`](MANAGEMENT.CLUSTER_ROLE_TEMPLATE_BINDING),
      headers:        [
        STATE,
        PRINCIPAL,
        ROLE,
        AGE
      ],
      createLocation: {
        name:   'c-cluster-product-resource-create',
        params: {
          product:  NAME,
          resource: MANAGEMENT.CLUSTER_ROLE_TEMPLATE_BINDING,
        }
      },
      resource:                    MANAGEMENT.CLUSTER_ROLE_TEMPLATE_BINDING,
      clusterRoleTemplateBindings: null,
    };
  },

  computed: {
    filteredClusterRoleTemplateBindings() {
      return this.clusterRoleTemplateBindings
        .filter(b => !b.user?.isSystem && b.clusterName === this.$store.getters['currentCluster'].id);
    }
  },

};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <div v-else>
    <Masthead
      :schema="schema"
      :resource="resource"
      :create-location="createLocation"
      :create-button-label="t('members.createActionLabel')"
    />
    <ResourceTable
      :schema="schema"
      :headers="headers"
      :rows="filteredClusterRoleTemplateBindings"
      :groupable="false"
      sub-search="subSearch"
      :sub-fields="['nameDisplay']"
    />
  </div>
</template>
