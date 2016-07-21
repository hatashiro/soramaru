<template>
<img class='default' :src='default'>
<img class='small' :src='small'>
</template>

<script>
export default {
  props: ['default', 'small']
};
</script>

<style scoped>
img.default {
  width: 100%;
  display: block;
  @media (max-width: 435px) {
    display: none;
  }
}
img.small {
  width: 100%;
  display: block;
  @media (min-width: 436px) {
    display: none;
  }
}
</style>
