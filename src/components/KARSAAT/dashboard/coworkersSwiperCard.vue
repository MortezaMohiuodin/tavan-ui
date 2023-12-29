<template>
  <div>
    <v-card-extend
      title="همکاران"
      class="tw-relative"
      min-height="200"
      :loading="loading"
    >
      <div
        v-if="showFilters"
        class="tw-flex tw-gap-2"
      >
        <department-select
          v-model="filters.DepartmentCode"
          style="max-width:200px;"
          label="دپارتمان"
        />
        <user-select
          v-model="filters.EmployeeCode"
          style="max-width:200px"
          label="کاربر"
        />
      </div>
      <template #action>
        <v-btn
          :size="50"
          class="tw-relative tw-top-[2px]"
          color="secondary"
          variant="text"
          icon="custom:filter"
          @click="showFilters = !showFilters"
        />

        <v-btn-refresh
          :size="50"
          class="tw-relative -tw-me-4 tw-ms-1"
          :class="{'tw-animate-spin' : loading}"
          color="secondary"
          variant="text"
          @click="getAllWorkspaceEmployeeStatus"
        />
      </template>
      <v-slide-group-fade
        v-if="employees?.length || loading"
        show-arrows
      >
        <v-slide-group-item
          v-for="(employee , index) in employees"
          :key="index"
        >
          <div
            class="tw-mx-4 tw-text-center"
            style="width: 110px;"
          >
            <div
              class="tw-mx-4 tw-text-center tw-w-[110px] tw-pt-7"
            >
              <v-badge
                :model-value="employee.IsPresent"
                color="info"
                offset-y="-20"
                location="top"
                content="آنلاین"
              >
                <div
                  :class="{'tw-opacity-50' : !employee.IsPresent} "
                >
                  <v-avatar
                    v-if="employee.Pic"
                    :image="employee.Pic"
                    size="70"
                    rounded="xl"
                  />
                  <v-avatar
                    v-else-if="employee.Gender === 1"
                    :image="avatarPlaceholder"
                    size="70"
                    rounded="xl"
                  />
                  <v-avatar
                    v-else
                    :image="avatarPlaceholder"
                    size="70"
                    rounded="xl"
                  />
                  <div class="tw-mt-4 tw-text-base tw-font-semibold tw-text-k_black">
                    {{ `${employee.Name} ${employee.Family}` }}
                  </div>
                </div>
              </v-badge>
            </div>
          </div>
        </v-slide-group-item>
      </v-slide-group-fade>
      <empty-card-content v-else />
      <v-btn
        v-if="employees?.length"
        class="tw-absolute tw-bottom-1 tw-left-1"
        color="secondary"
        variant="text"
        size="large"
        to="KARSAAT/report/absent"
      >
        مشاهده همه
      </v-btn>
      <v-overlay
        :model-value="loading"
        scrim="white"
        contained
        class="align-center justify-center"
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="32"
        />
      </v-overlay>
    </v-card-extend>
  </div>
</template>

<script setup>
import avatarPlaceholder from '@/assets/images/profile/avatar-placeholder.png'

const { WID } = useAppStore()
const employees = ref(null)
const loading = ref(false)
const showFilters = ref(false)

const filters = ref({
  DepartmentCode : null,
  EmployeeCode : null ,
})

const getAllWorkspaceEmployeeStatus = async ()=>{
  let body = {
    WorkspaceCode : WID,
    ...filters.value,
    Page : 1,
  }

  try{
    loading.value = true

    const res = await useHttpPost('employee/get-all-workspace-employee-status', { body })

    // employees.value = res.Data.slice(0, res.Data.length < 100 ?  res.Data.length : 100)
    const array = res.Data.sort((a,b)=>(Number(b?.IsPresent) - Number(a?.IsPresent)))

    employees.value = array
    loading.value = false

  }catch(e){
    loading.value = false
    console.log(e)
  }
}

watch(filters.value,val=>{
  getAllWorkspaceEmployeeStatus()
})
onMounted(async()=>{
  await getAllWorkspaceEmployeeStatus()
})
</script>

<style>
.skeleton-loader{
  width: 110px;
  height: 170px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
