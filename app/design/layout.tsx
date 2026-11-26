import { Switcher } from "./Switcher";

export default function DesignLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<style>{"html,body{margin:0;padding:0}"}</style>
			{children}
			<Switcher />
		</>
	);
}
