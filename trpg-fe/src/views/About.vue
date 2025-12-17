<template>
  <div>
    <Title>關於</Title>
    <Tab :page="['介紹','團務功能','角色卡']" style="text-align: center">
      <div slot="介紹" class="about">
        <router-link to="/privacy">隱私權政策</router-link>
      </div>
      <div slot="團務功能">
        <div>
          團務系統可以讓你上傳你的角色卡<br>
          方便跑團時的GM以及團員檢閱<br>
          一個團務的玩家上限是15人<br>
        </div>
      </div>
      <div slot="角色卡">
        <div>
          一人可擁有的角色卡上限為50張<br>
          而目前支援的系統為<br>
          龍與地下城5版<br>
        </div>
      </div>
    </Tab>
  </div>
</template>

<script>
import Title from "@/components/Title";
import Tab from "@/components/Tab";

export default {
  name: "About",
  components: {Tab, Title}
}
</script>

<style scoped>

</style>
