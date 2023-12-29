<template>
  <div>
    <form-page-header />
    <v-card-default>
      <v-row justify="center">
        <v-col
          cols="12"
          md="6"
        >
          <v-card-default
            class="tw-px-6 "
            :loading="loading"
          >
            <v-form v-model="isValid">
              <div class="tw-w-[300px]">
                <span
                  class="fieldLabel"
                >نام دسترسی</span>
                <v-text-field
                  v-model="form.Title"
                  :rules="[x=>!!x || 'این فیلد را پر کنید'] "
                />
              </div>
            </v-form>

            <template v-for="permissionGroup in permissionGroups">
              <v-divider-extend>
                <v-checkbox
                  v-model="permissionGroup.checkThisGroup"
                  :label="permissionGroup.GroupName"
                  class="tw-max-w-fit"
                  @update:modelValue="addAllPermissionsInThisGroup(permissionGroup)"
                />
              </v-divider-extend>
              <v-row class="tw-mt-1 tw-mb-5">
                <v-col
                  v-for="permission in permissionGroup.Permission"
                  :key="permission.PermissionKey"
                  cols="12"
                  lg="6"
                >
                  <v-checkbox-btn
                    v-model="form.PermissionCodes"
                    :label="permission.PermissionTitle"
                    :value="permission.PermissionCode"
                    @update:modelValue="setGroupCheckbox(permissionGroup)"
                  />
                </v-col>
              </v-row>
            </template>
          </v-card-default>
          <div
            class="tw-mt-5 tw-text-center"
          >
            <v-btn-cancel
              class="tw-w-24 sm:tw-w-44"
              @click="$router.back()"
            >
              انصراف
            </v-btn-cancel>
            <v-btn-success
              class="tw-w-24 sm:tw-w-44"
              :loading="loading"
              @click="submit"
            >
              ذخیره
            </v-btn-success>
          </div>
        </v-col>
      </v-row>
    </v-card-default>
  </div>
</template>

<script setup>
import FormPageHeader from '@/components/organisms/formPage/formPageHeader.vue'

const { WID } = useAppStore()
const route = useRoute()
const router = useRouter()

const form = ref({
  Title : null,
  PermissionCodes: [],
})

const loading = ref(false)

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params?.id
})

const permissionGroups = ref([])
const isValid = ref(false)

const getPermissions = async()=>{
  let params = {
    "workspaceCode" : WID,
  }
  loading.value = true
  try{
    const res = await useHttpGet(`permission/get-workaspace-permission`,{ params })

    loading.value =false

    return res
  }catch(e){
    loading.value =false
    console.log(e)
  }
}

const addAllPermissionsInThisGroup=per=>{
  let permissionsCodeInThisGroup = per.Permission.map(permission=>permission.PermissionCode)
  if(per.checkThisGroup){
    permissionsCodeInThisGroup.forEach(perCode=>{
      if(form.value.PermissionCodes.indexOf(perCode)<0)
        form.value.PermissionCodes.push(perCode)
    })
  }else{
    permissionsCodeInThisGroup.forEach(perCode=>{
      let IsThisPerCodeSelected = form.value.PermissionCodes.indexOf(perCode)
      if(IsThisPerCodeSelected>=0){
        form.value.PermissionCodes.splice(IsThisPerCodeSelected,1)
      }
    })
  }
}

const submit = async (payload = {})=>{
  if(!isValid.value) return
  let url = isEdit.value ? 'role/edit-role' : 'role/add-new-role'
  let body = {
    "WorkspaceCode": WID,
    "RoleName" : form.value.Title,
    "PermissionCodes" : form.value.PermissionCodes,
    ...(isEdit.value && { "RoleCode" : id.value }),
    ...payload,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARPOOSHE/basic/roles')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

const getWorkspaceRoles = async (payload = {})=>{
  let params = {
    "WorkspaceCode": WID,
    ...payload,
  }
  try{
    return await useHttpGet('role/get-workspace-role',{ params  })
  }catch(e){
    throw new Error(e)
  }
}


onMounted(async ()=>{
  let res
  let list
  res = await getPermissions()
  if(isEdit.value && id.value){
    list = await getWorkspaceRoles()
    let temp = list.Data.find(val=>parseInt(val.Code) === parseInt(id.value))
    form.value.PermissionCodes = temp.Permission
    form.value.Title = temp.Title
  }
  permissionGroups.value = res.Data
  addCheckBoxInPermissionsGroup()
})

const addCheckBoxInPermissionsGroup=()=>{
  permissionGroups.value.forEach((per,index)=>{
    permissionGroups.value[index].checkThisGroup= false
    setGroupCheckbox(per)
  })
}

const setGroupCheckbox = permissionGroup=>{
  let i=0
  let IsPermissionUnCheck = true
  do {
    IsPermissionUnCheck = form.value.PermissionCodes.includes(permissionGroup.Permission[i].PermissionCode)
    i=i+1
  } while( IsPermissionUnCheck && i<permissionGroup.Permission.length)
  permissionGroup.checkThisGroup = IsPermissionUnCheck
}
</script>

<route>
{
meta: {
title: "معرفی دسترسی"
}
}
</route>
