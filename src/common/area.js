/*export default{
 install(Vue, options)
 {
 /!**获取全部省*!/
 Vue.prototype.getAllProvince = function () {
 return provinces;
 }
 /!**获取全部省名称*!/
 Vue.prototype.getAllProvinceName = function () {
 var list = [];
 for (var i = 0, len = provinces.length; i < len; i++) {
 list.push(provinces[i].name);
 }
 return list;
 }
 /!**根据code获取省*!/
 Vue.prototype.getProvinceByCode = function (code) {
 var item;
 for (var i = 0, len = provinces.length; i < len; i++) {
 item = provinces[i];
 if (item.code == code) {
 return item;
 }
 }
 }
 /!**根据name获取省*!/
 Vue.prototype.getProvinceByName = function (name) {
 var item;
 for (var i = 0, len = provinces.length; i < len; i++) {
 item = provinces[i];
 if (item.name == name) {
 return item;
 }
 }
 }
 /!**根据code获取市*!/
 Vue.prototype.getCityByCode = function (code) {
 var item;
 for (var i = 0, len = citys.length; i < len; i++) {
 item = citys[i];
 if (item.code == code) {
 return item;
 }
 }
 }
 /!**根据name获取市*!/
 Vue.prototype.getCityByName = function (name) {
 var item;
 for (var i = 0, len = citys.length; i < len; i++) {
 item = citys[i];
 if (item.name == name) {
 return item;
 }
 }
 }
 /!**根据name获取该省下的市*!/
 Vue.prototype.getCityByPName = function (name) {
 var list = [];
 var item;
 for (var i = 0, len = citys.length; i < len; i++) {
 item = citys[i];
 if (item.pName == name) {
 list.push(item);
 }
 }
 return list;
 }
 /!**根据code获取该省下的市*!/
 Vue.prototype.getCityByPCode = function (code) {
 var list = [];
 var item;
 for (var i = 0, len = citys.length; i < len; i++) {
 item = citys[i];
 if (item.pCode == code) {
 list.push(item);
 }
 }
 return list;
 }
 /!**根据name获取该省下的市名称*!/
 Vue.prototype.getAllCityNameByPName = function (name) {
 var list = [];
 var item;
 for (var i = 0, len = citys.length; i < len; i++) {
 item = citys[i];
 if (item.pName == name) {
 list.push(item.name);
 }
 }
 return list;
 }
 /!**根据code获取该省下的市名称*!/
 Vue.prototype.getAllCityNameByPCode = function (code) {
 var list = [];
 var item;
 for (var i = 0, len = citys.length; i < len; i++) {
 item = citys[i];
 if (item.pCode == code) {
 list.push(item.name);
 }
 }
 return list;
 }
 /!**根据code获取地区*!/
 Vue.prototype.getDistrictByCode = function (code) {
 var item;
 for (var i = 0, len = districts.length; i < len; i++) {
 item = districts[i];
 if (item.code == code) {
 return item;
 }
 }
 }
 }
 }*/


import { areaData } from './area.data.js'

export default {
  /**获取全部省*/
  getAllProvince: function () {
    var provinces = [];
    areaData.forEach((item, index) => {
      provinces.push({ name: item.name, code: item.code })
    })
    return provinces;
  },
  /**获取全部省名称*/
  getAllProvinceName: function () {
    var list = [];
    areaData.forEach((item, index) => {
      list.push(item.name);
    })
    return list;
  },
  /**根据code获取省*/
  getProvinceByCode: function (code) {
    var entity = {};
    areaData.some((item, index) => {
      if (item.code == code) {
        entity = item;
        return true;
      }
    })
    return { name: entity.name, code: entity.code };
  },
  /**根据name获取省*/
  getProvinceByName: function (name) {
    var entity = {};
    areaData.some((item, index) => {
      if (item.name == name) {
        entity = item;
        return true;
      }
    })
    return { name: entity.name, code: entity.code };
  },
  /**根据code获取市*/
  getCityByCode: function (code) {
    var entity, province, city;
    for (var i = 0, plen = areaData.length; i < plen; i++) {
      var province = areaData[i];
      for (var j = 0, clen = province.child.length; j < clen; j++) {
        city = province.child[j];
        if (city.code == code) {
          entity = { code: city.code, name: city.name, pName: province.name, pCode: province.code };
          return entity;
        }
      }
      if (code == 110000 || code == 120000 || code == 500000 || code == 310000) {
        return { code: province.code, name: province.name, pName: province.name, pCode: province.code };
      }
    }
  },
  /**根据name获取市或者该省下的市*/
  getCityByName: function (name) {
    var entity, province, city;
    for (var i = 0, plen = areaData.length; i < plen; i++) {
      var province = areaData[i];
      if (province.name == name) {
        entity = { code: province.code, name: province.name, pName: province.name, pCode: province.code };
      } else {
        for (var j = 0, clen = province.child.length; j < clen; j++) {
          city = province.child[j];
          if (city.name == name) {
            entity = { code: city.code, name: city.name, pName: province.name, pCode: province.code };
          }
        }
      }
    }
    return entity;
  },
  /**根据name获取市*/
  getCityByCityName: function (name) {
    var entity, province, city;
    for (var i = 0, plen = areaData.length; i < plen; i++) {
      var province = areaData[i];
      for (var j = 0, clen = province.child.length; j < clen; j++) {
        city = province.child[j];
        if (city.name == name) {
          entity = { code: city.code, name: city.name, pName: province.name, pCode: province.code };
          return entity;
        }
      }
    }
  },
  /**根据name获取该省下的市*/
  getCityByPName: function (name) {
    var province, city, list = [];
    for (var i = 0, plen = areaData.length; i < plen; i++) {
      var province = areaData[i];
      if (province.name == name) {
        for (var j = 0, clen = province.child.length; j < clen; j++) {
          city = province.child[j];
          list.push({ code: city.code, name: city.name, pName: province.name, pCode: province.code });
        }
      }
    }
    return list;
  },
  /**根据code获取该省或者该省下的市*/
  getCityByPCode: function (code) {
    var province, city, list = [];
    for (var i = 0, plen = areaData.length; i < plen; i++) {
      var province = areaData[i];
      if (province.code == code) {
        if (code == 110000 || code == 120000 || code == 500000 || code == 310000) {
          list.push({ code: province.code, name: province.name, pName: province.name, pCode: province.code });
        } else {
          for (var j = 0, clen = province.child.length; j < clen; j++) {
            city = province.child[j];
            list.push({ code: city.code, name: city.name, pName: province.name, pCode: province.code });
          }
        }
      }
    }
    return list;
  },
  // /**根据code获取该省下的市*/
  // getCityByCityCode: function (code) {
  //   var province, city, list = [];
  //   for (var i = 0, plen = areaData.length; i < plen; i++) {
  //     var province = areaData[i];
  //     if (province.code == code) {
  //       for (var j = 0, clen = province.child.length; j < clen; j++) {
  //         city = province.child[j];
  //         list.push({code: city.code, name: city.name, pName: province.name, pCode: province.code});
  //       }
  //     }
  //   }
  //   return list;
  // },
  /**根据name获取该直辖市的名称或者省下的市名称*/
  getAllCityNameByPName: function (name) {
    var province, city, list = [];
    for (var i = 0, plen = areaData.length; i < plen; i++) {
      var province = areaData[i];
      if (province.name == name) {
        if (province.name == '北京市' || province.name == '上海市' || province.name == '重庆市' || province.name == '天津市') {
          list.push(province.name);
        } else {
          for (var j = 0, clen = province.child.length; j < clen; j++) {
            city = province.child[j];
            list.push(city.name);
          }
        }
        return list;
      }
    }
  },
  /**根据name获取该省下的市名称*/
  getAllCityNameByCityName: function (name) {
    var province, city, list = [];
    for (var i = 0, plen = areaData.length; i < plen; i++) {
      var province = areaData[i];
      if (province.name == name) {
        for (var j = 0, clen = province.child.length; j < clen; j++) {
          city = province.child[j];
          list.push(city.name);
        }
        return list;
      }
    }
  },
  /**根据code获取该省下的市名称*/
  getAllCityNameByPCode: function (code) {
    var province, city, list = [];
    for (var i = 0, plen = areaData.length; i < plen; i++) {
      var province = areaData[i];
      if (province.code == code) {
        for (var j = 0, clen = province.child.length; j < clen; j++) {
          city = province.child[j];
          list.push(city.name);
        }
        return list;
      }
    }
  },
  /**根据code获取地区*/
  getDistrictByCode: function (code) {
    var entity, province, city, dist;
    for (var i = 0, plen = areaData.length; i < plen; i++) {
      var province = areaData[i];
      for (var j = 0, clen = province.child.length; j < clen; j++) {
        city = province.child[j];
        for (var k = 0, klen = city.child.length; k < klen; k++) {
          dist = city.child[k];
          if (dist.code == code) {
            return {
              code: dist.code,
              name: dist.name,
              cCode: city.code,
              cName: city.name,
              pName: province.name,
              pCode: province.code
            };
          }
        }
      }
    }
  },

}
