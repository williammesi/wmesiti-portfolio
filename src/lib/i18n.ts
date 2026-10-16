import type { BlogLanguage } from "@/types/sanity";

export type SiteLanguage = BlogLanguage;

export const isEnglish = (lang: SiteLanguage | undefined): boolean => lang === "en";

/** GROQ `$lang` parameter shared by every localized Sanity query. */
export const queryLang = (lang: SiteLanguage | undefined): "fr" | "en" =>
  isEnglish(lang) ? "en" : "fr";

export const homePath = (lang: SiteLanguage | undefined): string =>
  isEnglish(lang) ? "/en" : "/";

export const sectionPath = (lang: SiteLanguage | undefined, section: string): string =>
  `${isEnglish(lang) ? "/en" : "/"}#${section}`;

export const projectPath = (lang: SiteLanguage | undefined, slug: string): string =>
  `${isEnglish(lang) ? "/en" : ""}/projects/${slug}`;

export const blogPath = (lang: SiteLanguage | undefined): string =>
  isEnglish(lang) ? "/en/blog" : "/fr/blog";

/**
 * Best-effort equivalent of a path in the other language. Pages whose
 * translation lives at a different slug (blog articles) pass an explicit href.
 */
export function alternatePath(pathname: string, lang: SiteLanguage | undefined): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/fr/blog" || path.startsWith("/fr/blog/")) return path.replace(/^\/fr/, "/en");
  if (path === "/en/blog" || path.startsWith("/en/blog/")) return path.replace(/^\/en/, "/fr");
  if (isEnglish(lang)) return path.replace(/^\/en(?=\/|$)/, "") || "/";
  return path === "/" ? "/en" : `/en${path}`;
}

export function formatMonthYear(date: string | undefined, lang: SiteLanguage | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(isEnglish(lang) ? "en-CA" : "fr-CA", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function formatDuration(startDate: string, endDate: string | undefined, lang: SiteLanguage | undefined): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const totalMonths = Math.max(
    1,
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth()),
  );
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const en = isEnglish(lang);
  const yearLabel = en ? `${years} yr${years > 1 ? "s" : ""}` : `${years} an${years > 1 ? "s" : ""}`;
  const monthLabel = en ? `${months} mo` : `${months} mois`;
  if (years === 0) return monthLabel;
  return months === 0 ? yearLabel : `${yearLabel} ${monthLabel}`;
}

const dictionary = {
  "fr-CA": {
    nav: {
      about: "À propos",
      skills: "Compétences",
      projects: "Projets",
      experience: "Expérience",
      resume: "Mon CV",
      openMenu: "Ouvrir le menu de navigation",
      switchLanguage: "Switch to English",
    },
    skipLink: "Aller au contenu principal",
    home: {
      title: "William Mesiti - Développeur Full Stack",
      description:
        "Portfolio de William Mesiti - Développeur Full Stack passionné par les technologies modernes. Découvrez mes projets, compétences et expériences professionnelles.",
    },
    about: {
      greeting: "Enchanté, moi c'est William !",
      tabs: { presentation: "Présentation", hobbies: "Passe temps", goals: "Objectifs" },
      presentation: [
        "Je suis un étudiant de dernière année en DEC technique en informatique passionné par le développement de toutes sortes, mais particulièrement par le développement web fullstack.",
      ],
      hobbies: [
        "En dehors de l'école, je passe la majorité de mon temps à apprendre de nouvelles technologies et à travailler sur des projets personnels tous aussi originaux les uns que les autres.",
        "Sinon, je m'intéresse à la musique (Rock, Metal, Rap) et au plein air (Pêche, Randonnée, Camping)!",
      ],
      goals: [
        "Je suis actuellement à la recherche d'un stage collégial dans le domaine qui me passionne, afin de mettre en pratique mes compétences et d'apprendre auprès des meilleurs de mon domaine.",
        "Je suis ouvert à toutes les opportunités qui me permettront de grandir professionnellement.",
      ],
      contact: "Si j'ai su attirer votre attention, n'hésitez pas à me contacter !",
      profileAlt: "Photo de profil",
    },
    skills: { title: "Compétences" },
    projects: {
      title: "Projets",
      empty: "Aucun projet disponible pour le moment.",
      back: "Retour aux projets",
      source: "Code source",
      live: "Voir le projet",
      features: "Fonctionnalités principales",
      challenges: "Défis & Solutions",
      challenge: "Défi",
      solution: "Solution",
      previous: "Image précédente",
      next: "Image suivante",
      goTo: "Aller à l'image",
      status: { completed: "Complété", inProgress: "En cours" },
    },
    experience: {
      title: "Parcours",
      work: "Expérience professionnelle",
      education: "Formation",
      present: "Aujourd'hui",
      ongoing: "En cours",
      emptyWork: "Aucune expérience pour le moment.",
      emptyEducation: "Aucune formation pour le moment.",
    },
  },
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experience: "Experience",
      resume: "My résumé",
      openMenu: "Open navigation menu",
      switchLanguage: "Passer en français",
    },
    skipLink: "Skip to main content",
    home: {
      title: "William Mesiti - Full-Stack Developer",
      description:
        "Portfolio of William Mesiti - Full-stack developer passionate about modern technologies. Explore my projects, skills, and professional experience.",
    },
    about: {
      greeting: "Nice to meet you, I'm William!",
      tabs: { presentation: "About me", hobbies: "Hobbies", goals: "Goals" },
      presentation: [
        "I'm a final-year student in a technical DEC in computer science, passionate about all kinds of development, especially full-stack web development.",
      ],
      hobbies: [
        "Outside of school, I spend most of my time learning new technologies and working on personal projects, each one more original than the last.",
        "Otherwise, I'm into music (Rock, Metal, Rap) and the outdoors (Fishing, Hiking, Camping)!",
      ],
      goals: [
        "I'm currently looking for a college internship in the field I'm passionate about, to put my skills into practice and learn from the best in my field.",
        "I'm open to any opportunity that will help me grow professionally.",
      ],
      contact: "If I caught your attention, feel free to reach out!",
      profileAlt: "Profile picture",
    },
    skills: { title: "Skills" },
    projects: {
      title: "Projects",
      empty: "No projects available at the moment.",
      back: "Back to projects",
      source: "Source code",
      live: "View project",
      features: "Key features",
      challenges: "Challenges & Solutions",
      challenge: "Challenge",
      solution: "Solution",
      previous: "Previous image",
      next: "Next image",
      goTo: "Go to image",
      status: { completed: "Completed", inProgress: "In progress" },
    },
    experience: {
      title: "Background",
      work: "Work experience",
      education: "Education",
      present: "Present",
      ongoing: "Ongoing",
      emptyWork: "No experience yet.",
      emptyEducation: "No education entries yet.",
    },
  },
} as const;

export const t = (lang: SiteLanguage | undefined) => dictionary[isEnglish(lang) ? "en" : "fr-CA"];
