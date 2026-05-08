export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
}

export const defaultTemplates = {
  en: {
    confirmation: "Hello *{{contactPerson}}*! 👋 We are so excited to confirm the visit for *{{schoolName}}* on *{{confirmedDate}}* at *{{confirmedTime}}*. 🌟 We can't wait to welcome your {{numberOfStudents}} students for an unforgettable experience!\n\nPlease note that the entry fee is *{{tariff}} FCFA* per student.\n\nSee you very soon! 😊",
    rejection: "Hello {{contactPerson}}, unfortunately we cannot accommodate the visit for {{schoolName}} on {{preferredDate}}. Please contact us to reschedule."
  },
  fr: {
    confirmation: "Bonjour *{{contactPerson}}* ! 👋 C'est un réel plaisir de vous annoncer que la visite de *{{schoolName}}* est officiellement confirmée pour le *{{confirmedDate}}* à *{{confirmedTime}}*. 🌟 Nous avons hâte d'accueillir vos {{numberOfStudents}} élèves et de partager ce moment avec vous !\n\nPour information, le tarif est de *{{tariff}} FCFA* par élève.\n\nÀ très bientôt ! 😊",
    rejection: "Bonjour {{contactPerson}}, malheureusement nous ne pouvons pas accueillir la visite de {{schoolName}} le {{preferredDate}}. Veuillez nous contacter pour reprogrammer."
  },
  ar: {
    confirmation: "أهلاً بك *{{contactPerson}}*! 👋 يسعدنا جداً تأكيد زيارة مدرسة *{{schoolName}}* يوم *{{confirmedDate}}* الساعة *{{confirmedTime}}*. 🌟 نحن بانتظار استقبال طلابكم الـ {{numberOfStudents}} بكل حماس!\n\nللعلم، الرسوم هي *{{tariff}} فرنك* للطالب الواحد.\n\nنراكم قريباً بكل خير! 😊",
    rejection: "مرحباً {{contactPerson}}، للأسف لا يمكننا استيعاب زيارة {{schoolName}} في {{preferredDate}}. يرجى التواصل معنا لإعادة الجدولة."
  }
};
