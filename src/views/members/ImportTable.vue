<template>
  <div class="overflow-hidden w-full pt-16 pb-32">
    <div class="space-y-4 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="Import Members" linkUrl="/members/import"  current="Import Table"/>
      </div>
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="py-5">
          <h3 class="text-lg font-medium leading-6 text-slate-900">Import Data</h3>
          <p class="mt-1 max-w-2xl text-sm text-slate-500">From .xls, .xlsx, or .csv file.</p>
        </div>
        <div class="relative w-full overflow-x-auto">
          <table class="w-full max-w-full border-collapse table-auto">
            <thead class="bg-slate-50">
            <tr>
              <th v-for="(header, i) in form.columns" :key="`${header}${i}`" scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-slate-900">
                <div class="flex flex-col space-y-2">
                  <span>
                    <input
                        type="checkbox"
                        class="mr-1 focus:ring-eg-lightblue focus:border-eg-lightblue text-eg-text rounded-md bg-slate-200 border-slate-300"
                        :checked="header.checked"
                        @change="columnChecked(header.label)"
                    >
                  </span>
                  <span>{{ header.label }}</span>
                  <select
                      class="block h-8 text-eg-text bg-slate-200 border-slate-300 focus:outline-none focus:ring-eg-lightblue focus:border-eg-lightblue text-xs font-normal rounded-md"
                      @change="exchangeValues($event, header.label)"
                  >
                    <option hidden>Select For</option>
                    <option
                        v-for="(item , index) in form.items"
                        :key="index"
                        :value="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
              </th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="(row, i) in form.rows" :key="`r${i}`">
              <td v-for="(column, index) in form.columns" :key="`c${index}`" class="whitespace-nowrap px-2 py-2 text-sm text-slate-500">{{ row[column.label] }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="flex pt-12 justify-between">
          <div>
            {{ ' '+form.imported+' ' }} from {{ ' '+form.total }}
          </div>
          <div class="space-x-4 flex justify-end">
            <button @click="router.push('/members')" type="button" class="inline-flex items-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-base font-medium text-red-500 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">Cancel</button>
            <button @click="router.push('/members/import')" type="button" class="inline-flex items-center rounded-md border border-transparent bg-eg-bgopacity px-4 py-2 text-base font-medium text-eg-bg hover:bg-eg-lightblue hover:text-white focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2">New Import</button>
            <button :disabled="authStore.getLoadingState || form.loaded" v-if="!form.isContinue" @click="importData" type="button" class="inline-flex items-center rounded-md border border-transparent bg-eg-bg px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-eg-lightblue focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2">Import Data</button>
            <button :disabled="authStore.getLoadingState || form.loaded" v-if="form.isContinue" @click="importData" type="button" class="inline-flex items-center rounded-md border border-transparent bg-eg-bg px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-eg-lightblue focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2">Continue</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue"
import { useRouter } from "vue-router"
import stores from "../../stores"
import Breadcrumb from "../../components/Breadcrumb.vue"
const router = useRouter()
const {memberStore, authStore} = stores
type reactiveFormType = { columns: any[], rows: any[], searchTerm: string, items: string[], isContinue: boolean, loaded: boolean, imported: number, model: any, batchData: any[], importLength: number, allData: any[], index: number, total: number, pageLength: number}
const form = reactive<reactiveFormType>({
  columns: [],
  rows: [],
  searchTerm: '',
  items: ['firstName', 'lastName', 'fullName', 'idNumber', 'memberNumber', 'phoneNumber', 'email', 'totalShares', 'totalDeposits', 'committedAmount', 'availableamount', 'memberStatus', 'loanCount', 'details'],
  isContinue: false,
  loaded: false,
  imported: 0,
  model: {
    data: {
      rows: [
        {
          "firstName": '',
          "lastName": '',
          "idNumber": '',
          "memberNumber": '',
          "phoneNumber": '',
          "email": '',
          "totalShares": 0,
          "totalDeposits": 0,
          "committedAmount": 0,
          "memberStatus": '',
          "loanCount": 0,
        },
      ],
    },
  },
  batchData: [],
  importLength: 0,
  allData: [],
  index: 0,
  total: 0,
  pageLength: 5000,
})

const members = []

const columnChecked = (label: any) => {
  let index=form.columns.findIndex((res: any) => res.label === label);
  if(index >= 0){
    form.columns[index].checked=!form.columns[index].checked;
  }
}

const exchangeValues = (event: any, item: any) => {
  const target = event.target as HTMLInputElement;

  let index = form.columns.findIndex((res: any)=>res.label==item);
  if(index >= 0){
    form.columns[index].selectFor=target.value;
  }
}

const rowsData = (data: any) => {
  let r=[];
  for(let i=0; i<10; i++) {
    if(data[i]){
      r.push(data[i]);
    }
  }
  return r;
}

const importData = () => {
  let data: any[] = [];
  form.batchData.forEach((item)=>{
    let col: Record<any, any> = {}
    let others: Record<any, any> = {}
    form.columns.forEach(column=>{
      if(column.checked && column.selectFor){
        if(column.selectFor==='details'){
          let a = typeof(item[column.label]);
          others[column.label]={
            value: item[column.label],
            type: 'TEXT'
          };
          col[column.selectFor]=others;
        } else{
          if(column.selectFor !== ''){
            col[column.selectFor]=item[column.label];
          }else{
            authStore.defineNotification({
              id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
              message: 'Something went wrong !!',
              error: true
            })
            return false;
          }
        }
      }
    })
    data.push(col);
  })
  form.model.data.rows=data;
  authStore.defineNotification({
    id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
    message: 'Import Started Successfully!!',
    success: true
  })
  form.loaded = true;
  memberStore.importapi(form.model.data.rows).then(data => data.json()).then((res) => {
    form.loaded=false;
    console.log(res.rowsImported)
    if (res.rowsImported) {

      if (form.importLength === form.total) {
        router.push('/members')
      } else {
        form.imported = form.importLength;
        form.isContinue = true;
        form.index = form.index + 1;
        form.batchData = form.allData[form.index];
        // this.rows=this.rowsData(this.batchData);
        form.importLength = form.importLength+form.batchData.length;
      }
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Successfully Imported !!',
        success: true
      })
    } else {
      authStore.defineNotification({
        id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
        message: 'Something went wrong !!',
        error: true
      })
    }
  }).catch((error: any) => {
    form.loaded = false;
    console.log('import member error', error)
    authStore.defineNotification({
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
      message: 'Something went wrong !!',
      error: true
    })
  });
}

onMounted(() => {
  form.rows=[];
  form.model.data.rows=[];
  let datax = memberStore.getMemberViewData;
  if (datax) {
    let data: [] = JSON.parse(datax);
    form.columns = [];
    if(memberStore.getMemberHeader && typeof memberStore.getMemberHeader === 'object'){
      memberStore.getMemberHeader.forEach((item: any) =>{
        form.columns.push({ label: item, field: item ,selectFor:'', checked:true, filterOptions: {
            enabled: true,
          },});
      })
      if(data && !data[data.length-1][form.columns[0].label]){
        data.splice(data.length-1,1);
      }
    }
    setTimeout(()=>{
      form.allData=[];
      data.forEach((res,i)=>{
        if(!res){
          data.splice(i,1);
        }
      });
      form.total=data.length;
      while (data.length) {
        form.allData.push(data.splice(0,form.pageLength))
      }
      form.batchData = form.allData[form.index];
      form.importLength = form.batchData.length;
      form.rows = rowsData(form.batchData);
    },1000)
  } else {
    router.push('/members/import')
  }
})
</script>