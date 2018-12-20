<template>
  <li><a href="https://github.com/gli-cli-organization/gli" target="_blank">gli</a></li>
</template>

<script>
export default {
  name: 'Gli',
  data{{#unless_eq lintConfig "airbnb"}} {{/unless_eq}}() {
    return {

    }{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
  }{{#if_eq lintConfig "airbnb"}},{{/if_eq}}
}{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
</script>


