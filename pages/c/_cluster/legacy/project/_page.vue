<script>
import EmberPage from '@/components/EmberPage';
import { project } from '@/store/type-map';

const PAGES = { monitoring: 'monitoring/project-setting' };

export default {
  components: { EmberPage },

  data() {
    const page = this.$route.params.page;
    const p = PAGES[page] || page;

    return { page: p };
  },

  computed: {
    project() {
      return project(this.$store.getters);
    },

    src() {
      const prj = project(this.$store.getters);

      if (!!prj) {
        const id = prj.id.replace('/', ':');

        return `/p/${ id }/${ this.page }`;
      }

      return null;
    }
  },

  watch: {
    // User changed project while on this page
    project(a, b) {
      // Changed to no project, so redirect
      if (!a && b) {
        this.$router.replace({ name: 'c-cluster-legacy-project' } );
      }
    }
  }
};
</script>

<template>
  <EmberPage v-if="src" :src="src" />
</template>
