export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
}

export const defaultTemplates = {
  en: {
    confirmation: "Hello {{contactPerson}}, your school visit for {{schoolName}} has been confirmed for {{confirmedDate}} at {{confirmedTime}}. We look forward to welcoming {{numberOfStudents}} students.",
    rejection: "Hello {{contactPerson}}, unfortunately we cannot accommodate the visit for {{schoolName}} on {{preferredDate}}. Please contact us to reschedule."
  },
  fr: {
    confirmation: "Bonjour {{contactPerson}}, votre visite scolaire pour {{schoolName}} est confirmée pour le {{confirmedDate}} à {{confirmedTime}}. Nous avons hâte d'accueillir {{numberOfStudents}} élèves.",
    rejection: "Bonjour {{contactPerson}}, malheureusement nous ne pouvons pas accueillir la visite de {{schoolName}} le {{preferredDate}}. Veuillez nous contacter pour reprogrammer."
  },
  ar: {
    confirmation: "مرحباً {{contactPerson}}، تم تأكيد زيارتكم المدرسية لـ {{schoolName}} بتاريخ {{confirmedDate}} الساعة {{confirmedTime}}. نتطلع لاستقبال {{numberOfStudents}} طالب.",
    rejection: "مرحباً {{contactPerson}}، للأسف لا يمكننا استيعاب زيارة {{schoolName}} في {{preferredDate}}. يرجى التواصل معنا لإعادة الجدولة."
  }
};
