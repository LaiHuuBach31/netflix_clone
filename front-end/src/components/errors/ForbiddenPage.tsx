import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const ForbiddenPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center p-5">
            <div className="bg-white/10 p-10 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-white text-5xl mb-4">403</h1>
                <h2 className="text-white text-2xl mb-4">Forbidden</h2>
                <p className="text-white text-base mb-6">
                    Oops! It seems you don’t have permission to access this page. Please contact an
                    administrator if you believe this is an error.
                </p>
              
                <Button
                    type="primary"
                    size="large"
                    className="bg-[red] p-6 text-[white] font-[500] border-none rounded-none hover:!text-[white] hover:!bg-[red]bg-[red] p-6 text-[white] font-[800] border-none rounded-none hover:!text-[white] hover:!bg-[red]bg-[red] p-6 text-[white] font-[800] border-none rounded-none hover:!text-[white] hover:!bg-[red]bg-[red] p-6 text-[white] font-[800] border-none rounded-none hover:!text-[white] hover:!bg-[red]bg-[red] p-6 text-[white] font-[800] border-none rounded-none hover:!text-[white] hover:!bg-[red]"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
};

export default ForbiddenPage;