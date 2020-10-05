<template>
  <span id="forkongithub">
    <a :href="url">🥄Fork me on GitHub</a>
  </span>
</template>

<script>
export default {
  name: "ForkMe",
  props: {
    url: {
      type: String,
      required: true
    }
  }
};
</script>
>

<style>
#forkongithub {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 9999;
}
#forkongithub a {
  background-color: var(--c_bg-emphasis-main);
  color: var(--c_text-onEmphasis);
  text-decoration: none;
  text-align: center;
  font-weight: bold;
  padding: 0.5rem 0 1rem;
  font-size: 2rem;
  width: 240px;
  position: absolute;
  bottom: 40px;
  right: -50px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.8);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.8);
  transition: background-color 0.3s;
}
#forkongithub a:hover {
  background: var(--c_bg-emphasis-dark);
}

#forkongithub a::before,
#forkongithub a::after {
  content: "";
  width: 100%;
  display: block;
  position: absolute;
  top: 1px;
  left: 0;
  height: 1px;
  background: #fff;
}
#forkongithub a::after {
  bottom: 1px;
  top: auto;
}
</style>
