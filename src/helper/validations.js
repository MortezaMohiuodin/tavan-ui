import i18n from "@/i18n/i18n"

export const required = (v, label) => {
  return !!v || i18n.global.t("validation.required", { label })
}

export const maxLength = (
  v,
  max,
  label,
) => v.length <= max || i18n.global.t("validation.maxLength", { label, max })

export const minLength = (
  v,
  min,
  label) => v.length >= min || i18n.global.t("validation.minLength", { label, min })


