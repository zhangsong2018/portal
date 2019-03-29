import axios from "../utils/axios-utils";
import * as api from "../apis";


//单点
export function CurrentLoginInformations(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.CurrentLoginInformations, params
    ).then(response => {
      resolve(response.data);
    }, err => {
      reject(err);
    })
      .catch((error) => {
        reject(error);
      })
  })
}

//权限
export function GrantedPermissions(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.GrantedPermissions, params
    ).then(response => {
      resolve(response.data);
    }, err => {
      reject(err);
    })
      .catch((error) => {
        reject(error);
      })
  })
}

//沟通列表
export function CrmCommunicationQuery(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.CrmCommunicationQuery, params
    ).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error);
      })
  })
}


//crm列表
export function CrmContactQuery(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.CrmQuery, params
    ).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error);
      })
  })
}

//crm根据id获取详情
export function CrmContactGet(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.CrmGet + '?id=' + params.id
    ).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error);
      })
  })
}

//获取历史记录
export function getHistory(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.MoVitalSignObsLogQuery, {params}
    ).then(response => {
      //console.log(response.data);
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error);
      })
  })
}

//保存生命体征
export function saveInfo(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.MoVitalSignObsLogSave, {params}
    ).then(response => {
      //console.log(response.data);
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error);
      })
  })
}

//获取人员信息
export function getUses(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.MoCareResidentGet, {params}
    ).then(response => {
      //console.log(response.data);
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error);
      })
  })
}

//用户列表
export function msgList(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.MoCareRelationQuery, {params}).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

//移除照护关系
export function deleteCareRelation(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.MoRemoveCareRelation, {params}).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

//置顶
export function setTop(params) {
  return new Promise((resolve, reject) => {
    axios.post(api.MoSetCareRelationPriority, {params}).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

//新增客户 接口
export const CrmContactSave = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.CrmContactSave, params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

//字段表
export const omsCRMgetTenants = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.omsCRMgetTenants, params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//字段表
export const omsCommondictQuery = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.omsCommondictQuery, params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

//填写沟通页面
export const omsCrmCustomerCommunication = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.omsCrmCustomerCommunication, params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

//字典表  信息渠道
export const CRMInfoSourceDictQuery = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.CRMInfoSourceDictQuery, params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

//字典表  意向程度
export const CRMDegreeDictQuery = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.CRMDegreeDictQuery, params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//  echeart
export const OmsReportGraphQueryGet = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.OmsReportGraphQueryGet).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}


export const OmsReportGraphQueryGet1 = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.OmsReportGraphQueryGet1).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
export const GraphListQuery = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GraphListQuery,params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
export const OmsReportGraphQueryGet2 = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.OmsReportGraphQueryGet2).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
export const OmsGraphDynamicGet = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.OmsGraphDynamicGet,params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//来访量 /Home/GetVisitDataCount
export const GetVisitDataCount = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetVisitDataCount, params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

//来电量 /Home/GetCallDataCount
export const GetCallDataCount = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetCallDataCount, params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//GetFirstInfoSourceData 渠道统计
export const GetFirstInfoSourceData = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetFirstInfoSourceData,params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//GetSecondInfoSourceData 二级渠道
export const GetSecondInfoSourceData = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetSecondInfoSourceData,params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//GetThirdInfoSourceData 三级渠道
export const GetThirdInfoSourceData = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetThirdInfoSourceData,params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//GetDictValTextByName
export const GetDictValTextByName = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetDictValTextByName,params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//GetDealCycleData //成交周期
export const GetDealCycleData = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetDealCycleData,params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//访转成交率 GetCallVisitData
export const GetCallVisitData = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetCallVisitData,params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//访转成交率 GetVisitDealData
export const GetVisitData = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetVisitDealData, params).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}
//区域占比 GetAreaData
export const GetAreaData = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(api.GetAreaData).then(response => {
      resolve(response);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}


