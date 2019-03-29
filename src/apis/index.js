//本地调试地址
export const omsUrl  = '/oms';//OMS服务地址
export const  crmReport = '/crmReport';//crm报表地址

// export const omsUrl  = 'http://omscon.test.com';//OMS服务地址
// export const  crmReport = 'http://192.168.0.141:8270';//crm报表地址
//测试地址
//export const omsUrl = 'http://omscon.test.com';
//线上地址
// export const omsUrl = 'https://oms.gongheyuan.com';
// export const crmReport = 'http://oms.gongheyuan.com:83';


//OMS 统一接口配置
//用户信息
export const USER_INFO = "/"+"identity/RequestLoginedInfo";
//信息浏览
export const USER_VIEWS = omsUrl +"/"+"HrSelfHelp/Profile";

//发送短信接口
export const SEND_MASSEAGE= omsUrl +"/"+"Login/SendAuthCode";
//我的假期
export const MY_HOLDAY = omsUrl +"/"+"hrselfhelp/holiday";
//请假记录LeaveDetail
export const MoSetCareRelationPriority = omsUrl+"/"+"api/services/app/OmsCareService/MoSetCareRelationPriority";

//MoRemoveCareRelation 移除
export const MoRemoveCareRelation = omsUrl+"/"+ "api/services/app/OmsCareService/MoRemoveCareRelation";

//MoCareRelationQuery
export const  MoCareRelationQuery = omsUrl+"/"+ "api/services/app/OmsCareService/MoCareRelationQuery";

//MoVitalSignObsLogQuery

export const  MoVitalSignObsLogQuery = omsUrl+"/"+ "api/services/app/OmsCareService/MoVitalSignObsLogQuery";

//MoVitalSignObsLogSave

export const  MoVitalSignObsLogSave = omsUrl+"/"+ "api/services/app/OmsMedical/MoVitalSignObsLogSave";

//MoCareResidentGet

export const  MoCareResidentGet = omsUrl+"/"+ "api/services/app/OmsCareService/MoCareResidentGet";
//CRM
//CurrentLoginInformations 单点
export const  CurrentLoginInformations = omsUrl+"/"+ "api/services/app/session/GetCurrentLoginInformations"
//GrantedPermissions 权限
export const  GrantedPermissions = omsUrl+"/"+ "api/services/app/omsCareService/getGrantedPermissions"
//crm 新增客户
export const  CrmContactSave = omsUrl+"/"+ "api/services/app/omsCRM/CrmContactSave";

//字典表
export const  omsCRMgetTenants = omsUrl+"/"+ "api/services/app/omsCRM/getTenants";
export const  omsCommondictQuery = omsUrl+"/"+ "api/services/app/omsCommon/dictQuery";

//CrmQuery crm列表查询
export const  CrmQuery = omsUrl+"/"+ "api/services/app/omsCRM/CrmContactQuery";
//CrmGet crm根据ID获取详情
export const  CrmGet = omsUrl+"/"+ "api/services/app/omsCRM/CrmContactGet";

export const  omsCrmCustomerCommunication = omsUrl+"/"+ "api/services/app/omsCRM/CrmCustomerCommunication";

//咨询登记-沟通-列表
export const  CrmCommunicationQuery = omsUrl+"/"+ "api/services/app/omsCRM/CrmCommunicationQuery";

//字典表 意向程度查询
export const  CRMDegreeDictQuery = omsUrl+"/"+ "api/services/app/omsCRM/crmDegreeDictQuery";
//字典表 信息渠道查询
export const  CRMInfoSourceDictQuery = omsUrl+"/"+ "api/services/app/omsCRM/crmInfoSourceDictQuery";
//字典表 图表
export const  OmsReportGraphQueryGet = omsUrl+"/"+ "api/services/app/omsReport/GraphQueryGet?graphId=29";

export const  OmsReportGraphQueryGet1 = omsUrl+"/"+ "api/services/app/omsReport/GraphQueryGet?graphId=36";
export const  OmsReportGraphQueryGet2 = omsUrl+"/"+ "api/services/app/omsReport/GraphQueryGet?graphId=2";
export const  OmsGraphDynamicGet = omsUrl+"/"+ "/api/services/app/omsReport/GraphDynamicGet";
// export const  OmsGraphDynamicGet = omsUrl+"/"+ "api/services/app/omsReport/GraphDynamicGet";
//oms统计二级列表
export const  GraphListQuery = omsUrl+"/"+ "api/services/app/omsReport/GraphListQuery";

//oms创建和编辑交班信息接口 2019-3-21
export const  OmsHandOverSave = omsUrl+ "/HandOver/ShiftxchangeSave";
//oms创建和编辑交班信息列表 2019-3-22
export const  OmsHandOverQuery = omsUrl+ "/HandOver/ShiftExchangeQuery";
//----------------------------分割线
//oms住户列表查询
export const OmsHouseQuery = omsUrl + '/api/services/app/omsCustomer/residentListQuery'
//oms获取住户基本信息
export const OmsHouseDetail = omsUrl + '/api/services/app/omsApplication/applicationAuditGetByResidentId'
//oms体检报告
export const OmsHousePhysical = omsUrl + '/api/services/app/omsCustomer/residentAttachmentsQuery'
//oms居住记录列表
export const OmsHouseLive = omsUrl + '/api/services/app/omsCustomer/inLogByResidentId'
//oms根据合同Id查询详细信息
export const OmsHouseGetid = omsUrl + '/api/services/app/omsContract/contractGet'
//---------------------------分割线
//GetCallDataCount 来电
export const  GetCallDataCount = crmReport+"/"+ "Home/GetCallDataCount";
//GetVisitDataCount 来访
export const  GetVisitDataCount = crmReport+"/"+ "Home/GetVisitDataCount";
//GetCallVisitData 电转访
export const  GetCallVisitData = crmReport+"/"+ "Home/GetCallVisitData";
//GetFirstInfoSourceData 渠道统计
export const  GetFirstInfoSourceData = crmReport+"/"+ "Home/GetFirstInfoSourceData";
//GetSecondInfoSourceData 二级渠道
export const  GetSecondInfoSourceData = crmReport+"/"+ "Home/GetSecondInfoSourceData";
//GetThirdInfoSourceData 三级渠道
export const  GetThirdInfoSourceData = crmReport+"/"+ "Home/GetThirdInfoSourceData";
//GetDealCycleData 成交周期
export const  GetDealCycleData = crmReport+"/"+ "Home/GetDealCycleData";
//GetVisitDealData 访转成交率
export const  GetVisitDealData = crmReport+"/"+ "Home/GetVisitDealData";
//GetAreaData 区域占比
export const  GetAreaData = crmReport+"/"+ "Home/GetAreaData";
//GetDictValTextByName 获取子集
export const  GetDictValTextByName = crmReport+"/"+ "Home/GetDictValTextByName";
