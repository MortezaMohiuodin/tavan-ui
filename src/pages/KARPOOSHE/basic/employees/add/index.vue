<template>
  <div>
    <v-row>
      <v-col>
        <h3 class="tw-text-xl lg:tw-text-2xl tw-font-semibold">
          افزودن کارمند جدید
        </h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form
          validate-on="blur"
          @submit.prevent="submit"
        >
          <v-card
            elevation="0"
            rounded="xl"
            class="tw-border-gray-250 tw-p-6 lg:tw-p-8"
          >
            <v-row>
              <v-col
                cols="6"
                lg="4"
              >
                <label
                  for="employee-name"
                  class="fieldLabel"
                >نام</label>
                <v-text-field
                  id="employee-name"
                  v-model="form.name"
                  :rules="[required(form.name, $t('general.name'))]"
                />
              </v-col>
              <v-col
                cols="6"
                lg="4"
              >
                <label
                  for="employee-lastname"
                  class="fieldLabel"
                >نام خانوادگی</label>
                <v-text-field
                  id="employee-lastname"
                  v-model="form.lastname"
                />
              </v-col>
              <v-col
                cols="0"
                lg="4"
                class="tw-p-0"
              />
              <v-col
                cols="6"
                lg="4"
              >
                <label
                  for="employee-nationalCode"
                  class="fieldLabel"
                >کد ملی</label>
                <v-text-field
                  id="employee-nationalCode"
                  v-model="form.nationalCode"
                />
              </v-col>
              <v-col
                cols="6"
                lg="4"
              >
                <label
                  for="employee-birthdate"
                  class="fieldLabel"
                >تاریخ تولد</label>
                <persian-datepicker
                  id="employee-birthdate"
                  v-model="form.birthdate"
                  :rules="[required]"
                  type="date"
                />
              </v-col>
              <v-col
                cols="0"
                lg="4"
                class="tw-p-0"
              />
              <v-col
                cols="6"
                lg="4"
              >
                <label
                  for="employee-gender"
                  class="fieldLabel"
                >جنسیت</label>
                <v-select
                  id="employee-gender"
                  v-model="form.gender"
                  :items="$enums.gender"
                  item-title="value"
                  item-value="key"
                />
              </v-col>
              <v-col
                cols="6"
                lg="4"
              >
                <label
                  for="employee-jobGroup"
                  class="fieldLabel"
                >گروه شغلی</label>
                <v-select-extend
                  id="employee-jobGroup"
                  v-model="form.jobGroup"
                  :service="service"
                  item-title="value"
                  item-value="key"
                />
              </v-col>
              <v-col
                cols="0"
                lg="4"
                class="tw-p-0"
              />
              <v-col
                cols="12"
                lg="4"
              >
                <label
                  for="employee-mobile"
                  class="fieldLabel"
                >شماره همراه</label>
                <v-text-field
                  id="employee-mobile"
                  v-model="form.mobile"
                />
              </v-col>
              <v-col
                cols="12"
                lg="4"
              >
                <label
                  for="employee-email"
                  class="fieldLabel"
                >پست الکترونیک</label>
                <v-text-field
                  id="employee-email"
                  v-model="form.email"
                />
              </v-col>
              <v-col
                cols="0"
                lg="4"
                class="tw-p-0"
              />
              <v-col
                cols="6"
                lg="4"
              >
                <label
                  for="employee-province"
                  class="fieldLabel"
                >استان</label>
                <v-select
                  id="employee-province"
                  v-model="form.province"
                />
              </v-col>
              <v-col
                cols="6"
                lg="4"
              >
                <label
                  for="employee-city"
                  class="fieldLabel"
                >شهر</label>
                <v-select
                  id="employee-city"
                  v-model="form.city"
                />
              </v-col>
            </v-row>
          </v-card>
          <v-row class="tw-mt-4">
            <v-col
              cols="12"
              lg="6"
              class="tw-text-center lg:tw-text-right"
            >
              <v-btn
                color="secondary"
                variant="text"
                plain
                rounded="0"
                class="tw-border-b-2 tw-border-b-secondary tw-px-0"
                to="add/advanced"
              >
                می خواهم اطلاعات کامل کارمند را وارد کنم
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              lg="6"
              class="tw-flex tw-flex-col-reverse tw-items-center tw-gap-3 lg:tw-block lg:tw-text-end"
            >
              <v-btn-cancel>
                انصراف
              </v-btn-cancel>
              <v-btn
                color="secondary"
                class="tw-mx-[4px] tw-w-[180px]"
                size="large"
                rounded="xl"
              >
                تایید و ثبت
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { required } from "@/helper/validations"
import { $enums } from "@/plugins/enums"


const form = ref({
  name: null,
  lastname: null,
  birthdate : null,
  gender: null,
})

const submit = ()=>{

}

const service = async (payload = {})=>{
  const { WID } = useAppStore()
  let params = {
    "WorkspaceCode": WID,
    "Status": null,
    "EmployeeCode": null,
    "DepartmentCode": null,
    "Page": 1,
    ...payload,
  }
  try{
    const res = await useHttpGet('department/get-workspace-department',{ params  })

    return res.Data.map(val=>({ 'key' : val?.DepartmentCode , 'value' : val?.Title }))
  }catch(e){
    throw new Error(e)
  }

}
</script>
