<template>
  <div class="wrapper">
    <div class="funds-list">
      <div style="
          display: flex;
          width: 80%;
          justify-content: center;
          margin: 0 auto;
        ">
        <div class="funds-list-title">新股申购待缴费列表</div>
      </div>
      <div class="funds-list-item" v-if="sgList.length != 0" v-for="(item, index) in sgList" :key="index">
        <div class="funds-list-item__account clearfix">
          <div class="col-xs-3 account">
            <!-- 配资资金：17.63 股票可用金额：17.63 配资管理费：已结束 -->
            <div class="order-title">新股名称</div>
            <div class="order-money">{{ item.xgname || 0 }}</div>
            <!-- <div class="order-title">保证金</div>
            <div class="order-money">{{ item.bzj || 0 }}</div> -->
          </div>
          <div class="col-xs-3 account">
            <!-- 保证金：100 股票市值：0 股票盈亏：0  -->
            <div class="order-title">申购代码</div>
            <div class="order-money">{{ item.codes || 0 }}</div>
            <!-- <div class="order-title">买入数量</div>
            <div class="order-money">{{ item.nums || 0 }}</div>  -->
          </div>
          <!-- <div class="col-xs-3 account">
            <div class="order-title">配售申购</div>
            <div class="order-money">100</div>
          </div> -->
          <div class="col-xs-3 account">
            <div class="order-title">缴费金额</div>
            <div class="order-money">{{item.bzj}}</div>
          </div>
          <div class="col-xs-3 account">
            <!-- <div class="order-title">状态</div>
                        <div class="order-money">
                            <span v-if="i.zt==0">已关闭</span>
                            <span v-if="i.zt==1">已开启</span>
                        </div> -->
            <div class="peizi" @click="getpay(item)">缴费</div>
          </div>
          <!-- <div class="col-xs-3 account" v-if="item.zts != 3">
            <div class="order-title">状态</div>
            <div class="order-money">    
              <span v-if="item.zts == 4">已缴款</span>
              <span v-if="item.zts == 3">未审核</span>
              <span v-if="item.zts == 1">已中签</span>
              <span v-if="item.zts == 2">未中签</span>
            </div>
          </div> -->
        </div>
      </div>

      <!-- <div class="funds-list-loadmore">
                点击加载更多内容
            </div> -->
      <el-dialog :title="shenhaoTitle" show-close :visible.sync="dialogCommunity" custom-class="black-dialog"
        width="80%" class="storeinformation_popup_wapper">
        <div class="storeinformation_popup">
          <el-form :model="haoForm" ref="haoForm" class="demo-form" size="mini">
            <div class="storeinformation_popup_top">
              <el-form-item label="申请价格">
                <el-input readonly class="width-auto" type="text" v-model="tijiao.price" placeholder="请填写申请价格"
                  show-word-limit oninput="value=value.replace(/[^\d]/g,'')">
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="可用余额">
                <el-input
                  readonly
                  class="width-auto"
                  type="text"
                  :value="$store.state.userInfo.enableAmt"
                  placeholder="请填写可用余额"
                  show-word-limit
                  oninput="value=value.replace(/[^\d]/g,'')"
                >
                </el-input>
              </el-form-item> -->
              <el-form-item label="申购签数" prop="shehao" :rules="[
                { required: true, message: '申购签数不能为空' },
                { type: 'number', message: '申购签数必须为数字值' },
                {
                  validator: (rule, value, callback) => {
                    if (value > tijiao.max_apply_lot) {
                      callback(
                        new Error(
                          '该股申购签数必须小于' +
                          tijiao.max_apply_lot
                        )
                      );
                    } else if (value < tijiao.min_apply_lot) {
                      callback(new Error('申购签数必须>=' + tijiao.min_apply_lot));
                    } else {
                      callback();
                    }
                  },
                },
              ]">
                <el-input class="width-auto" type="text" v-model.number="haoForm.shehao" placeholder="请填写申购签数"
                  show-word-limit oninput="value=value.replace(/[^\d]/g,'')">
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="买入金额">
                <el-input
                  readonly
                  class="width-auto"
                  type="text"
                  :value="
                    (
                      Number(tijiao.price) * Number(haoForm.shehao || 0)
                    ).toFixed(2)
                  "
                  placeholder="请填写买入金额"
                  show-word-limit
                  oninput="value=value.replace(/[^\d]/g,'')"
                >
                </el-input>
              </el-form-item> -->
            </div>
            <el-form-item style="text-align: center">
              <el-button class="big-btn" type="primary" @click="dialogCommunity = false">取 消</el-button>
              <el-button class="big-btn" type="danger" @click="shengData()">
                确 定
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <div v-if="sgList.length == 0" style="text-align:center;margin-top:30vh">
      暂无订单
    </div>
  </div>
</template>

<script>
import * as api from "../../axios/api";
import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      list: {
        list: [],
      },
      shengou: "",
      dialogCommunity: false,
      haoForm: {
        shehao: "",
      },
      tijiao: "",
      sgList: [],
      shenhaoTitle: "",
      Error,
    };
  },
  computed: {
    // progress() {
    //     let per = this.$store.state.userInfo.userAmt/(this.$store.state.userInfo.userAmt+this.$store.state.userInfo.userIndexAmt) * 100 > 100?100:this.$store.state.userInfo.userAmt/(this.$store.state.userInfo.userAmt+this.$store.state.userInfo.userIndexAmt) * 100 > 100?this.$store.state.userInfo.userAmt/(this.$store.state.userInfo.userAmt+this.$store.state.userInfo.userIndexAmt) * 100 > 100?100:this.$store.state.userInfo.userAmt/(this.$store.state.userInfo.userAmt+this.$store.state.userInfo.userIndexAmt) * 100:100
    //     return per
    // }
  },
  created() {
    this.shengouList();
  },
  methods: {
    async getpay(item) {
      let opt = {
        lists_id: item.lists_id
      };
      let data = await api.kouKuan(opt);
      if (data.status == 200) {
        Toast('缴费成功')
        this.shengouList()
      } else {
        Toast('缴费失败')
      }
    },
    async shengouList() {
      let opt = {
        zts: 1,
      };
      let data = await api.xingusgsList(opt);
      this.sgList = data.data.list;
      console.log(this.sgList.length)
    },

    async getUserInfo() {
      // 获取用户信息
      let data = await api.getUserInfo();
      if (data.status === 0) {
        this.$store.state.userInfo = data.data;
      } else {
        Toast(data.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.funds-list-item__account {
  display: flex;
  align-items: center;
}

.funds-list-item {
  padding: 0.2rem 0.16rem 0.45rem !important;
}

body {
  background-color: #16171d;
}

.wrapper {
  padding-bottom: 0;
}

.funds-info {
  display: block;
  width: 6.9rem;
  margin: 0.3rem;
  padding: 0.6rem 0.2rem 0.12rem 0.2rem;
  background-color: #1f2636;
  border-radius: 0.1rem;

  .money-info {
    padding-bottom: 0.42rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #fff2;

    &_left {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .money-info_total {
        height: 0.4rem;
        display: flex;
        align-items: center;

        .ino-ico {
          width: 0.38rem;
          height: 0.38rem;
          margin-right: 0.15rem;
        }

        .ino-title {
          font-size: 0.24rem;
          margin-right: 0.15rem;
        }

        .ino-money {
          font-size: 0.4rem;
          color: #009c46;
          letter-spacing: 0;
          font-family: lightnumber;
        }
      }

      .money-info_progress {
        width: 100%;
        height: 0.1rem;
        border-radius: 0.05rem;
        background-color: #4e5a73;

        &__inner {
          background-color: #e6003e;
          height: 0.1rem;
          border-radius: 0.05rem;
        }
      }
    }

    &_right {
      margin-left: 0.3rem;
      width: 1.4rem;
      height: 1.14rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .money-info_botton {
        width: 1.4rem;
        height: 0.42rem;
        line-height: 0.42rem;
        font-size: 0.24rem;
        color: #fff;
        text-align: center;

        &.redBtn {
          background-color: #e6003e;
          border-radius: 0.21rem;
        }

        &.blueBtn {
          background-color: #024da1;
          border-radius: 0.21rem;
        }
      }
    }
  }

  .money-detail {
    position: relative;

    &_title {
      padding: 0.3rem 0;
      display: flex;
      justify-content: space-between;
    }

    &_acc {
      display: flex;
      flex-wrap: wrap;

      .acc {
        padding: 0;
        display: flex;
        width: 50%;

        .acc-item {
          margin-left: 0.2rem;
          margin-bottom: 0.3rem;
        }

        .acc-item_title {
          font-size: 0.24rem;
          color: #fff;
          line-height: 0.3rem;
          margin-bottom: 0.2rem;
        }

        .acc-item_num {
          font-size: 0.3rem;
          color: #e6003e;
          font-family: lightnumber;
        }
      }
    }
  }
}

.funds-list {
  display: block;
  width: 6.9rem;
  margin: 0.3rem;
  padding: 0.12rem 0.2rem 0.12rem 0.2rem;
  background-color: #1f2636;
  border-radius: 0.1rem;

  &-title {
    text-align: center;
    padding: 0.26rem 0;
    color: #fff;
    font-size: 0.25rem;
    font-weight: bold;
  }

  &-item {
    padding: 0.45rem 0.16rem;
    border-top: 1px solid #fff2;

    &__title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.35rem;

      &-left {
        font-size: 0.3rem;

        .zhishu {
          font-size: 0.2rem;
          color: #fff;
          padding: 0.05rem 0.15rem;
          background-image: url(../../assets/ico/zhishu.png);
          background-size: 100% 100%;
        }
      }

      &-right {
        font-size: 0.24rem;
      }
    }

    .account {
      padding: 0;

      .order-title {
        color: #aaaaaa;
        font-size: 0.24rem;
        margin-bottom: 0.1rem;
        margin-top: 0.4rem;
        text-align: center;
      }

      .order-money {
        color: #fff;
        font-size: 0.24rem;
        margin-bottom: 0.13rem;
        text-align: center;
      }

      .peizi {
        height: 0.34rem;
        background-color: #138eb4;
        border-radius: 0.17rem;
        text-align: center;
        width: 1.26rem;
        line-height: 0.35rem;
        // margin-top: 0.16rem;
      }
    }
  }

  &-loadmore {
    height: 0.67rem;
    line-height: 0.67rem;
    text-align: center;
    font-size: 0.27rem;
    color: #fff;
    background-color: #494951;
    border-radius: 3px;
    margin-bottom: 0.4rem;
  }
}

.red-theme {
  .funds-info {
    background-color: #fff;

    .ino-title {
      color: #000;
    }

    .acc-item_title {
      color: #000 !important;
    }
  }

  .funds-list {
    background-color: #fff;

    &-title {
      color: #000;
    }

    &-item {
      border-top-color: #2222;

      &__title-left {
        color: #222;
      }

      .account .order-title {
        color: #666666;
      }

      .account .order-money {
        color: #000;
      }

      .account .peizi {
        background-color: #bc1816;
        color: #fff;
      }
    }
  }

  .funds-list-loadmore {
    background-color: #bc1816;
  }
}

.storeinformation_popup_wrapper {
  .el-dialog {}

  .storeinformation_popup {
    background-color: #10141e;

    .el-input {
      width: auto;
    }
  }
}

.width-auto {
  width: auto;
}

.big-btn {
  width: 120px;
  border-radius: 14px;
}
</style>
<style lang="less">
.black-dialog {
  background-color: #1d2433 !important;
  color: #fff;
  border-radius: 6px !important;

  .el-dialog__header {
    background-color: #2c374e;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    color: #fff;
  }

  .el-dialog__title {
    color: #fff;
  }

  .el-form-item {
    display: flex;
    justify-content: space-around;
  }

  .el-form-item__label {
    color: white;
  }

  .el-input {
    .el-input__inner {
      background-color: #2c374e;
      border: none;
      border-radius: 14px;
      color: #eee;
    }

    color: #eee;
  }

  .el-dialog__body {
    padding-bottom: 12px;
  }
}
</style>
