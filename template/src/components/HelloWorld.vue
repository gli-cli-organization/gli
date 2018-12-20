<template>
  <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
</template>

<script>
export default {
  name: 'HelloWorld',
  data{{#unless_eq lintConfig "airbnb"}} {{/unless_eq}}() {
    return {

    }{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
  }{{#if_eq lintConfig "airbnb"}},{{/if_eq}}
}{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
</script>


