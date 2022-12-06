<template>
  <div class="w-full pt-16 pb-32">
    <div class="space-y-6 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center">
        <Breadcrumb pageName="" linkName="Import Members" linkUrl="/members/import"  current="Import Table"/>
      </div>
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div class="py-5">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Import Data</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">From .xls, .xlsx, or .csv file.</p>
        </div>
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
          <tr>
            <th v-for="(header, i) in form.columns" :key="`${header}${i}`" scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              <div class="flex flex-col space-y-2">
                <span>{{ header.label }}</span>
                <select
                    class="block h-8 text-eg-text bg-gray-200 border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-xs font-normal rounded-md"
                    @change="exchangeValues($event.target.value, header.label)"
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
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="(member, i) in form.rows" :key="i">
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.memberNumber }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.firstName }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.lastName }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.email }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.idNumber }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.phoneNumber }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.pinSecret }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.availableAmount }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.totalDeposits }}</td>
              <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{{ member.totalDeposits }}</td>
            </tr>
          </tbody>
        </table>
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
const {memberStore} = stores

const form = reactive<{ columns: any, rows: any, searchTerm: string, items: string[], model: any, batchData: any[], importLength: number, allData: any[], index: number, total: number, pageLength: number}>({
  columns: [],
  rows: [],
  searchTerm: '',
  items: ['firstName', 'lastName', 'fullName', 'idNumber', 'memberNumber', 'phoneNumber', 'email', 'totalShares', 'totalDeposits', 'committedAmount', 'availableamount', 'memberStatus', 'loanCount', 'details'],
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

const exchangeValues = (val: any, item: any) => {
  let index = form.columns.findIndex((res: any)=>res.label==item);
  if(index >= 0){
    form.columns[index].selectFor=val;
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