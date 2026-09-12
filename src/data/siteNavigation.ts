export type NavItem = {
  label: string;
  href: string;
  isLogin?: boolean;
};
export { audienceLinks } from './audiences';

export type ServiceGroup = {
  label: string;
  href?: string;
  links: NavItem[];
};

export const serviceLinks: NavItem[] = [
  { label: "Подготовка к подтверждению компетентности", href: "/competence-confirmation/" },
  { label: "Аудит и актуализация области аккредитации", href: "/accreditation-scope/" },
  { label: "Корректирующие действия после несоответствий", href: "/corrective-actions/" },
  { label: "Подготовка к первичной аккредитации", href: "/primary-accreditation/" },
  { label: "Специальные направления", href: "/special-directions/" },
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
  { label: "Личный кабинет", href: "/account/" },
  { label: "Карьера", href: "mailto:hello@roknord.ru?subject=Карьера%20в%20Рокнорд" },
  { label: "Сотрудничество", href: "mailto:hello@roknord.ru?subject=Сотрудничество%20с%20Рокнорд" },
  { label: "Контакты", href: "/contacts/" },
];
