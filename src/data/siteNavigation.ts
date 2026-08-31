export type NavItem = {
  label: string;
  href: string;
  isLogin?: boolean;
};

export type ServiceGroup = {
  label: string;
  href?: string;
  links: NavItem[];
};

export const serviceLinks: NavItem[] = [
  { label: "Подготовка к первичной аккредитации", href: "/#scenario-primary-accreditation" },
  { label: "Подготовка к подтверждению компетентности", href: "/#scenario-confirmation" },
  { label: "Аудит и актуализация области аккредитации", href: "/#scenario-scope-audit" },
  { label: "Корректирующие действия после выявления несоответствий", href: "/#scenario-corrective-actions" },
  { label: "Специальные направления", href: "/#scenario-special-directions" },
];

export const serviceGroups: ServiceGroup[] = [
  { label: "Росаккредитация (ФСА)", links: serviceLinks },
  { label: "Охрана труда", href: "/occupational-safety/", links: [] },
  { label: "Услуги по 152-ФЗ", href: "/152-fz/", links: [] },
];

export const sectionLinks: NavItem[] = [
  { label: "Новости", href: "/news/" },
  { label: "РАЛ-Атлас", href: "https://atlas.roknord.ru/" },
];

export const utilityLinks: NavItem[] = [
  { label: "О компании", href: "/company/" },
  { label: "Личный кабинет", href: "#", isLogin: true },
  { label: "Карьера", href: "mailto:hello@roknord.ru?subject=Карьера%20в%20Рокнорд" },
  { label: "Сотрудничество", href: "mailto:hello@roknord.ru?subject=Сотрудничество%20с%20Рокнорд" },
  { label: "Контакты", href: "/contacts/" },
];
