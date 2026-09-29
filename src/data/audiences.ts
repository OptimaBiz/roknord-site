export const audienceLinks = [
  { label: "Испытательным лабораториям", href: "/testing-labs/" },
  { label: "Медицинским лабораториям", href: "/medical-labs/" },
  {
    label: "Органам по сертификации систем менеджмента",
    href: "/certification-bodies/",
  },
  {
    label: "Органам по сертификации продукции",
    href: "/product-certification/",
  },
  { label: "Органам инспекции", href: "/inspection-bodies/" },
  { label: "Калибровочным лабораториям", href: "/calibration-labs/" },
  { label: "Провайдерам МСИ", href: "/proficiency-testing/" },
  { label: "Органам по сертификации халяль", href: "/halal-certification/" },
];

export const audienceGroups = [
  {
    label: "Аккредитованным лицам",
    description: "Лаборатории и органы оценки соответствия",
    links: audienceLinks,
    sectors: [],
  },
  {
    label: "Бизнесу и работодателям",
    description: "Обязательные требования вне системы аккредитации",
    links: [
      { label: "Охрана труда", href: "/occupational-safety/" },
      { label: "Персональные данные и 152-ФЗ", href: "/152-fz/" },
    ],
    sectors: ["Строительство", "Промышленность"],
  },
];

export const audienceCardRoutes = [
  "/certification-bodies/",
  "/product-certification/",
  "/testing-labs/",
  "/medical-labs/",
  "/halal-certification/",
  "/calibration-labs/",
  "/proficiency-testing/",
  "/inspection-bodies/",
];
