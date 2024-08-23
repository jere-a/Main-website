import * as React from 'react';
import Link from 'next/link';
// import { cva } from 'class-variance-authority';

import '../../global.css';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

type Props = {
	children: React.ReactNode;
	active: string | undefined;
}

const activefunc = (active: string | undefined, menulink: string) => {
	if (active == menulink) return 'bg-blue-950';
}

const NavMenu: React.FC<Props> = ({children, active}) => {
  return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<Link href="/" legacyBehavior passHref>
						<NavigationMenuLink
							className={`${navigationMenuTriggerStyle()} ${activefunc(active, 'koti')} animate__animated animate__bounceIn`}
							aria-label="Koti"
						>
							Koti
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Link href="/images/" legacyBehavior passHref>
						<NavigationMenuLink
							className={`${navigationMenuTriggerStyle()} ${activefunc(active, 'kuvat')} animate__animated animate__bounceIn`}
							aria-label="Kuvat"
						>
							Kuvat
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Link href="/blog/" legacyBehavior passHref>
						<NavigationMenuLink
							className={`${navigationMenuTriggerStyle()} ${activefunc(active, 'blog')} animate__animated animate__bounceIn`}
						>
							Blog
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink>{children}</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
  );
};

export default NavMenu;