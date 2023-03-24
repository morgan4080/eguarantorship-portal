<template>
  <div class="flex flex-1 flex-col">
    <main class="flex-1">
      <div class="pt-2 pb-6">
        <div class="mx-auto space-y-6 sm:px-6 lg:px-5">
          <div class="flex justify-between items-center">
            <Breadcrumb pageName="" linkName="All Members" linkUrl="/members"  current="Import Members"/>
          </div>
          <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <div class="py-5">
              <h3 class="text-lg font-medium leading-6 text-slate-900">Member Bulk Import</h3>
              <p class="mt-1 max-w-2xl text-sm text-slate-500">From .xls, .xlsx, or .csv file.</p>
            </div>
            <div class="mt-6 space-y-16 flex flex-col justify-center">
              <div class="flex flex-1 items-stretch overflow-hidden">
                <main class="flex-1 overflow-y-auto">
                  <section aria-labelledby="primary-heading" class="flex h-full min-w-0 flex-1 flex-col lg:order-last">
                    <div id="dragBox" @drop="dropHandler" @dragover="handleDragOver" @dragleave="handleDragLeave" @dragenter="handleDragEnter" class="flex max-w-lg justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6">
                      <div class="space-y-1 text-center">
                        <svg class="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="flex text-sm text-slate-600">
                          <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-medium text-eg-bg focus-within:outline-none focus-within:ring-2 focus-within:ring-eg-lightblue focus-within:ring-offset-2 hover:text-eg-lightblue">
                            <span>Upload a file</span>
                            <input id="fileUploader" :multiple="false" @change="change" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" type="file" class="sr-only" />
                          </label>
                          <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs text-slate-500">.xls, .xlsx, or .csv up to 10MB</p>
                      </div>
                    </div>
                  </section>
                </main>
                <aside class="flex-1 overflow-y-auto bg-white block">
                  <ul class="mt-2">
                    <li class="flex items-center text-sm" v-for="upload in form.uploads">
                      {{ upload.name }} - {{ upload.size }} bytes
                      <svg @click="removeFile(upload)" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="cursor-pointer ml-2 w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm52.7 283.3L256 278.6l-52.7 52.7c-6.2 6.2-16.4 6.2-22.6 0-3.1-3.1-4.7-7.2-4.7-11.3 0-4.1 1.6-8.2 4.7-11.3l52.7-52.7-52.7-52.7c-3.1-3.1-4.7-7.2-4.7-11.3 0-4.1 1.6-8.2 4.7-11.3 6.2-6.2 16.4-6.2 22.6 0l52.7 52.7 52.7-52.7c6.2-6.2 16.4-6.2 22.6 0 6.2 6.2 6.2 16.4 0 22.6L278.6 256l52.7 52.7c6.2 6.2 6.2 16.4 0 22.6-6.2 6.3-16.4 6.3-22.6 0z"></path>
                      </svg>
                    </li>
                  </ul>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "../../components/Breadcrumb.vue";
import {computed, onMounted, reactive, watch} from "vue";
import { useRouter } from "vue-router";
import stores from "../../stores";

const router = useRouter()

const {memberStore} = stores

const members = computed(()=> {
  return []
})

const form = reactive<{uploads: File[], fileinput: any}>({
  uploads: [],
  fileinput: null,
})

const csvJSON = () => {
  if (form.uploads.length === 0) {
    return false
  }
  const reader = new FileReader()
  reader.readAsText(form.uploads[form.uploads.length - 1])
  reader.onload = () => {
    form.fileinput = reader.result
    const lines = form.fileinput.split('\n')
    const result = []
    const headers = lines[0].split(',')
    for (let i = 1; i < lines.length; i += 1) {
      const obj: any = {}
      const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      for (let j = 0; j < headers.length; j += 1) {
        obj[headers[j]] = currentline[j]
      }
      result.push(obj)
    }
    memberStore.setMemberViewData(JSON.stringify(result))
    memberStore.setMemberHeader(headers)
    router.push('/members/import/upload')
  }
}

const dropHandler = (ev: any) => {
  ev.preventDefault();
  if (ev.dataTransfer.items) {
    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      if (ev.dataTransfer.items[i].kind === 'file') {
        let file = ev.dataTransfer.items[i].getAsFile();
        form.uploads.push(file);
        const dragBox: any = document.querySelector('#dragBox')
        if (dragBox) {
          dragBox.style.borderColor = '2px dashed var(--inputBorderColor)';
        }
      }
    }
  } else {
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      form.uploads.push(ev.dataTransfer.files[i]);
      const dragBox: any = document.querySelector('#dragBox')
      if (dragBox) {
        dragBox.style.borderColor = '2px dashed var(--inputBorderColor)';
      }
    }
  }
}

const handleFileUploadClick = () => {
  const fileSelect = document.getElementById("dragBox"),
      fileElem = document.getElementById("fileUploader");
  fileSelect?.addEventListener("click", function (e) {
    if (fileElem) {
      fileElem.click();
    }
  }, false);
}

const handleDragOver = (ev: { preventDefault: () => void; }) => {
  ev.preventDefault();
  console.log('File(s) in drop zone');
  const dragBox: any = document.querySelector('#dragBox')
  if (dragBox) {
    dragBox.style.borderColor = 'rgb(66, 251, 183)';
  }
}

const handleDragEnter = (ev: { preventDefault: () => void; }) => {
  ev.preventDefault();
}

const handleDragLeave = (ev: { preventDefault: () => void; }) => {
  ev.preventDefault();
  const dragBox: any = document.querySelector('#dragBox')
  if (dragBox) {
    dragBox.style.borderColor = '2px dashed var(--inputBorderColor)';
  }
}

const readFileUrl = async (input: { files: string | any[]; }) => {
  if (input.files && input.files[0]) {
    for (let i = 0; i < input.files.length; i++) {
      form.uploads.push(input.files[i]);
    }
  }
}

const change = (e: { target: any; }) => {
  readFileUrl(e.target);
}

const removeFile = (file: any) => {
  let index = form.uploads.findIndex(file0 => file0 === file);
  form.uploads.splice(index, 1);
}

onMounted(() => {
  handleFileUploadClick()
})

watch(form, () => {
  csvJSON()
})

</script>