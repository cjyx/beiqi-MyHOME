<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <div class="sign-content">
        <div class="sign-btn">
          <div>
            <!--<h2 @click="signToday">{{signText}}</h2>-->
            <h2 @click="signToday" v-if="signDetail.signStatus==1">{{signText}}</h2>
            <h2 v-if="signDetail.signStatus==0">已签到</h2>
          </div>
        </div>
        <div class="sign-day">
          <span><h2>{{signDetail.cumulateCount}}</h2>累计签到天数</span>
          <span><h2>{{signDetail.signCount}}</h2>连续签到天数</span>
        </div>
      </div>
      <div class="rule">
        <p>
          <router-link :to="{ name: 'signRule'}">
           <span>签到规则</span>
          </router-link>
          <i class="iconfont icon-more"></i>
        </p>
      </div>
      <!--<vue-event-calendar :events="events" @monthChanged="" @dayChanged=""></vue-event-calendar>-->
      <div id="calendar">
        <div class="month">
          <ul>
            <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
            <li class="year-month">
              <span>{{ currentYear }}年</span>
              <span>{{ currentMonth }}月</span>
            </li>
            <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
          </ul>
        </div>
        <ul class="weekdays">
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li style="color:#EA6E30">六</li>
          <li style="color:#EA6E30">日</li>
        </ul>
        <ul class="days">
          <li v-for="(item,key) in dateList" :key="key">
            <span v-if="item.month != currentMonth" class="other-month">{{item.day}}</span>
            <span v-else-if="item.year== new Date().getFullYear() && item.month == new Date().getMonth()+1 && item.day == new Date().getDate()" :class="item.sign ? 'active':'current'"> {{item.day }} </span>
            <span v-else-if="item.sign" class="active">{{ item.day}}</span>
            <span v-else-if="item.canSign" class="signNum" @click="pick(item)"> <i>{{ item.day}}</i> <br/> 补签 </span>
            <span v-else>{{ item.day}}</span> <!--@click="dayPick(item)"-->
          </li>
        </ul>
      </div>
    </div>
    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="false" :state="1" @onHide="modalSuccess = false"
               :content="'确定消耗'+consumeExperience+'经验进行补签到？'"
               :cancelText="'取消'" @onCancel="modalSuccess = false"
               :okText="'确定'" @onOk="canSign">
    </modal-bar>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '签到',
        signText:'点击签到',
        currentDay: 1,
        currentMonth: 1,
        currentYear: 1970,
        currentWeek: 1,
        dateList:[],
        days: [],
        signDetail:{},
        events:[],
        canEvents:[],
        modalSuccess:false,
        consumeExperience:0,
        canSignDate:0,
        signClick:0,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    created: function() {
      this.init();
    },
    mounted: function () {
      this.native.grabHandler('activity.sign');
    },
    methods: {
      init(){
        var postData = {
          token:this.token
        };
        this.native.apiHandler('	XS-BUS-QDLB', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            this.signDetail = response.body.resultData;
            this.events=response.body.resultData.list;
            let date = new Date();
            this.currentYear = date.getFullYear();
            this.currentMonth = date.getMonth() + 1;
            this.initData(this.formatDate(this.currentYear , this.currentMonth , 1));
          }
        })
      },
      initData: function(cur) {
        var date;
        if (cur) {
          date = new Date(cur);
        } else {
          date = new Date();
        }
        this.currentDay = date.getDate();
        this.currentYear = date.getFullYear();
        this.currentMonth = date.getMonth() + 1;
        this.currentWeek = date.getDay(); // 1...6,0
        if (this.currentWeek == 0) {
          this.currentWeek = 7;
        }
        var str=date.format('yyyy-MM-dd');
        this.days.length = 0;
        // 今天是周日，放在第一行第7个位置，前面6个
        for (var i = this.currentWeek - 1; i >= 0; i--) {
          var d = new Date(str);
          d.setDate(d.getDate() - i);
          this.dataContent(d)
        };
        for (var i = 1; i <= 42 - this.currentWeek; i++) {
          var d = new Date(str);
          d.setDate(d.getDate() + i);
          this.dataContent(d)
        }
      },
//    判断显示已签还是补签
      dataContent(d){
        var myDate=new Date();
        var nowDate = new Date().format('yyyy-MM-dd');
        myDate.setMonth(myDate.getMonth()-1);
        var prevDate= myDate.format('yyyy-MM-dd');
        var exist= this.events.some((item,index)=>{
          return d.toString()==(new Date(item)).toString();
        });
        if(nowDate > d.format('yyyy-MM-dd') && d.format('yyyy-MM-dd') > prevDate){
          this.canEvents.push(d)
        }
        var canExist= this.canEvents.some((item,index)=>{
          return d.getTime()==(new Date(item)).getTime();
        })
        this.dateList.push({
          year:d.getFullYear(),
          month:d.getMonth()+1,
          day:d.getDate(),
          sign:exist,
          canSign:exist?false:canExist
        });
      },
//    补签
      pick: function(date) {
        this.native.grabHandler('activity.sign.pick');
        this.canSignDate=this.formatDate( date.year , date.month, date.day);
        var postData = {
          token:this.token,
        };
        this.native.apiHandler('XS-BUS-BQJY', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            this.modalSuccess = true;
            this.consumeExperience=response.body.resultData.consumeExperience;
          }
        })
      },
      canSign(){
        var postData = {
          consumeExperience:this.consumeExperience,
          signUpTime:this.canSignDate,
          token:this.token,
        };
        this.native.apiHandler('XS-BUS-BQGN', postData, (res) => {
          this.modalSuccess = false;
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            if(response.body.resultData == 1){
              this.sign(this.canSignDate);
            }else if(response.body.resultData == 2){
              this.toast('经验值不够')
            }else if(response.body.resultData == 3){
              this.toast('补签失败')
            }

          }
        })
      },
      //测试
//      dayPick(date){
//        alert(this.formatDate( date.year , date.month, date.day));
//      },
//    今日签到
      signToday(e){
        this.native.grabHandler('activity.sign.signToday');
        this.signClick+=1;
        if(this.signClick==1){
          var postData = {
            token:this.token
          };
          this.native.apiHandler('XS-BUS-JRQD', postData, (res) => {
            let response = this.convert(res);
            if(response.body.isSuccessful == true){
              if(response.body.resultData == true){
                var nowDate = new Date().format('yyyy-MM-dd');
                this.sign(nowDate);
                this.signText='已签到';
              }
            }
          })
        }
      },
//    上一月
      pickPre: function(year, month) {
        this.dateList=[];
        // setDate(0); 上月最后一天
        // setDate(-1); 上月倒数第二天
        // setDate(dx) 参数dx为 上月最后一天的前后dx天
        var d = new Date(this.formatDate(year , month , 1));
        d.setDate(0);
        this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
      },
//    下一月
      pickNext: function(year, month) {
        this.dateList=[];
        var d = new Date(this.formatDate(year , month , 1));
        d.setDate(35);
        this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
      },
//    返回 类似 2016-01-02 格式的字符串
      formatDate: function(year,month,day){
        var y = year;
        var m = month;
        if(m<10) m = "0" + m;
        var d = day;
        if(d<10) d = "0" + d;
        return y+"-"+m+"-"+d
      },
//    签到或者补签this.events添加一条数据
      sign(date){
        this.dateList=[];
        this.init();
      },
    },
  }
</script>
<style lang="less" scoped>
  @import "sign.less";
</style>
