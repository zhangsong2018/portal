<template>

</template>
<script>
  import {omsCommondictQuery, omsCRMgetTenants} from '../../../services/sys.js'

  export default {
    methods: {
      async dictQuery(data_type, type, data) {
        let http = data_type == 3 ? omsCRMgetTenants : omsCommondictQuery;
        let obj = {};
        return await http({type: type}).then(res => {
          if (res.data.result) {
            if (data_type == 1) {
              let select_option = [];
              let option_val = [];
              data.select_option = [];
              data.option_val = [];
              let result = res.data.result.items;
              if (Array.isArray(result) && result.length > 0) {
                result.forEach(value => {
                  select_option.push(value.valText);
                  option_val.push({value: value.valText, id: value.keyCode})
                });
                data.select_option = [select_option];
                data.option_val = option_val;
                return {select_option: select_option, option_val: option_val};
              }
            } else if (data_type == 2) {
              let msg_data = this.handle_data(res.data.result);
              data.select_option = msg_data;
              data.option_val = msg_data;
              return {msg_data};
            } else if (data_type == 3) {
              let select_option = [];
              let option_val = [];
              data.select_option = [];
              data.option_val = [];
              let result = res.data.result;
              if (Array.isArray(result) && result.length > 0) {
                result.forEach(value => {
                  select_option.push(value.name);
                  option_val.push({value: value.name, id: value.id})
                });
                data.select_option = [select_option];
                data.option_val = option_val;
              }
              ;
              return {select_option, option_val};
            }
            ;
          }
        }).catch(error => {
          this.$vux.toast.text('接口异常', 'bottom');
          console.log('接口' + error);
        })
      },
      handle_data(data) {
        let arr = [];


        data.items.forEach(v => {

          if (v.parentKeyCode == "InfoChannel") {
            arr.push({parent: 0, name: v.valText, value: v.keyCode, id: v.id});
          } else {
            arr.push({parent: v.parentKeyCode, name: v.valText, value: v.keyCode, id: v.id});
          }

        });

        // let obj = {};
        // let sclc1 = [];
        // const citys = {
        //   '福建': {
        //     children: {
        //       '福州': {children: ['1', '2', '3']},
        //       '厦门': {children: ['4', '5', '6']},
        //       '莆田': {children: ['7', '8', '9']},
        //       '三明': {children: ['10', '11', '12']},
        //       '泉州': {children: []}
        //     },
        //   },
        // };
        // data.items.forEach(v => {
        //   if (v.parentKeyCode == "InfoChannel") {
        //     obj[v.valText] = {};
        //   } else {
        //     sclc1.push(v);
        //   }
        //
        //   if (v.parentKeyCode == "InfoChannel") {
        //     arr.push({parent: 0, name: v.valText, value: v.valText, id: v.id});
        //   } else {
        //     arr.push({parent: v.parentKeyCode, name: v.valText, value: v.valText, id: v.id});
        //   }
        //
        // });
        // let sclc2 = [];
        // sclc1.forEach(v => {
        //   if (Object.keys(obj).includes(v.parentKeyCode)) {
        //     obj[v.parentKeyCode].children = obj[v.parentKeyCode].children ? obj[v.parentKeyCode].children : {};
        //     obj[v.parentKeyCode].children[v.valText] = {};
        //     obj[v.parentKeyCode].children[v.valText].children = [];
        //   } else {
        //     sclc2.push(v);
        //   }
        //   ;
        // });
        // console.log(sclc2);
        // sclc2.forEach(v => {
        //   for (let index in obj) {
        //     if (Object.keys(obj[index].children).includes(v.parentKeyCode)) {
        //       obj[index].children[v.parentKeyCode].children.push(v.valText);
        //     }
        //   }
        // });
        // let one = Object.keys(obj);
        // let two = Object.keys(obj[one[0]].children);
        // let three = obj[one[0]].children[two[0]].children;
        // let current_data = [
        //   {
        //     values: one,
        //     className: 'column1'
        //   },
        //   {
        //     values: two,
        //     className: 'column2',
        //     defaultIndex: 1
        //   },
        //   {
        //     values: three,
        //     className: 'column3',
        //     defaultIndex: 1
        //   },
        // ];
        // return {obj,current_data};
        return arr;
      },

      processing_data(data) {
        let obj = {};
        for (let index in data) {
          obj[index] = Array.isArray(data[index].value) ? data[index].value.join() : data[index].value;
        }
        ;
        return obj;
      },
      verify(data, no_required, that) {
        let error_arr = [];
        let data_obj = Object.assign(...data);
        let sure = [...Object.keys(data_obj)].every(val => {
          let obj = data_obj[val];
          if (no_required.includes(obj.key)) {
            return true;    //不是必填 忽略
          }
          if (Array.isArray(obj.value)) {
            if (obj.value.length > 0) {
              return true;
            } else {
              error_arr.push(obj);
              return false;
            }
          } else {
            if (obj.value == '') {
              error_arr.push(obj);
              return false
            } else {
              return true;
            }
          }
        })
        if (!sure) {
          let error_msg = `${error_arr[0].name}必填哦`;
          this.$vux.toast.text(error_msg, 'bottom');
          return false;
        } else {
          let refs_error = [];
          Object.keys(this.$refs).forEach(val => {
            for (let ccc in this.$refs[val].errors) {
              refs_error.push(this.$refs[val]);
            }
          });
          if (refs_error.length > 0) {
            for (let ii in refs_error[0].errors) {
              let aa = refs_error[0].title[0] == '*' ? refs_error[0].title.slice(1) : refs_error[0].title;
              this.$vux.toast.text(aa + refs_error[0].errors[ii], 'bottom');
            }
            return false;
          } else {
            return true;
          }
        }
      },
    },


  }
</script>

