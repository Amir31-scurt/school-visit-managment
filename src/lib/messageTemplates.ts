export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
}

export const defaultTemplates = {
  en: {
    confirmation: "Hello *{{contactPerson}}*! 👋\n\nWe are delighted to confirm the visit of *{{schoolName}}* for *{{confirmedDate}}* at *{{confirmedTime}}*. We look forward to welcoming your {{numberOfStudents}} students.\n\nPlease note that the entry fee is *{{tariff}} FCFA* per student.\n\nSee you soon!",
    rejection: "Hello {{contactPerson}}, unfortunately we cannot accommodate the visit for {{schoolName}} on {{preferredDate}}. Please contact us to reschedule."
  },
  fr: {
    confirmation: "Bonjour *{{contactPerson}}* ! 👋\n\nNous sommes ravis de confirmer la visite de l'établissement *{{schoolName}}* pour le *{{confirmedDate}}* à *{{confirmedTime}}*. Nous avons hâte d'accueillir vos {{numberOfStudents}} élèves.\n\nVeuillez noter que le tarif est de *{{tariff}} FCFA* par élève.\n\nÀ très bientôt !",
    rejection: "Bonjour {{contactPerson}}, malheureusement nous ne pouvons pas accueillir la visite de {{schoolName}} le {{preferredDate}}. Veuillez nous contacter pour reprogrammer."
  },
  ar: {
    confirmation: "مرحباً *{{contactPerson}}*! 👋\n\nيسعدنا تأكيد زيارة مدرسة *{{schoolName}}* بتاريخ *{{confirmedDate}}* الساعة *{{confirmedTime}}*. نتطلع لاستقبال {{numberOfStudents}} طالب.\n\nيرجى العلم أن الرسوم هي *{{tariff}} فرنك* للطالب الواحد.\n\nنراكم قريباً!",
    rejection: "مرحباً {{contactPerson}}، للأسف لا يمكننا استيعاب زيارة {{schoolName}} في {{preferredDate}}. يرجى التواصل معنا لإعادة الجدولة."
  },
  wo: {
    confirmation: "Nuyu nanu la *{{contactPerson}}* ! 👋\n\nBeg nanu lool ngir dëggal visite ekool *{{schoolName}}* ci besu *{{confirmedDate}}* ci waqtu bi di *{{confirmedTime}}*.\n\nXamal lén ni njiëg bi moy *{{tariff}} FCFA* ci dongue bu nekk.\n\n---\n\nBonjour *{{contactPerson}}* ! 👋\n\nNous sommes ravis de confirmer la visite de l'établissement *{{schoolName}}* pour le *{{confirmedDate}}* à *{{confirmedTime}}*.\n\nVeuillez noter que le tarif est de *{{tariff}} FCFA* par élève.\n\nBa beneen yoon ci jamm / À très bientôt !",
    rejection: "Nuyu nanu la {{contactPerson}}, jéggalu nanu lool waaye munu no nangu visite {{schoolName}} ci besu {{preferredDate}}. Jokkalanteel ak nun ngir xool beneen bes."
  }
};
