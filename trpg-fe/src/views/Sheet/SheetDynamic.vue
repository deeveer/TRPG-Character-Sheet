<template>
  <div>
    <!-- 如果有 session 查詢參數，使用查看模式 -->
    <SheetView v-if="$route.query.session" :session="$route.query.session" />
    <!-- 否則使用編輯模式 -->
    <SheetEdit v-else />
  </div>
</template>

<script>
import SheetEdit from './SheetEdit'
import SheetView from './SheetView'

export default {
  name: 'SheetDynamic',
  components: {
    SheetEdit,
    SheetView
  }
}
</script>
