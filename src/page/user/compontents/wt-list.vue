<template>
  <div class="wrapper hisList">
    <div v-if="list.length<=0" class="empty text-center">
      暂无订单信息!
    </div>
    <div v-if="list.length>0">
      <ul
        class="order-info-box-wrap"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li v-for="item in list" :key="item.key">
          <div class="order-info-box">
            <div class="order-title">
              <span class="main">{{item.stockName}}</span>
              <span class="secondary">({{item.stockCode}})</span>
              <span :class="item.orderDirection=='买涨'?'type type-up':'type type-down'">委托买入</span>
              <span v-if="item.stockPlate=='科创'" :class="item.stockPlate=='科创'?'type':''">科创</span>
              <span class="pull-right">总盈亏:<b
                :class="item.allProfitAndLose<0?'space green':item.allProfitAndLose==0?'space':'space red'">{{item.allProfitAndLose}}</b></span>
            </div>
            <div class="order-info">
              <p class="clearfix">
                <span class="col-xs-4 lt">
                  委托价/最新
                </span>
                <span class="col-xs-4 lt text-center">
                  委托数量/已成
                </span>
                <span class="col-xs-4 lt text-right">
                  委托总金额
                </span>
              </p>
              <p class="clearfix">
                <span class="col-xs-4"><b class="space">{{item.triggerPrice}}/{{item.nowPrice}}</b></span>
                <span class="col-xs-4 text-center"><b class="space">{{item.orderNum}}/{{item.finishHandNum}}</b></span>
                <span class="col-xs-4 text-right"><b>{{item.orderTotalPrice}}</b></span>
                <!-- <span class="col-xs-4 text-right">点差费:<b class="space">{{item.orderStayFee}}</b></span> -->
              </p>
            </div>

            <div class="order-foot clearfix">
              <div style="text-align: left;color: #666;padding: 0;" class="col-xs-6">
                <b v-if="item.buyOrderTime">{{new Date(item.buyOrderTime) | timeFormat}}</b>
                <b v-else></b>
              </div>
              <div v-if="item.orderStatus == 0" @click="sell(item)" class="foot-btn">
                <i class='font-icon'></i>
                我要撤单
              </div>
              <div v-else-if="item.orderStatus == 1">
                <i class='font-icon'></i>
                已买入
              </div>
              <div v-else>
                <i class='font-icon'></i>
                已撤单
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-show="loading" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
        加载中...
      </div>
      <div v-show="!loading" class="load-all text-center">
        已全部加载
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, MessageBox } from 'mint-ui'
import * as api from '@/axios/api'

export default {
  components: {},
  props: {
    hasChangeSell: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      currentNum: 0,
      list: [],
      total: 0 // 记录总值
    }
  },
  watch: {
    hasChangeSell (newval) {
      if (newval) {
        this.list = []
        this.getListDetail()
      }
    },
  },
  computed: {},
  created () {},
  mounted () {
    this.getListDetail()
  },
  methods: {
    async loadMore () {
      if (this.list.length < this.pageSize || this.loading || this.total <= this.currentNum) {
        return
      }
      this.loading = true
      // 加载下一页
      this.pageNum++
      await this.getListDetail()
      this.currentNum = this.pageNum * this.pageSize
      this.loading = false
    },
    async getListDetail () {
      let opt = {
        state: 1,
        stockCode: '', // 代码
        stockSpell: '', // 简拼
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await api.getOrderListWt(opt)
      if (data.status === 0) {
        data.data.list.forEach(element => {
          this.list.push(element)
        })
        this.total = data.data.total
      } else {
        Toast(data.msg)
      }
    },
    sell (val) {
      // if(!this.canBuyStatus()){
      //     Toast('不在开盘时间内，暂不能交易！')
      //     return
      // }
      if (val.orderStatus !== 0) {
        Toast('已买入，不可撤单')
        return
      }
      MessageBox.confirm('您确定要撤单吗?').then(async action => {
        let opt = {
          id: val.id
        }
        let data = await api.sellWt(opt)
        if (data.status === 0) {
          Toast(data.msg)
          this.hasChangeSell = true
          this.handleOptions(this.hasChangeSell)
          this.getListDetail()
        } else {
          Toast(data.msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .wrapper {
    padding-bottom: 0
  }
  .hisList {
    margin-top: 0.8rem;
  }

  .order-title {
    .icon--kulian {
      font-size: 0.7rem;
      color: #006b96;
    }

    .icon-xiaolian {
      font-size: 0.6rem;
      color: #d50000;
    }

    .icon-pingchanglian {
      font-size: 0.6rem;
      color: #ddd;
    }
  }
    #app.red-theme{
    .order-info-box{
      background-color: #fff;
      .order-title{
        .main {
          color: #000;
        }
      }
      .order-info{
        color: #000;
      }
    }
    .order-foot {
      border-top-color: #ccc;
    }
    .load-all{
      background-color: #BB1815;
      color: #fff;
    }
  }
</style>
