export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
}

export const defaultTemplates = {
  en: {
    confirmation: "Hello *{{contactPerson}}*! 👋 We are so excited to confirm the visit for *{{schoolName}}* on *{{confirmedDate}}* at *{{confirmedTime}}*. 🌟 We can't wait to welcome your {{numberOfStudents}} students for an unforgettable experience!\n\nPlease note that the entry fee is *{{tariff}} FCFA* per student.\n\nSee you very soon! 😊",
    rejection: "Hello *{{contactPerson}}*! 👋 Thank you for your interest in visiting us. Unfortunately, we cannot accommodate *{{schoolName}}* on *{{preferredDate}}* for the following reason: {{reason}}. 😔 We would love to have you visit at another time! Please contact us to reschedule. Hope to see you soon! ✨"
  },
  fr: {
    confirmation: "Bonjour *{{contactPerson}}* ! 👋 C'est un réel plaisir de vous annoncer que la visite de *{{schoolName}}* est officiellement confirmée pour le *{{confirmedDate}}* à *{{confirmedTime}}*. 🌟 Nous avons hâte d'accueillir vos {{numberOfStudents}} élèves et de partager ce moment avec vous !\n\nPour information, le tarif est de *{{tariff}} FCFA* par élève.\n\nÀ très bientôt ! 😊",
    rejection: "Bonjour *{{contactPerson}}* ! 👋 Nous vous remercions pour l'intérêt porté à notre musée. Malheureusement, nous ne pourrons pas accueillir l'établissement *{{schoolName}}* à la date du *{{preferredDate}}* pour la raison suivante : {{reason}}. 😔 Nous serions ravis de vous recevoir à une autre date ! N'hésitez pas à nous recontacter pour reprogrammer. À bientôt ! ✨"
  },
  ar: {
    confirmation: "أهلاً بك *{{contactPerson}}*! 👋 يسعدنا جداً تأكيد زيارة مدرسة *{{schoolName}}* يوم *{{confirmedDate}}* الساعة *{{confirmedTime}}*. 🌟 نحن بانتظار استقبال طلابكم الـ {{numberOfStudents}} بكل حماس!\n\nللعلم، الرسوم هي *{{tariff}} فرنك* للطالب الواحد.\n\nنراكم قريباً بكل خير! 😊",
    rejection: "أهلاً بك *{{contactPerson}}*! 👋 نشكركم على اهتمامكم بزيارة متحفنا. للأسف، لا يمكننا استضافة مدرسة *{{schoolName}}* في تاريخ *{{preferredDate}}* للأسباب التالية: {{reason}}. 😔 نود جداً رؤيتكم في وقت آخر! يرجى التواصل معنا لتحديد موعد جديد. نأمل رؤيتكم قريباً! ✨"
  }
};
