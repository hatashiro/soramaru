<template>
  <div class='index-wrapper'>
    <img src='/static/soramaru.jpg'>
    <h1>そらまる</h1>
  </div>
  <div class='cursor-help'>➜</div>
</template>

<style scoped>
.index-wrapper {
  width: 200px;
  margin: 100px auto 0;
  text-align: center;

  img {
    display: block;
    width: 100%;
    border-radius: 50%;
  }

  h1 {
    font-size: 43px;
    margin: 20px 0 0;
  }
}

.cursor-help {
  font-size: 33px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  position: fixed;
  top: 23px;
  right: 39px;
  transform: rotate(-33deg);
  color: #dedede;
}
</style>
