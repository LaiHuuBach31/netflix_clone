import { Button } from "antd";
import { Link } from "react-router-dom";

type HeaderProps = {
	title: string;
}
const Header = ({ title }: HeaderProps) => {
	return (
		<header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
			<div className="bg-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
					<h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
					<Link to="/">
						<Button className="shadow-lg font-medium">
							Website
						</Button>
					</Link>
				</div>
			</div>

		</header>
	);
};
export default Header;
