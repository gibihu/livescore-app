import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavGroup, type NavItem } from '@/types';
import { AuthType } from '@/types/auth';
import { UserType } from '@/types/user';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ChartSpline, CirclePoundSterling, Folder, HandCoins, LayoutGrid, NotebookPen, SwatchBook, TicketSlash, UsersRound, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

import dash from '@/routes/dash';
import web from '@/routes/web';
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dash.wallet().url,
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const auth = usePage().props.auth as AuthType;
    const user = auth?.user as UserType;
    const mainNavItems: NavGroup[] = [
        {
            title: "พื้นที่สนุกสนาน",
            items: [
                {
                    title: "ภาพรวม",
                    href: dash.index().url,
                    icon: ChartSpline
                },
                {
                    title: "กระเป๋า",
                    href: dash.wallet().url,
                    icon: Wallet
                },
                {
                    title: "เติมพอยต์",
                    href: dash.point().url,
                    icon: CirclePoundSterling
                },
                {
                    title: "ทีเด็ด",
                    href: dash.post.index().url,
                    icon: NotebookPen
                },
            ],
            icon: undefined
        },
        // ถ้า user เป็น admin ค่อยเพิ่ม "พื้นที่ทำงาน"
        ...(user?.role_text === "admin"
            ? [
                {
                    title: "พื้นที่ทำงาน",
                    items: [
                        {
                            title: "ผู้ใช้",
                            href: dash.admin.users.table().url,
                            isActive: true,
                            icon: UsersRound
                        },
                        {
                            title: "ทีเด็ดทั้งหมด",
                            href: dash.admin.post.table().url,
                            isActive: true,
                            icon: SwatchBook,
                        },
                        {
                            title: "รายการพอยต์",
                            href: dash.admin.users.payment().url,
                            isActive: true,
                            icon: HandCoins
                        },
                        {
                            title: "รายงาน",
                            href: dash.admin.post.report.list().url,
                            isActive: true,
                            icon: TicketSlash,
                        },
                    ],
                    icon: undefined
                }
            ]
            : [])
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={web.home()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>


            <SidebarContent>
                {/* We create a SidebarGroup for each parent. */}
                {mainNavItems.map((item) => {
                    return (
                        <SidebarGroup key={item.title}>
                            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {item.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <Link href={item.href} prefetch>
                                                <SidebarMenuButton tooltip={item.title} className="cursor-pointer">
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
