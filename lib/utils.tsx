import GiderimLogo from "@/components/blocks/giderim-logo";
import IconGithub from "@/components/icons/github";
import { IconSmashing } from "@/components/icons/smashing";
import { IconWorld } from "@tabler/icons-react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formattedDate = (date: string) =>
	new Date(date).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});
export const formattedDateTimeline = (
	date: string,
	formatOpts?: Intl.DateTimeFormatOptions | undefined,
) =>
	new Date(date).toLocaleDateString(
		"en-US",
		formatOpts
			? formatOpts
			: {
					year: "numeric",
				},
	);

export const navItems = [
	{ href: "/", label: "Readme" },
	// { href: "/changelog", label: "Changelog" },
	// { href: "/notes", label: "Notes" }, // disabled for now
	{ href: "/projects", label: "Projects" },
	// { href: "/stack", label: "Stack" },
];

// export const careerItems = [
// 	{
// 		from: 2021,
// 		to: null,
// 		title: "Code Janitor & Digital Mess Cleaner",
// 		company: { name: "Defter", url: "https://birdefter.com" },
// 		location: "Istanbul, Turkey",
// 		// description: "I am currently working at my job.",
// 		subRoles: [
// 			{
// 				from: 2019,
// 				to: 2021,
// 				title: "Full Stack Developer",
// 				company: { name: "Defter", url: "https://birdefter.com" },
// 				location: "Podgorica, Montenegro",
// 				description:
// 					"I was responsible for the development of the company's CRM/ERP products.",
// 			},
// 		],
// 	},
// 	{
// 		from: 2018,
// 		to: 2018,
// 		title: "Full Stack Developer",
// 		company: { name: "90Pixel", url: "https://90pixel.com" },
// 		location: "Izmir, Turkey",
// 		description:
// 			"I worked as a Full Stack Developer at 90Pixel for two months, after which I accepted an offer from Defter and relocated to Montenegro.",
// 	},
// 	{
// 		from: 2017,
// 		to: 2018,
// 		title: "Full Stack Developer",
// 		company: { name: "Freelancer", url: null },
// 		location: "Izmir, Turkey",
// 		description:
// 			"I took a gap year to pursue my passion for freelance work. This experience allowed me to gain invaluable skills and provided the opportunity to work with a diverse range of clients.",
// 	},
// 	{
// 		from: 2015,
// 		to: 2017,
// 		title: "Co Founder",
// 		company: { name: "whodidthis.io", url: null },
// 		location: "Izmir, Turkey",
// 		description:
// 			"I created usable web interfaces, front-end coding, and almost everything required to build a startup. After sharing this entrepreneurship passion for nearly 2 years, sadly my partners and I had to say goodbye to our lovely startup for now.",
// 	},
// 	{
// 		from: 2015,
// 		to: 2015,
// 		title: "Frontend Developer",
// 		company: { name: "Alegra Digital", url: null },
// 		location: "Istanbul, Turkey",
// 		description:
// 			"I have 10 months of hands-on experience as a front-end developer in Alegra Digital. I quit my job there to follow my dreams: whodidthis.io",
// 	},
// 	{
// 		from: 2012,
// 		to: 2015,
// 		title: "Full Stack Developer",
// 		company: { name: "Efabrika", url: "https://efabrika.com" },
// 		location: "Istanbul, Turkey",
// 		description:
// 			"I provided front end & back-end development for reputable clients such as Anadolu Agency, Turkish Airlines, etc. My responsibilities included UI, UX, and API development.",
// 	},
// 	{
// 		from: 2012,
// 		to: 2012,
// 		title: "Full Stack Developer",
// 		company: { name: "Atölye15", url: "https://atolye15.com" },
// 		location: "Izmir, Turkey",
// 		description:
// 			"After working as a full stack developer for an Izmir-based company; Atölye15, I accepted the great offer from Efabrika and moved to Istanbul.",
// 	},
// 	{
// 		from: 2010,
// 		to: 2012,
// 		title: "Full Stack Developer",
// 		company: { name: "LMS", url: null },
// 		location: "Izmir, Turkey",
// 		description:
// 			"I provided front end & back-end development for the company's Learning Management System for about 2 years.",
// 	},
// ];

const dateFormat = {
	day: {
		year: "numeric" as const,
		month: "long" as const,
		day: "numeric" as const,
	},
	month: {
		year: "numeric" as const,
		month: "long" as const,
	},
	year: {
		year: "numeric" as const,
	},
};

type PhotoItem = {
  id?: string;
  src: string;             // 原来是 "/changelog/xxxxx.png"，现在可以是外部 URL 或相对路径
  thumb?: string;          // 可选缩略图 URL（也可以是相对路径）
  variant?: "1x1" | "4x3" | "4x5" | "9x16";
  caption?: string;
  place?: string;
  date?: string;           // ISO 字符串（可用于排序/展示）
  camera?: string;
  width?: number;
  height?: number;
};

type ChangelogItem = {
  date: string;
  event: string;
  title: string;
  description?: string;
  icon?: string;
  dateFormatOptions?: Intl.DateTimeFormatOptions; //(typeof dateFormat)[keyof typeof dateFormat]
  photos?: PhotoItem[];
};

const changelogItems: ChangelogItem[] = [
	{
		date: "2025-10-20",
		event: "I'm not gonna share my life anymore.",
		description: "Your data belongs to you.",
		title: "Istanbul",
		icon: "🇹🇷",
		dateFormatOptions: dateFormat.day,
	},
	{
		date: "2024-07-01",
		event: "Visit to Portugal",
		title: "Madeira Island",
		icon: "🇵🇹",
		dateFormatOptions: dateFormat.month,
		photos: [
			{
				src: "/changelog/madeira.png",
				variant: "4x5",
			},
			{
				src: "/changelog/madeira-2.png",
				variant: "4x5",
			},
			{
				src: "/changelog/madeira-3.png",
				variant: "4x5",
			},
			{
				src: "/changelog/madeira-4.png",
				variant: "4x5",
			},
			{
				src: "/changelog/madeira-5.png",
				variant: "4x5",
			},
			{
				src: "/changelog/madeira-6.png",
				variant: "4x5",
			},
			{
				src: "/changelog/madeira-7.png",
				variant: "4x5",
			},
			{
				src: "/changelog/madeira-8.png",
				variant: "4x5",
			},
			{
				src: "/changelog/madeira-9.png",
				variant: "4x5",
			},
			{
				src: "/changelog/madeira-10.png",
				variant: "4x5",
			},
		],
	},
	{
		date: "2021-06-16",
		event: "Honeymoon",
		title: "Zanzibar",
		description: "We went to Zanzibar for our honeymoon.",
		icon: "🏝️",
		dateFormatOptions: dateFormat.day,
		photos: [
			{
				src: "/changelog/zanzibar-1.png",
				variant: "1x1",
			},
			{
				src: "/changelog/zanzibar-2  4x5.png",
				variant: "4x5",
			},
			{
				src: "/changelog/zanzibar-3.png",
				variant: "1x1",
			},
			{
				src: "/changelog/zanzibar-4.png",
				variant: "1x1",
			},
		],
	},
	{
		date: "2024-04-01",
		event: "Visit to Germany",
		title: "Konstanz",
		icon: "🇩🇪",
		dateFormatOptions: dateFormat.month,
		photos: [
			{
				src: "/changelog/konstanz.jpg",
				variant: "4x5",
			},
		],
	},
	{
		date: "2008-01-01",
		event: "Education",
		title: "Drop out from Ege University",
		description:
			"I decided to drop out from university to pursue my career in software development.",
		icon: "🎓",
	},
	{
		date: "2005-01-01",
		event: "Education",
		title: "I started my university education at Ege University",
		description: "My major was football trainer 😀",
		icon: "🎓",
	},
	{
		date: "2002-01-01",
		event: "Football",
		title: "I started playing football",
		description:
			"I played football for 6 years. I was actually very good at it.",
		icon: "⚽",
	},
	{
		date: "1988-02-10",
		event: "Born",
		title: "I was born in 🇧🇬 Bulgaria, Khardzali.",
		description: "2nd child of the family. I have an older sister.",
		icon: "👶🏻",
		dateFormatOptions: dateFormat.day,
		photos: [
			{
				src: "/changelog/bg.png",
				variant: "1x1",
			},
			{
				src: "/changelog/bg-2 4x3.png",
				variant: "4x3",
			},
			{
				src: "/changelog/bg-3 4x3.png",
				variant: "4x3",
			},
		],
	},
] as const;

// 从环境变量读取基址，方便一次性切换到对象存储域名
const PHOTO_BASE = process.env.NEXT_PUBLIC_PHOTO_BASE || ""; // 例如 "https://cdn.example.com"

// 简单解析：如果已是完整 URL 则原样返回；否则把基址和相对路径拼接
function resolveSrc(s?: string) {
  if (!s) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  // 确保没有重复斜杠
  if (!PHOTO_BASE) return s; // 若没有配置基址，则保留相对路径
  return PHOTO_BASE.replace(/\/$/, "") + "/" + s.replace(/^\//, "");
}

export const changelog = changelogItems
  .map((item) => ({
    ...item,
    photos: item.photos?.map((p) => ({
      ...p,
      src: resolveSrc(p.src),
      thumb: resolveSrc(p.thumb),
    })),
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// export const projects = [
// 	{
// 		name: "gider.im",
// 		githubSlug: "needim/gider.im-pwa",
// 		released: "2024-05-26",
// 		description: "(MVP) Privacy focused income & expense tracking app.",
// 		logo: <GiderimLogo className="size-10" />,
// 		links: [
// 			{
// 				href: "https://gider.im",
// 				label: "Website",
// 				icon: IconWorld,
// 			},
// 			{
// 				href: "https://github.com/needim/gider.im-pwa",
// 				label: "GitHub",
// 				icon: IconGithub,
// 			},
// 		],
// 		metrics: [] as Array<{ label: string; value: number }>,
// 		featured: true,
// 	},
// 	{
// 		name: "smashing.tools",
// 		githubSlug: "smashing-tools/smashing.tools",
// 		released: "2023-12-25",
// 		logo: <IconSmashing className="size-10" />,
// 		description:
// 			"Curated best starter kits, UI components & resources. Maybe I'll add something here someday.",
// 		links: [
// 			{
// 				href: "https://smashing.tools",
// 				label: "Website",
// 				icon: IconWorld,
// 			},
// 			{
// 				href: "https://github.com/smashing-team/smashing.tools",
// 				label: "GitHub",
// 				icon: IconGithub,
// 			},
// 		],
// 		featured: true,
// 		metrics: [],
// 	},
// 	{
// 		name: "ned.im",
// 		githubSlug: "needim/ned.im",
// 		released: "2023-01-01",
// 		logo: <></>,
// 		deprecated: true,
// 		description: "You're currently browsing this website.",
// 		links: [{ href: "/", label: "Website", icon: IconWorld }],
// 		featured: false,
// 		metrics: [],
// 	},
// 	{
// 		name: "noty",
// 		githubSlug: "needim/noty",
// 		released: "2023-01-01",
// 		logo: <IconGithub className="size-10" />,
// 		deprecated: true,
// 		description:
// 			"A dependency-free, notification plugin with no deps. ⛔️ Deprecated.",
// 		links: [
// 			{ href: "/noty", label: "Website", icon: IconWorld },
// 			{
// 				href: "https://github.com/needim/noty",
// 				label: "GitHub",
// 				icon: IconGithub,
// 			},
// 		],
// 		featured: true,
// 		metrics: [],
// 	},

// 	{
// 		name: "Kit 2.5D",
// 		githubSlug: "needim/Kit25D",
// 		released: "2017-11-16",
// 		logo: <></>,
// 		description:
// 			"Creating fake 3D world with 2D colliders and sprites in Unity.",
// 		links: [
// 			{
// 				href: "https://github.com/needim/Kit25D",
// 				label: "GitHub",
// 				icon: IconGithub,
// 			},
// 		],
// 		featured: false,
// 		metrics: [],
// 	},
// ];
