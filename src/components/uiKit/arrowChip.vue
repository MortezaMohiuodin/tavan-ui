<template>
  <div class="arrowChip">
    <span class="arrowChipText">
      <slot />
    </span>
    <span class="arrowChipCaret" />
  </div>
</template>

<style scoped lang="scss">
.arrowChip{
  color: black;
  display: flex;
  align-items: center;
  .arrowChipText{
    position: relative;
    z-index: 1;
    display: inline-block;
    background: #fff;
    height: 50px;
    line-height: 50px;
    border-radius: 0 20px 20px 0;
    padding-right: 20px;
    font-weight: 600;
  }
  .arrowChipCaret{
    position: relative;
    display: block;
    height: 50px;
    width: 50px;
    border: inherit;
    clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
    transform: rotate(45deg);
    border-radius: 0 0 0 0.4rem;
    right: -30px;
    background: #fff;
  }
}
</style>
