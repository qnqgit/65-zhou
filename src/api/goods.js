/**
 * 商品接口封装
 */

import request from '@/utils/request'

/**
 * 获取商品列表
 */
export const getGoodsList = ({ query = '', pagenum = 1, pagesize = 20 } = {}) => request({
  method: 'GET',
  url: '/goods',
  params: { // GET 参数
    query,
    pagenum,
    pagesize
  }
}).then(res => res.data)

/**
 * 添加商品
 */
export const addGoods = ({ goods_name, goods_cat, goods_price, goods_number, goods_weight, attrs = [], pics = [], goods_introduce = '' }) => request({
  method: 'POST',
  url: '/goods',
  data: { // POST 参数
    goods_name,
    goods_cat,
    goods_price,
    goods_number,
    goods_weight,
    attrs,
    pics,
    goods_introduce
  }
}).then(res => res.data)
