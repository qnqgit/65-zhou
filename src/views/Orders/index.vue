<template>
<div>
  <p>订单列表</p>
  <el-cascader :options="options"></el-cascader>
  <br><br><br>

  <!-- 地图容器 -->
  <div id="container"></div>
</div>
</template>

<script>
// https://github.com/Plortinus/element-china-area-data
/* provinceAndCityData是省市二级联动数据（不带“全部”选项）
regionData是省市区三级联动数据（不带“全部”选项）
provinceAndCityDataPlus是省市区三级联动数据（带“全部”选项）
regionDataPlus是省市区三级联动数据（带“全部”选项）
"全部"选项绑定的value是空字符串""
CodeToText是个大对象，属性是区域码，属性值是汉字 用法例如：CodeToText['110000']输出北京市
TextToCode是个大对象，属性是汉字，属性值是区域码 用法例如：TextToCode['北京市'].code输出110000,TextToCode['北京市']['市辖区'].code输出110100,TextToCode['北京市']['市辖区']['朝阳区'].code输出110105 */
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'

export default {
  name: 'OrderList',
  data () {
    return {
      options: regionData
    }
  },

  mounted () {
    var map = new BMap.Map('container')
    var point = new BMap.Point(116.404, 39.915)
    map.centerAndZoom(point, 15)
  }
}
</script>

<style scoped>
#container {
  width: 800px;
  height: 500px;
}
</style>
