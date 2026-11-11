export type SiteLocale = "ru" | "en";

export const homepageContent = {
  ru: {
    meta: {
      title: "Комплексная подготовка к аккредитации и ПК — РОКНОРД",
      description: "Комплексная подготовка к аккредитации и подтверждению компетентности: аудит СМК и области, доказательная база, корректирующие действия и сопровождение процедуры.",
    },
    hero: {
      eyebrow: "Независимый аудит · комплексная подготовка",
      title: "Подготовка к аккредитации и ПК. По существу.",
      lead: ["Проверим СМК, область, записи и фактическую практику. Выявим риски и определим, что нужно подготовить до процедуры.", "Карта рисков, приоритеты и согласованный план действий — в логике требований Росаккредитации."],
      primary: "Получить план и расчёт",
      secondary: "Посмотреть пример результата",
      principlesLabel: "Что проверяем",
      principles: [
        { title: "По требованиям", text: "Сверяем критерии и доказательства" },
        { title: "Риски заранее", text: "Определяем расхождения до процедуры" },
        { title: "План подготовки", text: "Расставляем задачи и приоритеты" },
      ],
    },
    scenarios: {
      eyebrow: "Ваша ситуация",
      title: "Какая процедура вам предстоит?",
      lead: "Начинаем с вашей задачи и срока, а не с универсального пакета услуг.",
      items: [
        { id: "scenario-primary-accreditation", title: "Организация готовится к первичной аккредитации", text: "Определяем фактическую готовность области, СМК, ресурсов и записей до подачи.", cta: "Обсудить первый аудит" },
        { id: "scenario-confirmation", title: "Приближается подтверждение компетентности", text: "Проверяем документы, накопленные записи и фактическую практику, определяем приоритетные риски.", cta: "Обсудить подготовку к ПК" },
        { id: "scenario-scope-audit", title: "Планируется расширение области аккредитации", text: "Сопоставляем заявляемую область с ресурсами, компетентностью персонала и документами.", cta: "Проверить готовность к расширению" },
        { id: "scenario-corrective-actions", title: "По результатам оценки выявлены несоответствия", text: "Анализируем причины, объём необходимых изменений и подтверждающие материалы.", cta: "Разобрать несоответствия" },
        { id: "scenario-special-directions", title: "Нужно проверить отдельный участок работы", text: "Проверяем область, СМК, записи или конкретный процесс в согласованных границах.", cta: "Обсудить задачу" },
      ],
    },
    outcome: {
      eyebrow: "Результат аудита",
      title: "Матрица рисков связывает требования, практику и доказательства",
      lead: "После аудита руководитель получает технически и нормативно обоснованную рабочую матрицу, а не перечень общих замечаний.",
      items: [
        { title: "Что уже готово", text: "Отделяем рабочие элементы системы от того, что требует внимания." },
        { title: "Где возникает риск", text: "Показываем расхождения между требованиями, документами, записями и практикой." },
        { title: "Чем он подтверждён", text: "Каждый вывод связываем с требованием и доступными доказательствами." },
        { title: "Что делать дальше", text: "Расставляем действия по приоритету, чтобы команда не исправляла всё подряд." },
      ],
      resultLabel: "Главный итог",
      result: "Руководитель видит основание каждого риска, приоритет корректирующих действий, ответственную роль и доказательство, которое нужно подготовить к оценке.",
      cta: "Уточнить состав результата",
      context: "Аудит готовности: результат и состав отчёта",
    },
    process: {
      eyebrow: "Процесс",
      title: "Как проходит аудит",
      lead: "От документов и фактической практики — к понятному плану дальнейшей подготовки.",
      outputLabel: "Результат этапа",
      cta: "Обсудить аудит",
      context: "Независимый аудит готовности",
      steps: [
        { step: "01", title: "Анализ документов", text: "Изучаем область, СМК, записи и исходные данные по ресурсам.", output: "План проверки" },
        { step: "02", title: "Проверка практики", text: "Проверяем фактическую работу дистанционно и, при необходимости, на площадке.", output: "Наблюдения и подтверждающие материалы" },
        { step: "03", title: "Сопоставление", text: "Сверяем требования, процедуры, записи и фактическую работу.", output: "Карта рисков и реестр расхождений" },
        { step: "04", title: "Отчёт и разбор", text: "Определяем приоритеты, объём дальнейшей подготовки и следующие действия.", output: "Отчёт, план и основа для расчёта" },
      ],
    },
  },
  en: {
    meta: {
      title: "Comprehensive accreditation and competence confirmation preparation — ROKNORD",
      description: "Comprehensive preparation for accreditation and competence confirmation: management system and scope audit, evidence package, corrective action and procedure support.",
    },
    hero: {
      eyebrow: "Independent assessment · preparation support",
      title: "Accreditation and competence confirmation. Evidence first.",
      lead: ["We review the management system, scope, records and actual practice to identify risks before the procedure.", "A risk map, clear priorities and an agreed action plan aligned to the applicable requirements."],
      primary: "Get a plan and estimate",
      secondary: "See a sample result",
      principlesLabel: "What we review",
      principles: [
        { title: "Requirements", text: "We compare criteria and evidence" },
        { title: "Risks identified early", text: "We flag gaps before the procedure" },
        { title: "Preparation plan", text: "We agree actions and priorities" },
      ],
    },
    scenarios: {
      eyebrow: "Your situation",
      title: "Which procedure are you preparing for?",
      lead: "We start with your objective and timeline, not with a generic service package.",
      items: [
        { id: "scenario-primary-accreditation", title: "Your organisation is preparing for initial accreditation", text: "We assess the actual readiness of the scope, management system, resources and records before submission.", cta: "Discuss the initial audit" },
        { id: "scenario-confirmation", title: "Competence confirmation is approaching", text: "We review documents, accumulated records and actual practice, then identify priority risks.", cta: "Discuss the preparation" },
        { id: "scenario-scope-audit", title: "You plan to extend the accreditation scope", text: "We compare the proposed scope with resources, personnel competence and supporting documents.", cta: "Check expansion readiness" },
        { id: "scenario-corrective-actions", title: "Nonconformities were identified during assessment", text: "We analyse the causes, required changes and supporting evidence.", cta: "Review nonconformities" },
        { id: "scenario-special-directions", title: "A specific part of the operation needs review", text: "We review the scope, management system, records or a specific process within agreed boundaries.", cta: "Discuss the task" },
      ],
    },
    outcome: {
      eyebrow: "Audit outcome",
      title: "The risk matrix links requirements, practice and evidence",
      lead: "After the audit, management receives a technically and regulatorily substantiated working matrix rather than a list of generic comments.",
      items: [
        { title: "What is already in place", text: "We separate functioning system elements from those that need attention." },
        { title: "Where the risk arises", text: "We identify gaps between requirements, documents, records and actual practice." },
        { title: "What supports the finding", text: "Each finding is linked to a requirement and available evidence." },
        { title: "What to do next", text: "We prioritise actions so the team does not try to correct everything at once." },
      ],
      resultLabel: "Principal outcome",
      result: "Management sees the basis for each risk, corrective-action priority, responsible role and the evidence required for assessment.",
      cta: "Clarify the deliverables",
      context: "Readiness audit: report scope and deliverables",
    },
    process: {
      eyebrow: "Process",
      title: "How the audit works",
      lead: "From documents and actual practice to a clear preparation plan.",
      outputLabel: "Stage output",
      cta: "Discuss the audit",
      context: "Independent readiness audit",
      steps: [
        { step: "01", title: "Document review", text: "We examine the scope, management system, records and source data on resources.", output: "Review plan" },
        { step: "02", title: "Practice review", text: "We review actual operations remotely and, where necessary, on site.", output: "Observations and supporting evidence" },
        { step: "03", title: "Cross-check", text: "We compare requirements, procedures, records and actual operations.", output: "Risk map and gap register" },
        { step: "04", title: "Report and review", text: "We define priorities, the required preparation scope and next steps.", output: "Report, plan and basis for costing" },
      ],
    },
  },
} as const;
