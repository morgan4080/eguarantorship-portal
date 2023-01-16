<template>
  <div class="flex flex-1 flex-col md:pl-24">
    <main class="flex-1">
      <div class="py-16">
        <div class="mx-auto space-y-6 sm:px-6 lg:px-5">
          <div class="flex justify-between items-center">
            <Breadcrumb pageName="" linkName="All Members" linkUrl="/members"  current="Create Members"/>
          </div>
          <form @submit.prevent="submitMember">
            <div class="shadow sm:overflow-hidden sm:rounded-md">
              <div class="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div>
                  <h3 class="text-lg font-medium leading-6 text-gray-900">Member Information</h3>
                  <p class="mt-1 text-sm text-gray-500">Use a permanent email and phone number where member can receive alerts.</p>
                </div>

                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-3">
                    <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                    <input v-model="form.firstName" type="text" name="first-name" id="first-name" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.firstName.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                    <input v-model="form.lastName" type="text" name="last-name" id="last-name" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.lastName.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
                    <input v-model="form.email" type="email" name="email-address" id="email-address" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.email.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="id-number" class="block text-sm font-medium text-gray-700">ID Number</label>
                    <input v-model="form.idNumber" type="number" name="id-number" id="id-number" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.idNumber.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="phone-number" class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input v-model="form.phoneNumber" type="number" name="phone-number" id="phone-number" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.phoneNumber.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="pin-secret" class="block text-sm font-medium text-gray-700">Pin Secret</label>
                    <input v-model="form.pinSecret" type="password" name="pin-secret" id="pin-secret" maxlength="4" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.pinSecret.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="member-number" class="block text-sm font-medium text-gray-700">Member Number</label>
                    <input v-model="form.memberNumber" type="text" name="member-number" id="member-number" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.memberNumber.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="available-amount" class="block text-sm font-medium text-gray-700">Available Amount</label>
                    <input v-model="form.availableAmount" type="number" name="available-amount" id="available-amount" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.availableAmount.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="total-deposits" class="block text-sm font-medium text-gray-700">Total Deposits</label>
                    <input v-model="form.totalDeposits" type="number" name="total-deposits" id="total-deposits" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-egfocus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.totalDeposits.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="total-shares" class="block text-sm font-medium text-gray-700">Total Shares</label>
                    <input v-model="form.totalShares" type="number" name="total-shares" id="total-shares" class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-bg-eg focus:outline-none focus:ring-bg-eg sm:text-sm" />
                    <div class="input-errors" v-for="(error, index) of v$.totalShares.$errors" :key="index">
                      <div class="text-xs text-red-400">{{ error.$message }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button :disabled="authStore.getLoadingState" type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-eg-bg py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-eg-lightblue focus:outline-none focus:ring-2 focus:ring-eg-lightblue focus:ring-offset-2">Save Member</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "../../components/Breadcrumb.vue";
import useVuelidate from '@vuelidate/core';
import parsePhoneNumber, {isValidNumberForRegion} from 'libphonenumber-js';
import {required, email, minLength, maxLength, numeric, helpers} from '@vuelidate/validators'
import {reactive, ref} from "vue";
import stores from "../../stores";
import { useRouter } from "vue-router";
const router = useRouter();
const { memberStore, authStore } = stores;

const form = reactive({
  firstName: '',
  lastName: '',
  idNumber: '',
  phoneNumber: '',
  email: '',
  pinSecret: '',
  memberNumber: '',
  availableAmount: '',
  totalDeposits: '',
  totalShares: '',
  memberStatus: 'ACTIVE',
  isTermsAccepted: true,
})

const validPhone = (value: number) => isValidNumberForRegion(`${value}`, 'KE')

const validationRules = {
  firstName: {
    required,
  },
  lastName: {
    required,
  },
  idNumber: {
    required,
  },
  phoneNumber: {
    required,
    numeric,
    validPhone: helpers.withMessage('Please provide a valid number', validPhone)
  },
  memberNumber: {
    required,
  },
  availableAmount: {
    required,
    numeric
  },
  totalDeposits: {
    required,
    numeric
  },
  totalShares: {
    required,
    numeric
  },
  memberStatus: {
    required,
  },
  isTermsAccepted: {
    required,
  },
  email: {
    required,
    email
  },
  pinSecret: {
    required,
    min: minLength(4),
    max: maxLength(4),
    numeric
  },
}

const v$ = useVuelidate(validationRules, form, { $lazy: true, $autoDirty: true})

const submitMember = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const phoneNumber = parsePhoneNumber(`${form.phoneNumber}`, 'KE')

    const payload = [
      {
        firstName: form.firstName,
        pinSecret: form.pinSecret,
        lastName: form.lastName,
        idNumber: form.idNumber,
        memberNumber: form.memberNumber,
        phoneNumber: `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`,
        email: form.email,
        totalShares: form.totalShares,
        totalDeposits: form.totalDeposits,
        committedAmount: 0,
        availableAmount: form.availableAmount,
        memberStatus: 'ACTIVE',
        isTermsAccepted: true,
        fullName: `${form.firstName} ${form.lastName}`,
      },
    ]

    memberStore.submitMemberDetails(payload).then(() => router.push('/members')).then(() => authStore.defineNotification({
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2),
      message: `Member Created`,
      success: true
    }))

  }
}

</script>