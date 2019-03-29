import './dsbridge.js'

export default {

  getToken() {
    let getToken = dsBridge.call("testSyn", "testSyn") || '{"token":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjY2Y2NmNmYwMjQyMGRiZmMyYmE3ZTczYWI0ZmMyNjM0IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NTM1Njc3MjUsImV4cCI6MTYzOTk2NzcyNSwiaXNzIjoiaHR0cHM6Ly95dWVjaGVuZ2dyb3VwLmNvbSIsImF1ZCI6WyJodHRwczovL3l1ZWNoZW5nZ3JvdXAuY29tL3Jlc291cmNlcyIsIlN0YWZmSW5mbyJdLCJjbGllbnRfaWQiOiJ5Yy5wb3J0YWwiLCJzdWIiOiIxOTkwM0Q3Ny04OTYyLTQ1RUYtQUUzOS1GMURFQUM3MDU2RkUiLCJhdXRoX3RpbWUiOjE1NTM1Njc3MjUsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsIlN0YWZmSW5mbyIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.wLFCVucuZeuZjnVOC1jfgNGriVTjAHBkfDV72v2uyqcScbllF974N2B5nEfOAlZ3WPN7If0SPz1sAu1ps4TyIGDfe9bV6lLGIrkYwPsNKK2gaL6iuXT8Wd6ft8WXDCpxebclmrxlQr_En3SRyJsCSZCkpe8M9k2lMKU5hg1e8qp-ZXVDZPOzw7eZ8F1RT4E6ALBFPOgmcczHJqkL7O-PJJsA0aJ4gTun7s4tD1ArO5pu3MmKdppLL6TE-I-KiGBK0qdxb2lxmcq4ZgzgPUVGgwapnpIx-qgQce5BpDZpQfhrjm7wbWaEbGGXZLElJ2Ardxcsb-Rz7IDKWKsPdIuu5g"}';
    return JSON.parse(getToken).token
  },
  isIphone() {	 //判断是安卓还是苹果
    var UA = window.navigator.userAgent;
    if (/iPad/i.test(UA) || /iPod|iPhone/i.test(UA)) {
      return 2;
    } else {
      return 1;
    }
  },
  callPhone(number) {
    dsBridge.call("openApplication", {"type": "call", "content": number})
  }

}
