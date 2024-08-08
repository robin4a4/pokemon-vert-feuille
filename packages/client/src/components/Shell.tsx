import { type PropsWithChildren, useState } from "react";
import {
	AppBar,
	Button,
	MenuList,
	MenuListItem,
	Separator,
	Toolbar,
} from "react95";
import logoIMG from "../assets/logo.png";
import { Link } from "react-router-dom";
import { AppRoute } from "../consts";
import { useLogoutMutation } from "../mutations";
export function Shell({ children }: PropsWithChildren) {
	const [open, setOpen] = useState(false);
    const logoutMutation = useLogoutMutation();

	return (
		<main>
			<AppBar>
				<Toolbar style={{ justifyContent: "space-between" }}>
					<div style={{ position: "relative", display: "inline-block" }}>
						<Button
							onClick={() => setOpen(!open)}
							active={open}
							style={{ fontWeight: "bold" }}
						>
							<img
								src={logoIMG}
								alt="react95 logo"
								style={{ height: "20px", marginRight: 4 }}
							/>
							Start
						</Button>
						{open && (
							<MenuList
								style={{
									position: "absolute",
									left: "0",
									top: "100%",
								}}
								onClick={() => setOpen(false)}
							>
								<MenuListItem>
									<span role="img" aria-label="👨‍💻">
										👨‍💻
									</span>
									Profile
								</MenuListItem>
                                {/* @ts-ignore */}
								<MenuListItem as={Link} to={AppRoute.DASHBOARD}>
									<span role="img" aria-label="📁">
										📁
									</span>
									Dashboard
								</MenuListItem>
								<Separator />
								<MenuListItem as="button" onClick={() => logoutMutation.mutate()}>
									<span role="img" aria-label="🔙">
										🔙
									</span>
									Logout
								</MenuListItem>
							</MenuList>
						)}
					</div>
				</Toolbar>
			</AppBar>
			<section className="!mt-16 p-8">{children}</section>
		</main>
	);
}
